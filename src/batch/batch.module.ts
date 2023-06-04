import { SurveyRepository } from '@/survey/repository/survey.repository';
import { KeyHelper } from '@/cache/helper/key.helper';
import { SurveyService } from '@/survey/service/survey.service';
import { Module } from '@nestjs/common';
import { BatchService } from '@/batch/batch.service';
import { Survey, SurveySchema } from '@/schema/survey.schema';
import { Answer, AnswerSchema } from '@/schema/answer.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { QueryHelper } from '@/survey/helper/query.helper';
import { PopularSurveyHelper } from '@/survey/helper/popular-survey.helper';
import { TransformHelper } from '@/survey/helper/transform.helper';
import { CacheModule } from '@/cache/cache.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Survey.name, schema: SurveySchema },
      { name: Answer.name, schema: AnswerSchema },
    ]),
    CacheModule,
  ],
  providers: [
    BatchService,
    SurveyService,
    SurveyRepository,
    QueryHelper,
    PopularSurveyHelper,
    TransformHelper,
    KeyHelper,
  ],
})
export class BatchModule {}
