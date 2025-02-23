import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Role } from 'src/enums/role.enum';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  fullName: string;

  @Prop({ type: String })
  password: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  })
  companyId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, enum: Role, default: Role.USER })
  role: Role;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: String })
  otpCode: string;

  @Prop({ type: Date })
  otpCodeValidateDate: Date;
}

export const userSchema = SchemaFactory.createForClass(User);
