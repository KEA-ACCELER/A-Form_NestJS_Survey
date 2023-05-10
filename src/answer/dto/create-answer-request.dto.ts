import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export class CreateAnswerRequestDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @Transform(({ value }) => {
    try {
      return new Types.ObjectId(value);
    } catch (error) {
      throw new BadRequestException('Invalid ObjectId');
    }
  })
  survey: Types.ObjectId;

  @ApiProperty({
    isArray: true,
  })
  @IsNotEmpty()
  answers: [string | number][] | string;

  constructor(survey: Types.ObjectId, answer: [string | number][] | string) {
    this.survey = survey;
    this.answers = answer;
  }
}
