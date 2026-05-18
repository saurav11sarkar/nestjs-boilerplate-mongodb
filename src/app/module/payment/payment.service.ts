import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './entities/payment.entity';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../user/entities/user.entity';
import {
  Subscribe,
  SubscribeDocument,
} from '../subscribe/entities/subscribe.entity';
import Stripe from 'stripe';
import config from 'src/app/config';
import { IFilterParams } from 'src/app/helpers/pick';
import paginationHelper, { IOptions } from 'src/app/helpers/pagenation';

@Injectable()
export class PaymentService {
  private readonly stripe?: Stripe;

  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Subscribe.name)
    private readonly subscribeModel: Model<SubscribeDocument>,
  ) {
    if (config.stripe.secretKey) {
      this.stripe = new Stripe(config.stripe.secretKey);
    }
  }

  private getStripeClient() {
    if (!this.stripe) {
      throw new HttpException('Stripe is not configured', 500);
    }

    return this.stripe;
  }

  async paySubscribe(userId: string, subscribeId: string) {
    const stripe = this.getStripeClient();

    // 1. Validate user
    const user = await this.userModel.findById(userId);
    if (!user) throw new HttpException('User not found', 404);

    // 2. Validate plan
    const plan = await this.subscribeModel.findById(subscribeId);
    if (!plan) throw new HttpException('Subscription plan not found', 404);

    // 3. Block if already completed
    const existingCompleted = await this.paymentModel.findOne({
      user: user._id,
      subscribe: plan._id,
      status: 'completed',
    });
    if (existingCompleted) {
      throw new HttpException('You already have this subscription', 400);
    }

    // 4. Reuse pending PaymentIntent if still usable
    const existingPending = await this.paymentModel.findOne({
      user: user._id,
      subscribe: plan._id,
      status: 'pending',
    });

    if (existingPending?.stripePaymentIntentId) {
      const existingPI = await stripe.paymentIntents.retrieve(
        existingPending.stripePaymentIntentId,
      );
      if (
        existingPI.status !== 'succeeded' &&
        existingPI.status !== 'canceled'
      ) {
        return {
          clientSecret: existingPI.client_secret,
          paymentIntentId: existingPI.id,
          amount: plan.price,
        };
      }
    }

    // 5. Create new PaymentIntent
    const amountInCents = Math.round(plan.price * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      payment_method_types: ['card'],
      receipt_email: user.email,
      metadata: {
        userId: user._id.toString(),
        subscribeId: plan._id.toString(),
        paymentType: 'subscription',
        price: plan.price.toString(),
      },
    });

    // 6. Save / update payment record in DB
    if (existingPending) {
      existingPending.stripePaymentIntentId = paymentIntent.id;
      existingPending.amount = plan.price;
      await existingPending.save();
    } else {
      await this.paymentModel.create({
        user: user._id,
        subscribe: plan._id,
        stripePaymentIntentId: paymentIntent.id,
        amount: plan.price,
        paymentType: 'subscription',
        status: 'pending',
      });
    }

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: plan.price,
    };
  }

  async getAllPayment(params: IFilterParams, options: IOptions) {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper(options);

    const userSearchAbleFields = ['paymentType', 'status'];

    const { searchTerm, ...filterData } = params;

    const whereConditions: Record<string, unknown> = {};
    const orConditions: Record<string, unknown>[] = [];

    if (searchTerm) {
      orConditions.push(
        ...userSearchAbleFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: 'i' },
        })),
      );
    }

    let userIds: Types.ObjectId[] = [];
    if (searchTerm) {
      const users = await this.userModel
        .find({
          $or: [
            { fullName: { $regex: searchTerm, $options: 'i' } },
            { email: { $regex: searchTerm, $options: 'i' } },
          ],
        })
        .select('_id');

      userIds = users.map((user) => user._id);
    }

    if (userIds.length > 0) {
      orConditions.push({ user: { $in: userIds } });
    }

    if (orConditions.length > 0) {
      whereConditions.$or = orConditions;
    }

    if (Object.keys(filterData).length) {
      whereConditions.$and = Object.entries(filterData).map(([key, value]) => ({
        [key]: value,
      }));
    }

    const total = await this.paymentModel.countDocuments(whereConditions);

    const users = await this.paymentModel
      .find(whereConditions)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .populate('user')
      .populate('subscribe');

    return {
      meta: {
        page,
        limit,
        total,
      },
      data: users,
    };
  }

  async getSinglePayment(id: string) {
    const payment = await this.paymentModel
      .findById(id)
      .populate('user')
      .populate('subscribe');

    if (!payment) {
      throw new HttpException('Payment not found', 404);
    }

    return payment;
  }
}
