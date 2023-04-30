import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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
  questions: {
    title: string;
    type: string;
    selection: {
      type: number;
      content: string;
    }[];
  }[];

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
    questions: {
      title: string;
      type: string;
      selection: {
        type: number;
        content: string;
      }[];
    }[],
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
