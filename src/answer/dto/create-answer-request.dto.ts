import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export class CreateAnswerRequestDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @Transform(({ value }) => {
    try {
      console.log('CreateAnswerRequestDto transform');
      return new Types.ObjectId(value);
    } catch (error) {
      throw new BadRequestException('Invalid ObjectId');
    }
  })
  survey: Types.ObjectId;

  @ApiProperty({
    isArray: true,
  })
  @IsArray()
  @IsNotEmpty()
  answers: [string | number][];

  constructor(survey: Types.ObjectId, answer: [string | number][]) {
    this.survey = survey;
    this.answers = answer;
  }
}
