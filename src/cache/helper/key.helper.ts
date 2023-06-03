import moment from 'moment-timezone';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KeyHelper {
  getPopularSurveyKey(date: Date): string {
    // TODO: UTC or Asia/Seoul로 사용할건지
    return `popular_survey:${moment(date)
      .tz('Asia/Seoul')
      .format('YYYYMMDDHH')}`;
  }
}
