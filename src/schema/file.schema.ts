import { Status } from '@/common/constant/enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type FileDocument = HydratedDocument<File>;

@Schema({
  timestamps: true,
})
export class File {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Prop({ type: String })
  originName: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Prop({ type: String })
  s3Link: string;

  @ApiProperty({
    type: Date,
  })
  @Prop({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  @Prop({
    type: Date,
  })
  updatedAt: Date;

  @ApiProperty({
    enum: Status,
  })
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
