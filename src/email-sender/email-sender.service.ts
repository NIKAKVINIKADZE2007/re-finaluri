import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailSenderService {
  constructor(private emailService: MailerService) {}

  async sendEmailText(to, subject, text) {
    const options = {
      from: 'WEB 10 finaluri',
      to,
      subject,
      text,
    };

    const info = await this.emailService.sendMail(options);
    console.log('Email sent Successfully');
  }
}
