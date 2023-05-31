import { Answer, AnswerSchema } from '@/schema/answer.schema';
import { PopularSurveyHelper } from './helper/popular-survey.helper';
import { AnswerModule } from '@/answer/answer.module';
import { HttpModule } from '@nestjs/axios';
import { QueryHelper } from '@/survey/helper/query.helper';
import { Survey, SurveySchema } from '@/schema/survey.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module, forwardRef } from '@nestjs/common';
import { SurveyService } from '@/survey/service/survey.service';
import { SurveyController } from '@/survey/controller/survey.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Survey.name, schema: SurveySchema },
      { name: Answer.name, schema: AnswerSchema },
    ]),
    HttpModule,
    forwardRef(() => AnswerModule),
  ],
  providers: [SurveyService, QueryHelper, PopularSurveyHelper],
  controllers: [SurveyController],
  exports: [SurveyService],
})
export class SurveyModule {}
