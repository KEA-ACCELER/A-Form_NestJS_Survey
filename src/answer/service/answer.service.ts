import { SurveyService } from '@/survey/service/survey.service';
import { CreateAnswerRequestDto } from '@/answer/dto/create-answer-request.dto';
import { Answer } from '@/schema/answer.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AnswerService {
  constructor(
    @InjectModel(Answer.name) private answerModel: Model<Answer>,
    private surveyService: SurveyService,
  ) {}

  async create(
    author: string,
    requestDto: CreateAnswerRequestDto,
  ): Promise<string> {
    await this.surveyService.findOne(requestDto.survey); // TODO: pipe 문제 해결 시 제외해도 됨
    return (
      await this.answerModel.create({
        author,
        ...requestDto,
      })
    )._id.toString();
  }
}
