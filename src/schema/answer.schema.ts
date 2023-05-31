import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type AnswerDocument = HydratedDocument<Answer>;

@Schema({
  timestamps: true,
})
export class Answer {
  _id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
  })
  survey: Types.ObjectId;

  @Prop({
    type: String,
  })
  author: string;

  @Prop({
    type: Date,
  })
  createdAt: Date;

  @Prop({
    type: Date,
  })
  updatedAt: Date;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
  })
  answers: [string | number][] | string;

  constructor(
    _id: Types.ObjectId,
    survey: Types.ObjectId,
    author: string,
    createdAt: Date,
    updatedAt: Date,
    answers: [string | number][] | string,
  ) {
    this._id = _id;
    this.survey = survey;
    this.author = author;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.answers = answers;
  }
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
