import { CacheHelper } from './../helper/cache.helper';
import { CreateAnswerRequestDto } from '@/answer/dto/create-answer-request.dto';
import { Answer } from '@/schema/answer.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AnswerService {
  constructor(
    @InjectModel(Answer.name) private answerModel: Model<Answer>,
    private cacheHelper: CacheHelper,
  ) {}

  async create(
    author: string,
    requestDto: CreateAnswerRequestDto,
  ): Promise<string> {
    await this.cacheHelper.incrementTotalCount(requestDto.survey.toString());
    await this.cacheHelper.updateAnswer(requestDto.survey, requestDto.answers);

    return (
      await this.answerModel.create({
        author,
        ...requestDto,
      })
    )._id.toString();
  }
}
