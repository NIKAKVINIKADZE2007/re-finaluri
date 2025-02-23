import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { EmailSenderModule } from 'src/email-sender/email-sender.module';
import { MongooseModule } from '@nestjs/mongoose';
import { companySchema } from 'src/company/schema/company.schema';
import { JwtModule } from '@nestjs/jwt';
import { userSchema } from 'src/user/schema/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EmailSenderModule,
    MongooseModule.forFeature([
      { name: 'company', schema: companySchema },
      { name: 'user', schema: userSchema },
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
