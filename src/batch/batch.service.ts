import { CacheService } from '@/cache/cache.service';
import { PopularSurveyResponseType } from '@/common/constant/enum';
import { SurveyService } from '@/survey/service/survey.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import moment from 'moment-timezone';

@Injectable()
export class BatchService {
  constructor(
    private surveyService: SurveyService,
    private cacheService: CacheService,
  ) {}

  private readonly logger = new Logger(BatchService.name);

  @Cron(CronExpression.EVERY_HOUR, {
    name: 'popular-survey',
    timeZone: 'Asia/Seoul',
  })
  async cachingPopularSurvey() {
    const currentTime = moment().tz('Asia/Seoul');
    this.logger.debug(
      `현재 시간 (Asia/Seoul): ${currentTime.format('YYYY-MM-DD HH:MM:SS')}`,
    );
    const popularSurvey = await this.surveyService.findPopular({
      date: currentTime.toDate(),
      type: PopularSurveyResponseType.ID,
    });

    await this.cacheService.set(
      `popular_survey:${currentTime.format('YYYYMMDDHH')}`,
      JSON.stringify(popularSurvey),
    );
  }
}
