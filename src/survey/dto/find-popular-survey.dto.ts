import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate } from 'class-validator';
import moment from 'moment-timezone';

export class FindPopularSurveyDto {
  @ApiProperty({
    type: Date,
  })
  @Transform(({ value }) => moment.tz(value, 'Asia/Seoul').utc().toDate())
  @IsDate()
  date: Date;

  constructor(date: Date) {
    this.date = date;
  }
}
