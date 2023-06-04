import { FindPopularSurveyDto } from '@/survey/dto/find-popular-survey.dto';

export class PopularSurveyHelper {
  getResponseTimeRange(query: FindPopularSurveyDto): [Date, Date] {
    const { date: endTime } = query;
    const startTime = this.getStartTime(endTime);

    return [startTime, endTime];
  }

  private getStartTime(endTime: Date): Date {
    const startTime = new Date(endTime);
    startTime.setHours(startTime.getHours() - 1);
    return startTime;
  }
}
