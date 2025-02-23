import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  IsNumber,
} from 'class-validator';
import { Industry } from 'src/enums/industry.enum';
import { Role } from 'src/enums/role.enum';
import { SubscriptionPlan } from 'src/enums/subscriptions.enum';

export class CompanySignUpDto {
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsEnum(Industry)
  @IsNotEmpty()
  industry: Industry;
}
