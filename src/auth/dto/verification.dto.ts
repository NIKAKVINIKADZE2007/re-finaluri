import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerificationDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  otpCode: string;
}
