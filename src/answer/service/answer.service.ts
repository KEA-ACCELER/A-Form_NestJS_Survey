import { CreateAnswerRequestDto } from '@/answer/dto/create-answer-request.dto';
import { Answer } from '@/schema/answer.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AnswerService {
  constructor(@InjectModel(Answer.name) private answerModel: Model<Answer>) {}

  async create(
    author: string,
    requestDto: CreateAnswerRequestDto,
  ): Promise<string> {
    return (
      await this.answerModel.create({
        author,
        ...requestDto,
      })
    )._id.toString();
  }
}
