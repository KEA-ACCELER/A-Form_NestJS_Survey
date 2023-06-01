import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class AnswerResponseDto {
  @ApiProperty({
    type: String,
  })
  _id: Types.ObjectId;

  @ApiProperty({
    type: String,
  })
  survey: Types.ObjectId;

  @ApiProperty({
    type: String,
  })
  author: string;

  @ApiProperty({
    type: String,
  })
  createdAt: string;

  @ApiProperty({
    type: String,
  })
  updatedAt: string;

  @ApiProperty({
    type: 'array',
    description:
      'Normal Survey -> 2차원 배열(shortform일 경우 string, checkbox, radio일 경우 number), AB Survey -> string',
    items: {
      oneOf: [
        { type: 'array', items: { type: 'string' } },
        { type: 'array', items: { type: 'number' } },
        { type: 'string' },
      ],
    },
  })
  answers: [string | number][] | string;

  constructor(
    _id: Types.ObjectId,
    survey: Types.ObjectId,
    author: string,
    createdAt: string,
    updatedAt: string,
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
