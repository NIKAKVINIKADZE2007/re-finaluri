import { BadRequestException, Injectable } from '@nestjs/common';
import { CompanySignUpDto } from './dto/company-sign-up.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Company } from 'src/company/schema/company.schema';
import { EmailSenderService } from 'src/email-sender/email-sender.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { User } from 'src/user/schema/user.schema';
import { UserVerificationDto } from './dto/user-verification.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('company') private companyModel: Model<Company>,
    @InjectModel('user') private userModel: Model<User>,
    private emailSender: EmailSenderService,
    private jwtService: JwtService,
  ) {}

  async companySignUp(companySignUp: CompanySignUpDto) {
    const existUser = await this.companyModel.findOne({
      email: companySignUp.email,
    });

    if (existUser) throw new BadRequestException('company already exists');

    const hasedPassword = await bcrypt.hash(companySignUp.password, 10);
    const otpCode = Math.random().toString().slice(2, 8);
    const otpCodeValidateDate = new Date();
    otpCodeValidateDate.setTime(otpCodeValidateDate.getTime() + 3 * 60 * 1000);

    await this.companyModel.create({
      ...companySignUp,
      password: hasedPassword,
      otpCode,
      otpCodeValidateDate,
    });
    await this.emailSender.sendEmailText(
      companySignUp.email,
      'Verification Code',
      otpCode,
    );

    return 'Verify Email';
  }

  async verifyEmail(
    email: string,
    otpCode: string,
    role: string,
    userVerificationDto?: UserVerificationDto,
  ) {
    let model;
    model = role === 'admin' ? this.companyModel : this.userModel;
    const word = role === 'admin' ? 'company' : 'user';

    const user = await model.findOne({ email });

    if (!user) throw new BadRequestException(`${word} not found`);

    if (user.isVerified) {
      throw new BadRequestException(`${word} already verified`);
    }

    if (user.otpCodeValidateDate < new Date()) {
      throw new BadRequestException('Otp code is OutDated');
    }

    console.log(userVerificationDto);

    if (otpCode !== user.otpCode) {
      throw new BadRequestException('wrong otp code');
    }

    let hasedPassword;
    if (role === 'user') {
      hasedPassword = await bcrypt.hash(userVerificationDto.password, 10);
    }

    if (role === 'user') {
      await model.findByIdAndUpdate(user._id, {
        $set: {
          password: hasedPassword,
          fullName: userVerificationDto.fullName,
          isVerified: true,
          otpCode: null,
          otpCodeValidateDate: '',
        },
      });
    } else {
      await model.findByIdAndUpdate(user._id, {
        $set: {
          isVerified: true,
          otpCode: null,
          otpCodeValidateDate: '',
        },
      });
    }

    const payLoad = {
      id: user._id,
      role: user.role,
      ...(role === 'admin' && { subscriptionPlan: user.subscriptionPlan }),
    };

    const accessToken = await this.jwtService.sign(payLoad, {
      expiresIn: '1h',
    });

    return {
      message: `${word} verified successfully`,
      accessToken,
    };
  }

  async resendVerificationCode(email) {
    const existsCompany = await this.companyModel.findOne({ email });
    if (!existsCompany) throw new BadRequestException('company not found');

    if (existsCompany.isVerified)
      throw new BadRequestException('company already verified');

    const otpCode = Math.random().toString().slice(2, 8);
    const otpCodeValidateDate = new Date();
    otpCodeValidateDate.setTime(otpCodeValidateDate.getTime() + 3 * 60 * 1000);

    await this.companyModel.findByIdAndUpdate(existsCompany._id, {
      $set: { otpCode, otpCodeValidateDate },
    });

    await this.emailSender.sendEmailText(
      existsCompany.email,
      'Verification Code',
      otpCode,
    );

    return 'Verify Email';
  }

  async resendVerificationCodeForUser(email) {
    const exsistUser = await this.userModel.findOne({ email });
    if (!exsistUser) throw new BadRequestException('company not found');

    if (exsistUser.isVerified)
      throw new BadRequestException('user already verified');

    const otpCode = Math.random().toString().slice(2, 8);
    const otpCodeValidateDate = new Date();
    otpCodeValidateDate.setTime(otpCodeValidateDate.getTime() + 3 * 60 * 1000);

    await this.userModel.findByIdAndUpdate(exsistUser._id, {
      $set: { otpCode, otpCodeValidateDate },
    });

    await this.emailSender.sendEmailText(
      exsistUser.email,
      'Verification Code',
      otpCode,
    );

    return 'Verify Email';
  }

  async companySignIn({ email, password }: SignInDto) {
    const exsistCompany = await this.companyModel.findOne({ email });
    if (!exsistCompany)
      throw new BadRequestException('email or password is invalid');

    if (!exsistCompany.isVerified)
      throw new BadRequestException('you need to verify your account');

    const isPasswordEqaul = await bcrypt.compare(
      password,
      exsistCompany.password,
    );

    if (!isPasswordEqaul)
      throw new BadRequestException('email or password is invalid');

    const payLoad = {
      id: exsistCompany._id,
      role: exsistCompany.role,
      subscriptionPlan: exsistCompany.subscriptionPlan,
    };

    const accsessToken = await this.jwtService.sign(payLoad, {
      expiresIn: '1h',
    });

    return { accsessToken };
  }
}
