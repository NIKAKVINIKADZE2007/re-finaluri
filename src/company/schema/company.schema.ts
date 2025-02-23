import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Industry } from 'src/enums/industry.enum';
import { Role } from 'src/enums/role.enum';
import { SubscriptionPlan } from 'src/enums/subscriptions.enum';

@Schema({ timestamps: true })
export class Company {
  @Prop({ type: String, required: true })
  companyName: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  country: string;

  @Prop({
    type: String,
    enum: Industry,
    default: Industry.OTHER,
    required: true,
  })
  industry: Industry;

  @Prop({ type: String, enum: Role, default: Role.ADMIN })
  role: Role;

  @Prop({
    type: String,
    enum: SubscriptionPlan,
    default: SubscriptionPlan.FREE,
  })
  subscriptionPlan: SubscriptionPlan;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] })
  users: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'File', default: [] })
  files: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: Number, required: true, default: 0 })
  price: number;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: String })
  otpCode: string;

  @Prop({ type: Date })
  otpCodeValidateDate: Date;
}

export const companySchema = SchemaFactory.createForClass(Company);
