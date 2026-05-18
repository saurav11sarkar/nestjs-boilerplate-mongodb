import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import AuthGuard from 'src/app/middlewares/auth.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  @ApiOperation({
    summary: 'Get dashboard overview data',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @HttpCode(HttpStatus.OK)
  async dashboardOverview() {
    const result = await this.dashboardService.dashboardOverView();

    return {
      message: 'Dashboard overview retrieved successfully',
      data: result,
    };
  }

  @Get('chart')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Total earning chart — monthly revenue, commission & payout',
  })
  @ApiQuery({ name: 'year', required: false, type: Number, example: 2026 })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  async getTotalEarningChart(@Query('year') year?: string) {
    const data = await this.dashboardService.getTotalEarningChart(
      year ? Number(year) : undefined,
    );
    return { message: 'Total earning chart fetched successfully', data };
  }
}
