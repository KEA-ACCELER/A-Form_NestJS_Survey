import { Status } from '@/common/constant/enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FileDocument = HydratedDocument<File>;

@Schema({
  timestamps: true,
})
export class File {
  @Prop({ type: String })
  originName: string;

  @Prop({ type: String })
  s3Link: string;

  @Prop({
    type: Date,
  })
  createdAt: Date;

  @Prop({
    type: Date,
  })
  updatedAt: Date;

  @Prop({
    type: String,
    enum: Status,
    default: Status.NORMAL,
  })
  status: Status;

  constructor(
    originName: string,
    s3Link: string,
    createdAt: Date,
    updatedAt: Date,
    status: Status,
  ) {
    this.originName = originName;
    this.s3Link = s3Link;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.status = status;
  }
}

export const FileSchema = SchemaFactory.createForClass(File);
