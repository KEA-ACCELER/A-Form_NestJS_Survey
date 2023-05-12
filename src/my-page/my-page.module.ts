import { Module } from '@nestjs/common';
import { MyPageService } from '@/my-page/service/my-page.service';
import { MyPageController } from '@/my-page/controller/my-page.controller';
import { AnswerModule } from '@/answer/answer.module';
import { SurveyModule } from '@/survey/survey.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [AnswerModule, SurveyModule, HttpModule],
  providers: [MyPageService],
  controllers: [MyPageController],
})
export class MyPageModule {}
