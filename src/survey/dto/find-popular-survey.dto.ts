import { PopularSurveyResponseType } from '@/common/constant/enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';
import moment from 'moment-timezone';

export class FindPopularSurveyDto {
  @ApiProperty({
    type: Date,
    example: '2023-06-01T20:14:40+09:00',
  })
  @Transform(({ value }) => moment.tz(value, 'Asia/Seoul').utc().toDate())
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
