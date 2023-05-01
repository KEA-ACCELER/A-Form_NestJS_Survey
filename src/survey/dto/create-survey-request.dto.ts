import { Question } from '@/schema/question.schema';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateQuestionRequestDto } from '@/survey/dto/create-question-request.dto';

export class CreateSurveyRequestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  author: number;

  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionRequestDto)
  questions: Question[];

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  statistics?: (number | string)[][];

  constructor(
    title: string,
    author: number,
    date: Date,
    questions: Question[],
    description?: string,
    statistics?: (number | string)[][],
  ) {
    this.title = title;
    this.author = author;
    this.date = date;
    this.questions = questions;
    this.description = description;
    this.statistics = statistics;
  }
}
