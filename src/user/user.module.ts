import { AnswerModule } from '@/answer/answer.module';
import { Module } from '@nestjs/common';
import { UserService } from '@/user/service/user.service';
import { UserController } from '@/user/controller/user.controller';
import { HttpModule } from '@nestjs/axios';
import { SurveyModule } from '@/survey/survey.module';

@Module({
  imports: [AnswerModule, SurveyModule, HttpModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
