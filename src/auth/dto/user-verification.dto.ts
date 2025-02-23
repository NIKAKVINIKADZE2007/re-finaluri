import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class UserVerificationDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;
}
