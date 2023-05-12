import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type AnswerDocument = HydratedDocument<Answer>;

@Schema({
  timestamps: true,
})
export class Answer {
  @ApiProperty({
    type: String,
  })
  _id: Types.ObjectId;

  @ApiProperty({
    type: String,
  })
  @Prop({
    type: Types.ObjectId,
  })
  survey: Types.ObjectId;

  @ApiProperty({
    type: String,
  })
  @Prop({
    type: String,
  })
  author: string;

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
    isArray: true,
  })
  @Prop({
    type: [[String, Number]],
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
