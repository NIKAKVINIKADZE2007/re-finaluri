import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { companySchema } from './schema/company.schema';
import { userSchema } from 'src/user/schema/user.schema';
import { EmailSenderModule } from 'src/email-sender/email-sender.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'company', schema: companySchema },
      { name: 'user', schema: userSchema },
    ]),
    EmailSenderModule,
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
