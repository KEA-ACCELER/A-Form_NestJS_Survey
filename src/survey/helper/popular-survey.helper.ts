import { FindPopularSurveyDto } from './../dto/find-popular-survey.dto';

export class PopularSurveyHelper {
  getResponseTimeRange(query: FindPopularSurveyDto): [Date, Date] {
    const { date: endTime } = query;

    endTime.setMinutes(0);
    endTime.setSeconds(0);

    const startTime = this.getStartTime(endTime);

    return [startTime, endTime];
  }

  private getStartTime(endTime: Date): Date {
    const startTime = new Date(endTime);
    startTime.setHours(startTime.getHours() - 1);
    return startTime;
  }
}
