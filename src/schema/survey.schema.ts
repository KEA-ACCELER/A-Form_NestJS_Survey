import { ABQuestion } from '@/schema/ab-question.schema';
import { Question } from '@/schema/question.schema';
import { Status, SurveyType } from '@/common/constant/enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type SurveyDocument = HydratedDocument<Survey>;

@Schema({
  timestamps: true,
})
export class Survey {
  _id: Types.ObjectId;

  @Prop({ type: String, enum: SurveyType, required: true })
  type: SurveyType;

  @Prop({ type: String, required: true })
  title: string;

  // User API에서 받은 userId
  @Prop({ type: String, required: true })
  author: string;

  // Mongoose 스키마에서는 배열의 각 요소가 다른 유형 가질 수 없음
  @Prop({
    type: [mongoose.Schema.Types.Mixed],
    required: true,
  })
  questions: Question[] | ABQuestion[];

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

  @Prop({ type: String })
  description?: string;

  constructor(
    _id: Types.ObjectId,
    type: SurveyType,
    title: string,
    author: string,
    questions: Question[] | ABQuestion[],
    createdAt: Date,
    updatedAt: Date,
    status: Status,
    description?: string,
  ) {
    this._id = _id;
    this.type = type;
    this.title = title;
    this.author = author;
    this.questions = questions;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.status = status;
    this.description = description;
  }
}

export const SurveySchema = SchemaFactory.createForClass(Survey);
