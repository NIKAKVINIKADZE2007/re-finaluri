import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';

import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from './schema/company.schema';
import { User } from 'src/user/schema/user.schema';
import { EmailSenderService } from 'src/email-sender/email-sender.service';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel('company') private companyModel: Model<Company>,
    @InjectModel('user') private userModel: Model<User>,
    private emailSender: EmailSenderService,
  ) {}

  async addUser(email, companyId) {
    const exsistCompany = await this.companyModel.findById(companyId);
    if (!exsistCompany) throw new NotFoundException('company not found');

    let message = 'user Added verify Email';

    if (
      exsistCompany.subscriptionPlan === 'free' &&
      exsistCompany.users.length == 1
    ) {
      throw new BadRequestException({
        message: 'upgrade your subscription plan if you want to add more users',
        currentSubscriptionPlan: exsistCompany.subscriptionPlan,
      });
    }

    if (
      exsistCompany.subscriptionPlan === 'basic' &&
      exsistCompany.users.length == 2
    ) {
      throw new BadRequestException({
        message: 'upgrade your subscription plan if you want to add more users',
        currentSubscriptionPlan: exsistCompany.subscriptionPlan,
      });
    }

    const exsistUser = await this.userModel.findOne({ email });
    if (exsistUser) throw new BadRequestException('user already exsists');

    const otpCode = Math.random().toString().slice(2, 8);
    const otpCodeValidateDate = new Date();

    if (exsistCompany.subscriptionPlan === 'basic') {
      await this.companyModel.findByIdAndUpdate(
        companyId,
        {
          $set: { price: exsistCompany.price + 5 },
        },
        { new: true },
      );
    }

    const newUser = await this.userModel.create({
      email,
      otpCode,
      otpCodeValidateDate,
      companyId,
    });
    await this.companyModel.findByIdAndUpdate(
      companyId,
      { $push: { users: newUser._id } },
      { new: true },
    );

    await this.emailSender.sendEmailText(email, 'Verification Code', otpCode);

    return { message, currentSubscriptionPlan: exsistCompany.subscriptionPlan };
  }

  findAll() {
    return `This action returns all company`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
