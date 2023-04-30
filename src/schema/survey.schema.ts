import { Status } from '@/common/enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SurveyDocument = HydratedDocument<Survey>;

@Schema({
  timestamps: true,
})
export class Survey {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: Number, required: true })
  author: number;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({
    type: [
      {
        questions: [
          {
            title: {
              type: String,
            },
            type: {
              type: String,
            },
            selection: [
              {
                type: {
                  type: String,
                },
                content: {
                  type: String,
                },
              },
            ],
          },
        ],
      },
    ],
    required: true,
  })
  questions: {
    title: string;
    type: string;
    selection: {
      type: number;
      content: string;
    }[];
  }[];

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

  @Prop({
    type: [[Number, String]],
  })
  statistics?: (number | string)[][];

  constructor(
    title: string,
    author: number,
    date: Date,
    questions: {
      title: string;
      type: string;
      selection: {
        type: number;
        content: string;
      }[];
    }[],
    createdAt: Date,
    updatedAt: Date,
    status: Status,
    description?: string,
    statistics?: (number | string)[][],
  ) {
    this.title = title;
    this.author = author;
    this.date = date;
    this.questions = questions;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.status = status;
    this.description = description;
    this.statistics = statistics;
  }
}

export const SurveySchema = SchemaFactory.createForClass(Survey);
