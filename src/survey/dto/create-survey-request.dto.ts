import { Question } from '@/schema/question.schema';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateQuestionRequestDto } from '@/survey/dto/create-question-request.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSurveyRequestDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  author: number;

  @ApiProperty({
    type: Date,
  })
  @IsDate()
  @IsNotEmpty()
  deadline: Date;

  @ApiProperty({
    isArray: true,
    type: CreateQuestionRequestDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionRequestDto)
  questions: Question[];

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  description?: string;

  constructor(
    title: string,
    author: number,
    deadline: Date,
    questions: Question[],
    description?: string,
  ) {
    this.title = title;
    this.author = author;
    this.deadline = deadline;
    this.questions = questions;
    this.description = description;
  }
}
