import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CompanySignUpDto } from './dto/company-sign-up.dto';
import { VerificationDto } from './dto/verification.dto';
import { SignInDto } from './dto/sign-in.dto';
import { UserVerificationDto } from './dto/user-verification.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('company/verify')
  verifyCompany(
    @Body() { email, otpCode }: VerificationDto,
    userVerificationDto: UserVerificationDto,
  ) {
    console.log(email, 'email');
    console.log(otpCode, 'controler otpCode');
    return this.authService.verifyEmail(
      email,
      otpCode,
      'admin',
      userVerificationDto,
    );
  }

  @Post('user/verify')
  verifyUser(
    @Body() { email, otpCode }: VerificationDto,
    @Body() userVerificationDto: UserVerificationDto,
  ) {
    return this.authService.verifyEmail(
      email,
      otpCode,
      'user',
      userVerificationDto,
    );
  }

  @Post('company/sign-up')
  companySignUp(@Body() companySignUpDto: CompanySignUpDto) {
    return this.authService.companySignUp(companySignUpDto);
  }

  @Post('company/resend-verification-code')
  resendVerificationCode(@Body('email') email) {
    return this.authService.resendVerificationCode(email);
  }

  @Post('user/resend-vefication-code')
  resendVerificationCodeForUser(@Body('email') email) {
    return this.authService.resendVerificationCodeForUser(email);
  }

  @Post('company/sign-in')
  companySignIn(@Body() signInDto: SignInDto) {
    return this.authService.companySignIn(signInDto);
  }
}
