import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';
import { UpdateSubscribeDto } from './dto/update-subscribe.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import AuthGuard from 'src/app/middlewares/auth.guard';
import type { Request } from 'express';
import pick from 'src/app/helpers/pick';

@ApiTags('subscribe')
@Controller('subscribe')
export class SubscribeController {
  constructor(private readonly subscribeService: SubscribeService) {}

  @Post()
  @ApiOperation({
    summary: 'Subscribe plan create',
  })
  @ApiBearerAuth('access-token')
  @ApiBody({ type: CreateSubscribeDto })
  @UseGuards(AuthGuard('admin'))
  @HttpCode(HttpStatus.CREATED)
  async createSubscribe(@Body() createSubscribeDto: CreateSubscribeDto) {
    const result =
      await this.subscribeService.createSubscribe(createSubscribeDto);

    return {
      message: 'subscribe create successfuly',
      data: result,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Get subscribe plan',
  })
  @ApiQuery({
    name: 'searchTerm',
    required: false,
    type: String,
    example: '',
    description: 'Search by ',
  })
  @ApiQuery({
    name: 'features',
    required: false,
    type: String,
    example: '',
    description: 'Filter by exact features',
  })
  @ApiQuery({
    name: 'planName',
    required: false,
    type: String,
    example: '',
    description: 'Filter by planName',
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
  async findAll(@Req() req: Request) {
    const filters = pick(req.query, ['searchTerm', 'features', 'planName']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await this.subscribeService.getAllSubscribe(
      filters,
      options,
    );

    return {
      message: 'subscribe find successfuly',
      data: result,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get one subscribe plan',
  })
  async findOne(@Param('id') id: string) {
    const result = await this.subscribeService.getSingleSubscribe(id);

    return {
      message: 'subscribe find successfuly',
      data: result,
    };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update one subscribe plan',
  })
  @ApiBearerAuth('access-token')
  @ApiBody({ type: UpdateSubscribeDto })
  @UseGuards(AuthGuard('admin'))
  async update(
    @Param('id') id: string,
    @Body() updateSubscribeDto: UpdateSubscribeDto,
  ) {
    const result = await this.subscribeService.updateSubscribe(
      id,
      updateSubscribeDto,
    );

    return {
      message: 'subscribe updated successfuly',
      data: result,
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete one subscribe plan',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  async remove(@Param('id') id: string) {
    const result = await this.subscribeService.deleteSubscribe(id);

    return {
      message: 'subscribe deleted successfuly',
      data: result,
    };
  }
}
