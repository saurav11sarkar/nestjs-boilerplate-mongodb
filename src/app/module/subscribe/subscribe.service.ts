import { HttpException, Injectable } from '@nestjs/common';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';
import { UpdateSubscribeDto } from './dto/update-subscribe.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subscribe, SubscribeDocument } from './entities/subscribe.entity';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/entities/user.entity';
import { IFilterParams } from 'src/app/helpers/pick';
import paginationHelper, { IOptions } from 'src/app/helpers/pagenation';
import buildWhereConditions from 'src/app/helpers/buildWhereConditions';

@Injectable()
export class SubscribeService {
  constructor(
    @InjectModel(Subscribe.name)
    private readonly subscribeModel: Model<SubscribeDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createSubscribe(createSubscribeDto: CreateSubscribeDto) {
    const { planName } = createSubscribeDto;
    const exist = await this.subscribeModel.findOne({ planName });
    if (exist) {
      throw new HttpException('alrady create this plan', 404);
    }
    const result = await this.subscribeModel.create(createSubscribeDto);
    return result;
  }

  async getAllSubscribe(params: IFilterParams, options: IOptions) {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper(options);

    const userSearchAbleFields = ['features', 'planName'];

    const whereConditions = buildWhereConditions(params, userSearchAbleFields);

    const total = await this.subscribeModel.countDocuments(whereConditions);
    const users = await this.subscribeModel
      .find(whereConditions)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .populate('user');

    return {
      meta: {
        page,
        limit,
        total,
      },
      data: users,
    };
  }

  async getSingleSubscribe(id: string) {
    const result = await this.subscribeModel.findById(id);
    if (!result) throw new HttpException('Subscribe is not found', 404);
    return result;
  }

  async updateSubscribe(id: string, updateSubscribeDto: UpdateSubscribeDto) {
    const isExist = await this.subscribeModel.findById(id);
    if (!isExist) throw new HttpException('not found', 404);
    const result = await this.subscribeModel.findByIdAndUpdate(
      id,
      updateSubscribeDto,
      {
        new: true,
      },
    );
    return result;
  }
  async deleteSubscribe(id: string) {
    const result = await this.subscribeModel.findByIdAndDelete(id);
    if (!result) throw new HttpException('not found', 404);
    return result;
  }
}
