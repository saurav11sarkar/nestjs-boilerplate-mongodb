import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/entities/user.entity';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from '../payment/entities/payment.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
  ) {}

  async dashboardOverView() {
    const totalUser = await this.userModel.countDocuments();
    const activeUser = await this.userModel.countDocuments({
      status: 'active',
    });
    const suspended = await this.userModel.countDocuments({
      status: 'suspended',
    });

    const totalEarning = await this.paymentModel.aggregate([
      {
        $match: {
          status: 'completed',
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    return {
      totalUser,
      activeUser,
      suspended,
      totalEarning: totalEarning[0]?.total || 0,
    };
  }

  async getTotalEarningChart(year?: number) {
    const targetYear = year ?? new Date().getFullYear();

    const result = await this.paymentModel.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: {
            $gte: new Date(`${targetYear}-01-01`),
            $lte: new Date(`${targetYear}-12-31T23:59:59`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: '$createdAt' } },
          totalRevenue: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.month': 1 } },
    ]);

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const chartData = months.map((label, i) => {
      const found = result.find((r) => r._id.month === i + 1);
      const totalRevenue = found
        ? Number(Number(found.totalRevenue).toFixed(2))
        : 0;
      return { month: label, totalRevenue };
    });

    const totalYearRevenue = chartData.reduce((s, d) => s + d.totalRevenue, 0);

    return {
      year: targetYear,
      summary: {
        totalRevenue: Number(totalYearRevenue.toFixed(2)),
      },
      chartData,
    };
  }
}
