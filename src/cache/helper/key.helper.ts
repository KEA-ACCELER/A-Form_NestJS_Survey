import { Injectable } from '@nestjs/common';

@Injectable()
export class KeyHelper {
  getPopularSurveyKey(date: Date): string {
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');

    return `popular_survey:${year}${month}${day}${hours}`;
  }
}
