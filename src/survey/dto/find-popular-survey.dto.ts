import { PopularSurveyResponseType } from '@/common/constant/enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';

export class FindPopularSurveyDto {
  @ApiProperty({
    type: Date,
    example: '2023-06-01T20:00:00+09:00',
  })
  @IsDate()
  date: Date;

  @ApiProperty({
    enum: PopularSurveyResponseType,
  })
  @IsString()
  type: PopularSurveyResponseType;

  constructor(date: Date, type: PopularSurveyResponseType) {
    this.date = date;
    this.type = type;
  }
}
