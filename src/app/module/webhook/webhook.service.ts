import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import config from 'src/app/config';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/entities/user.entity';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from '../payment/entities/payment.entity';
import {
  Subscribe,
  SubscribeDocument,
} from '../subscribe/entities/subscribe.entity';
import type { Response } from 'express';

@Injectable()
export class WebhookService {
  private readonly stripe?: Stripe;
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,

    @InjectModel(Subscribe.name)
    private readonly subscribeModel: Model<SubscribeDocument>,
  ) {
    if (config.stripe.secretKey) {
      this.stripe = new Stripe(config.stripe.secretKey);
    }
  }

  async handleWebhook(rawBody: Buffer, sig: string, res: Response) {
    if (!this.stripe || !config.stripe.webhookSecret) {
      return res
        .status(500)
        .json({ message: 'Stripe webhook is not configured' });
    }

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        sig,
        config.stripe.webhookSecret,
      );
    } catch (err: any) {
      this.logger.error(`Webhook signature error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(event, res);
          break;

        case 'payment_intent.payment_failed':
          await this.handlePaymentIntentFailed(event, res);
          break;

        default:
          this.logger.log(`Unhandled event type: ${event.type}`);
          return res.json({ received: true });
      }
    } catch (err: any) {
      this.logger.error(`Handler error: ${err.message}`);
      return res.status(500).send(`Webhook Handler Error: ${err.message}`);
    }
  }

  // ── payment_intent.succeeded ───────────────────────────────────────────────
  private async handlePaymentIntentSucceeded(
    event: Stripe.Event,
    res: Response,
  ) {
    const intent = event.data.object as Stripe.PaymentIntent;

    const payment = await this.paymentModel.findOne({
      stripePaymentIntentId: intent.id,
    });
    if (!payment) return res.json({ received: true });

    payment.status = 'completed';
    await payment.save();

    const paymentType = intent.metadata?.paymentType ?? payment.paymentType;

    if (paymentType === 'subscription') {
      const subscribeId =
        payment.subscribe?.toString() ?? intent.metadata?.subscribeId;
      if (!subscribeId) return res.json({ received: true });

      const plan = await this.subscribeModel.findById(subscribeId);
      if (!plan) return res.json({ received: true });

      // Add user to plan's users array if not already present
      const alreadyAdded = plan.user?.some(
        (id) => id.toString() === payment.user.toString(),
      );
      if (!alreadyAdded) {
        plan.user = plan.user ?? [];
        plan.user.push(payment.user);
        await plan.save();
      }

      return res.json({
        received: true,
        type: 'subscription',
        userId: payment.user,
        planId: plan._id,
      });
    }

    return res.json({ received: true });
  }

  // ── payment_intent.payment_failed ──────────────────────────────────────────
  private async handlePaymentIntentFailed(event: Stripe.Event, res: Response) {
    const intent = event.data.object as Stripe.PaymentIntent;

    const payment = await this.paymentModel.findOne({
      stripePaymentIntentId: intent.id,
    });
    if (payment) {
      payment.status = 'failed';
      await payment.save();
    }

    return res.json({ received: true });
  }
}
