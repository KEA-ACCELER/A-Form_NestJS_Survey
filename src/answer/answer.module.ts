import { SurveyCheckHelper } from './helper/survey-check.helper';
import { CacheHelper } from '@/answer/helper/cache.helper';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AnswerController } from '@/answer/controller/answer.controller';
import { AnswerService } from '@/answer/service/answer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Answer, AnswerSchema } from '@/schema/answer.schema';
import { SurveyModule } from '@/survey/survey.module';
import { RedisHelper } from '@/common/helper/redis.helper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Answer.name, schema: AnswerSchema }]),
    HttpModule,
    SurveyModule,
  ],
  controllers: [AnswerController],
  providers: [AnswerService, RedisHelper, CacheHelper, SurveyCheckHelper],
})
export class AnswerModule {}
