import { HttpException, Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from './entities/contact.entity';
import { IFilterParams } from 'src/app/helpers/pick';
import paginationHelper, { IOptions } from 'src/app/helpers/pagenation';
import buildWhereConditions from 'src/app/helpers/buildWhereConditions';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name)
    private readonly contactModel: Model<ContactDocument>,
  ) {}

  async createContact(createContactDto: CreateContactDto) {
    const result = await this.contactModel.create(createContactDto);

    return result;
  }

  async getAllContacts(params: IFilterParams, options: IOptions) {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper(options);
    const searchAbleFields = ['fullName', 'email', 'phoneNumber', 'message'];

    const whenConditation = buildWhereConditions(params, searchAbleFields);

    const result = await this.contactModel
      .find(whenConditation)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const total = await this.contactModel.countDocuments(whenConditation);

    return {
      meta: {
        page,
        limit,
        total,
      },
      data: result,
    };
  }

  async getSingleContact(id: string) {
    const result = await this.contactModel.findById(id);
    if (!result) throw new HttpException('Contact is not found', 404);
    return result;
  }

  async updateContact(id: string, updateContactDto: UpdateContactDto) {
    const result = await this.contactModel.findByIdAndUpdate(
      id,
      updateContactDto,
      {
        new: true,
      },
    );
    return result;
  }

  async deleteContact(id: string) {
    const result = await this.contactModel.findByIdAndDelete(id);
    return result;
  }
}
