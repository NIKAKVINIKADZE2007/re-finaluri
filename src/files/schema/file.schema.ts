import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class File {
  @Prop({ type: String, required: true })
  fileName: string;

  @Prop({ type: String, required: true })
  fileUrl: string;

  @Prop({ type: String, required: true })
  fileType: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  uploadedBy: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  })
  companyId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] })
  visibleTo: mongoose.Schema.Types.ObjectId[];
}

export const FileSchema = SchemaFactory.createForClass(File);
