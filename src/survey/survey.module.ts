import { HttpModule } from '@nestjs/axios';
import { QueryHelper } from '@/survey/helper/query.helper';
import { Survey, SurveySchema } from '@/schema/survey.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { SurveyService } from '@/survey/service/survey.service';
import { SurveyController } from '@/survey/controller/survey.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Survey.name, schema: SurveySchema }]),
    HttpModule,
  ],
  providers: [SurveyService, QueryHelper],
  controllers: [SurveyController],
})
export class SurveyModule {}
