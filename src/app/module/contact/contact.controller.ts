import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import pick from 'src/app/helpers/pick';
import AuthGuard from 'src/app/middlewares/auth.guard';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiOperation({
    summary: 'create contact',
  })
  @ApiBody({
    type: CreateContactDto,
  })
  @HttpCode(HttpStatus.CREATED)
  async createContact(@Body() createContactDto: CreateContactDto) {
    const result = await this.contactService.createContact(createContactDto);

    return {
      message: 'Contact create successfully',
      data: result,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'get all contacts',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @ApiQuery({
    name: 'searchTerm',
    required: false,
    type: String,
    example: '',
    description: 'Search by  fullName, email, phoneNumber, message',
  })
  @ApiQuery({
    name: 'fullName',
    required: false,
    type: String,
    example: '',
    description: 'Filter by exact fullName',
  })
  @ApiQuery({
    name: 'email',
    required: false,
    type: String,
    example: '',
    description: 'Filter by exact email value',
  })
  @ApiQuery({
    name: 'phoneNumber',
    required: false,
    type: String,
    example: '',
    description: 'Filter by phone number',
  })
  @ApiQuery({
    name: 'message',
    required: false,
    type: String,
    example: '',
    description: 'Message by status value',
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
  async getAllContacts(@Req() req: Request) {
    const filters = pick(req.query, [
      'searchTerm',
      'fullName',
      'email',
      'phoneNumber',
      'message',
    ]);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await this.contactService.getAllContacts(filters, options);

    return {
      message: 'Contacts retrieved successfully',
      meta: result.meta,
      data: result.data,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'get contact by id',
  })
  async findContact(@Param('id') id: string) {
    const result = await this.contactService.getSingleContact(id);

    return {
      message: 'Contact retrieved successfully',
      data: result,
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'update contact by id',
  })
  @ApiBearerAuth('access-token')
  @ApiBody({ type: UpdateContactDto })
  @UseGuards(AuthGuard('admin'))
  async updateContact(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    const result = await this.contactService.updateContact(
      id,
      updateContactDto,
    );

    return {
      message: 'Contact updated successfully',
      data: result,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'delete contact by id',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  async deleteContact(@Param('id') id: string) {
    const result = await this.contactService.deleteContact(id);

    return {
      message: 'Contact deleted successfully',
      data: result,
    };
  }
}
