import { ErrorMessage } from '@/common/constant/error-message';
// import { CacheHelper } from '@/answer/helper/cache.helper';
import { CreateAnswerRequestDto } from '@/answer/dto/create-answer-request.dto';
import { Answer } from '@/schema/answer.schema';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class AnswerService {
  constructor(@InjectModel(Answer.name) private answerModel: Model<Answer>) {}

  async checkUserAnswer(
    author: string,
    survey: Types.ObjectId,
  ): Promise<Answer | null> {
    return await this.answerModel.findOne({
      survey,
      author,
    });
  }

  async create(
    author: string,
    survey: Types.ObjectId,
    requestDto: CreateAnswerRequestDto,
  ): Promise<string> {
    if (await this.checkUserAnswer(author, survey)) {
      throw new BadRequestException(ErrorMessage.ALREADY_ANSWERED);
    }

    // TODO: redis 로직 확인
    // await this.cacheHelper.incrementTotalCount(survey.toString());
    // await this.cacheHelper.updateAnswer(survey, requestDto.answers);

    return (
      await this.answerModel.create({
        author,
        ...requestDto,
      })
    )._id.toString();
  }

  async findMyAnswerBySurvey(
    author: string,
    survey: Types.ObjectId,
  ): Promise<Answer> {
    const result = await this.checkUserAnswer(author, survey);
    if (!result) throw new BadRequestException(ErrorMessage.NOT_FOUND);

    return result;
  }
}
