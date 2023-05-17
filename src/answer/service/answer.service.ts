import { Question } from '@/schema/question.schema';
import {
  SurveyStatistics,
  NormalStatistics,
  ABStatistics,
  NormalStatisticsValue,
} from '@/survey/dto/survey-statistics.dto';
import { ErrorMessage } from '@/common/constant/error-message';
// import { CacheHelper } from '@/answer/helper/cache.helper';
import { CreateAnswerRequestDto } from '@/answer/dto/create-answer-request.dto';
import { Answer } from '@/schema/answer.schema';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SurveyService } from '@/survey/service/survey.service';
import { SurveyType, ABSurvey } from '@/common/constant/enum';

@Injectable()
export class AnswerService {
  constructor(
    @InjectModel(Answer.name) private answerModel: Model<Answer>,
    private surveyService: SurveyService,
  ) {}

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
        survey,
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

  // TODO: percent 추가 필요
  async findOneStatistics(survey: Types.ObjectId): Promise<SurveyStatistics> {
    const totalCnt = await this.answerModel.countDocuments({
      survey,
    });

    // TODO: helper로 변경?
    const { type: surveyType } = await this.surveyService.findOne(survey);

    let statistics = [];

    switch ((await this.surveyService.findOne(survey)).type) {
      case SurveyType.NORMAL: {
        statistics = await this.findNormalSurveyStatistics(survey, totalCnt);
        break;
      }
      case SurveyType.AB: {
        statistics = await this.findABSurveyStatistics(survey, totalCnt);
        break;
      }
    }

    return new SurveyStatistics(totalCnt, surveyType, statistics);
  }

  // TODO: 현재는 shortform도 요약해버리기 때문에 refactoring 필요
  // unwind: answers 배열을 풀어서 각각의 요소가 하나의 문서가 되도록. includeArrayIndex를 사용해 index 필드에 저장
  // index와 answers 기준으로 그룹화 후 계산
  // index 기준으로 그룹화하고, 각 그룹의 수 계산
  async findNormalSurveyStatistics(
    survey: Types.ObjectId,
    totalCnt: number,
  ): Promise<NormalStatistics[]> {
    const statistics = await this.answerModel.aggregate([
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
    ]);

    const { questions } = (await this.surveyService.findOne(survey)) as {
      questions: Question[];
    };

    statistics.map((item, idx) => {
      item.type = questions[idx].type;
      item.values.map((value: NormalStatisticsValue) => {
        value.percent = Math.round((value.count / totalCnt) * 100);
      });
    });

    return statistics.map(
      (item) => new NormalStatistics(item.index, item.type, item.values),
    );
  }

  async findABSurveyStatistics(
    survey: Types.ObjectId,
    totalCnt: number,
  ): Promise<ABStatistics[]> {
    let statistics = await this.answerModel.aggregate([
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
    ]);

    statistics.map((item) => {
      item.percent = Math.round((item.count / totalCnt) * 100);
    });

    if (statistics.length === 0) {
      statistics = [
        new ABStatistics(ABSurvey.A, 0, 0),
        new ABStatistics(ABSurvey.B, 0, 0),
      ];
    } else if (statistics.length === 1) {
      switch (statistics[0].type) {
        case ABSurvey.A:
          statistics.push(new ABStatistics(ABSurvey.B, 0, 0));
          break;
        case ABSurvey.B:
          statistics.push(new ABStatistics(ABSurvey.A, 0, 0));
          break;
      }
    }

    return statistics.map(
      (item) => new ABStatistics(item.type, item.count, item.percent),
    );
  }
}
