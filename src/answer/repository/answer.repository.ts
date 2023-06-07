import { CreateAnswerRequestDto } from '@/answer/dto/create-answer-request.dto';
import { Answer } from '@/schema/answer.schema';
import { Survey } from '@/schema/survey.schema';
import {
  ABStatisticsResponseDto,
  NormalStatisticsResponseDto,
} from '@/survey/dto/survey-statistics-response.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class AnswerRepository {
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
  ): Promise<Types.ObjectId> {
    return (
      await this.answerModel.create({
        author,
        survey,
        ...requestDto,
      })
    )._id;
  }

  async findNormalSurveyStatistics(
    survey: Types.ObjectId,
  ): Promise<NormalStatisticsResponseDto[]> {
    return await this.answerModel
      .aggregate([
        { $match: { survey } },
        { $unwind: { path: '$answers', includeArrayIndex: 'index' } },
        { $unwind: '$answers' },
        {
          $group: {
            _id: { index: '$index', value: '$answers' },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: '$_id.index',
            values: {
              $push: { answer: { $toString: '$_id.value' }, count: '$count' },
            },
          },
        },
        {
          $project: {
            _id: 0,
            index: '$_id',
            values: '$values',
          },
        },
      ])
      .sort({
        index: 1,
      });
  }

  async findABSurveyStatistics(
    survey: Types.ObjectId,
  ): Promise<ABStatisticsResponseDto[]> {
    return await this.answerModel
      .aggregate([
        { $match: { survey } },
        {
          $group: {
            _id: '$answers',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            type: '$_id',
            count: 1,
          },
        },
      ])
      .sort({
        type: 1,
      });
  }

  async findMyAnsweredSurveyCnt(author: string): Promise<number> {
    return await this.answerModel.countDocuments({
      author,
    });
  }

  async findMyAnsweredSurvey(
    author: string,
    page: number,
    offset: number,
  ): Promise<{ _id: Types.ObjectId; survey: Survey }[]> {
    return await this.answerModel
      .find({
        author,
      })
      .skip((page - 1) * offset)
      .limit(offset)
      .sort('-createdAt')
      .populate<{ survey: Survey }>('survey');
  }

  async findAnswerCnt(survey: Types.ObjectId): Promise<number> {
    return await this.answerModel.countDocuments({
      survey,
    });
  }
}
