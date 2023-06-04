import { AnswerRepository } from './repository/answer.repository';
import { ValidateAnswerPipe } from '@/answer/pipe/validate-answer.pipe';
import { SurveyCheckHelper } from './helper/survey-check.helper';
import { HttpModule } from '@nestjs/axios';
import { Module, forwardRef } from '@nestjs/common';
import { AnswerController } from '@/answer/controller/answer.controller';
import { AnswerService } from '@/answer/service/answer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Answer, AnswerSchema } from '@/schema/answer.schema';
import { SurveyModule } from '@/survey/survey.module';
import { TransformHelper as SurveyTransformHelper } from '@/survey/helper/transform.helper';
import { TransformHelper as AnswerTransformHelper } from '@/answer/helper/transform.helper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Answer.name, schema: AnswerSchema }]),
    HttpModule,
    forwardRef(() => SurveyModule),
  ],
  controllers: [AnswerController],
  providers: [
    AnswerService,
    SurveyCheckHelper,
    ValidateAnswerPipe,
    SurveyTransformHelper,
    AnswerTransformHelper,
    AnswerRepository,
  ],
  exports: [AnswerService],
})
export class AnswerModule {}
