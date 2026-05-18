import {
  Controller,
  Post,
  Param,
  Req,
  UseGuards,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import type { Request } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import AuthGuard from 'src/app/middlewares/auth.guard';
import pick from 'src/app/helpers/pick';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post(':subscribeId')
  @ApiOperation({
    summary: 'Create payment intent for subscription',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('user'))
  async paySubscribe(
    @Req() req: Request,
    @Param('subscribeId') subscribeId: string,
  ) {
    const result = await this.paymentService.paySubscribe(
      req.user!.id,
      subscribeId,
    );
    return {
      message: 'Payment intent created successfully',
      data: result,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all payments' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @ApiQuery({
    name: 'searchTerm',
    required: false,
    type: String,
    example: '',
    description: 'Search by ',
  })
  @ApiQuery({
    name: 'paymentType',
    required: false,
    type: String,
    example: '',
    description: 'Filter by paymentType value',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    example: '',
    description: 'Filter by status value',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number. Default is 1',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Items per page. Default is 10',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    example: 'createdAt',
    description: 'Sort field. Default is createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    example: 'desc',
    description: 'Sort order. Default is desc',
  })
  @HttpCode(HttpStatus.OK)
  async getAllPayment(@Req() req: Request) {
    const filters = pick(req.query, ['searchTerm', 'paymentType', 'status']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await this.paymentService.getAllPayment(filters, options);
    return {
      message: 'Payment retrieved successfully',
      meta: result.meta,
      data: result.data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by id' })
  @HttpCode(HttpStatus.OK)
  async getSinglePayment(@Param('id') id: string) {
    const result = await this.paymentService.getSinglePayment(id);
    return {
      message: 'Payment retrieved successfully',
      data: result,
    };
  }
}
