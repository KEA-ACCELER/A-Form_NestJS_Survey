import { ABQuestionResponseDto } from '@/survey/dto/ab-question-response.dto';
import { QuestionResponseDto } from '@/survey/dto/question-response.dto';
import { Status, SurveyType } from '@/common/constant/enum';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class SurveyResponseDto {
  @ApiProperty({
    type: String,
  })
  _id: Types.ObjectId;

  @ApiProperty({
    enum: SurveyType,
  })
  type: SurveyType;

  @ApiProperty({
    type: String,
  })
  title: string;

  // User API에서 받은 userId
  @ApiProperty({
    type: String,
  })
  author: string;

  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [
        {
          $ref: getSchemaPath(QuestionResponseDto),
        },
        {
          $ref: getSchemaPath(ABQuestionResponseDto),
        },
      ],
    },
  })
  questions: QuestionResponseDto[] | ABQuestionResponseDto[];

  @ApiProperty({
    type: String,
  })
  createdAt: string;

  @ApiProperty({
    type: String,
  })
  updatedAt: string;

  @ApiProperty({
    enum: Status,
  })
  status: Status;

  @ApiProperty({
    type: String,
  })
  description?: string;

  constructor(
    _id: Types.ObjectId,
    type: SurveyType,
    title: string,
    author: string,
    questions: QuestionResponseDto[] | ABQuestionResponseDto[],
    createdAt: string,
    updatedAt: string,
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
