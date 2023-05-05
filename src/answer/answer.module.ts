import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AnswerController } from '@/answer/controller/answer.controller';
import { AnswerService } from '@/answer/service/answer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Answer, AnswerSchema } from '@/schema/answer.schema';
import { SurveyModule } from '@/survey/survey.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Answer.name, schema: AnswerSchema }]),
    HttpModule,
    SurveyModule,
  ],
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class AnswerModule {}
