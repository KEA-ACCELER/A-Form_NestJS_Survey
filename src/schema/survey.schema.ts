import { ABQuestion } from '@/schema/ab-question.schema';
import { Question } from '@/schema/question.schema';
import { Status } from '@/common/enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type SurveyDocument = HydratedDocument<Survey>;

@Schema({
  timestamps: true,
})
export class Survey {
  @ApiProperty({
    type: String,
  })
  _id: string;

  @ApiProperty({
    type: String,
  })
  @Prop({ type: String, required: true })
  title: string;

  @ApiProperty({
    type: Number,
  })
  @Prop({ type: Number, required: true })
  author: number;

  @ApiProperty({
    type: Date,
  })
  @Prop({ type: Date, required: true })
  deadline: Date;

  @ApiProperty({
    isArray: true,
    // TODO: 해당 스키마 찾지 못하는 에러 확인 필요
    // oneOf: [
    //   {
    //     $ref: getSchemaPath(Question),
    //   },
    //   {
    //     $ref: getSchemaPath(ABQuestion),
    //   },
    // ],
  })
  // Mongoose 스키마에서는 배열의 각 요소가 다른 유형 가질 수 없음
  @Prop({
    type: [mongoose.Schema.Types.Mixed],
    required: true,
  })
  questions: Question[] | ABQuestion[];

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

  @ApiProperty({
    type: String,
  })
  @Prop({ type: String })
  description?: string;

  @ApiProperty({
    isArray: true,
  })
  @Prop({
    type: [[Number, String]],
  })
  statistics?: (number | string)[][];

  constructor(
    _id: string,
    title: string,
    author: number,
    deadline: Date,
    questions: Question[] | ABQuestion[],
    createdAt: Date,
    updatedAt: Date,
    status: Status,
    description?: string,
    statistics?: (number | string)[][],
  ) {
    this._id = _id;
    this.title = title;
    this.author = author;
    this.deadline = deadline;
    this.questions = questions;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.status = status;
    this.description = description;
    this.statistics = statistics;
  }
}

export const SurveySchema = SchemaFactory.createForClass(Survey);
