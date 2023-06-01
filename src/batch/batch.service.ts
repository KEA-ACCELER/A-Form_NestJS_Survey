import { SurveyService } from '@/survey/service/survey.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import moment from 'moment-timezone';

@Injectable()
export class BatchService {
  constructor(private surveyService: SurveyService) {}

  private readonly logger = new Logger(BatchService.name);

  @Cron(CronExpression.EVERY_MINUTE, {
    name: 'popular-survey',
    timeZone: 'Asia/Seoul',
  })
  async cachingPopularSurvey() {
    const currentTime = moment().tz('Asia/Seoul').toDate();
    this.logger.debug(`현재 시간 (Asia/Seoul): ${currentTime}`);

    const popularSurvey = await this.surveyService.findPopular({
      date: currentTime,
    });

    const popularSurveyIds = popularSurvey.map((item) => item._id);

    //TODO: redis에 적재
  }
}
