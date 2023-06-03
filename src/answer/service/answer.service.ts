import { TransformHelper as SurveyTransformHelper } from '@/survey/helper/transform.helper';
import { TransformHelper as AnswerTransformHelper } from '@/answer/helper/transform.helper';
import { PageDto } from '@/common/dto/page.dto';
import { Question } from '@/schema/question.schema';
import {
  SurveyStatisticsResponseDto,
  NormalStatisticsResponseDto,
  ABStatisticsResponseDto,
  NormalStatisticsValue,
} from '@/survey/dto/survey-statistics-response.dto';
import { ErrorMessage } from '@/common/constant/error-message';
import { CreateAnswerRequestDto } from '@/answer/dto/create-answer-request.dto';
import { Answer } from '@/schema/answer.schema';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SurveyService } from '@/survey/service/survey.service';
import { SurveyType, ABSurvey } from '@/common/constant/enum';
import { BaseQueryDto } from '@/common/dto/base-query.dto';
import { AnswerResponseDto } from '@/survey/dto/answer-response.dto';
import { SurveyResponseDto } from '@/survey/dto/survey-response.dto';
import { Survey } from '@/schema/survey.schema';

@Injectable()
export class AnswerService {
  constructor(
    @InjectModel(Answer.name) private answerModel: Model<Answer>,
    private surveyService: SurveyService,
    private surveyTransformHelper: SurveyTransformHelper,
    private answerTransformHelper: AnswerTransformHelper,
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
  ): Promise<AnswerResponseDto> {
    const result = await this.checkUserAnswer(author, survey);
    if (!result) throw new BadRequestException(ErrorMessage.NOT_FOUND);

    return this.answerTransformHelper.toResponseDto(result);
  }

  async findOneStatistics(
    survey: Types.ObjectId,
  ): Promise<SurveyStatisticsResponseDto> {
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

    return new SurveyStatisticsResponseDto(totalCnt, surveyType, statistics);
  }

  // TODO: 현재는 shortform도 요약해버리기 때문에 refactoring 필요
  // unwind: answers 배열을 풀어서 각각의 요소가 하나의 문서가 되도록. includeArrayIndex를 사용해 index 필드에 저장
  // index와 answers 기준으로 그룹화 후 계산
  // index 기준으로 그룹화하고, 각 그룹의 수 계산
  async findNormalSurveyStatistics(
    survey: Types.ObjectId,
    totalCnt: number,
  ): Promise<NormalStatisticsResponseDto[]> {
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
      (item) =>
        new NormalStatisticsResponseDto(item.index, item.type, item.values),
    );
  }

  async findABSurveyStatistics(
    survey: Types.ObjectId,
    totalCnt: number,
  ): Promise<ABStatisticsResponseDto[]> {
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
        new ABStatisticsResponseDto(ABSurvey.A, 0, 0),
        new ABStatisticsResponseDto(ABSurvey.B, 0, 0),
      ];
    } else if (statistics.length === 1) {
      switch (statistics[0].type) {
        case ABSurvey.A:
          statistics.push(new ABStatisticsResponseDto(ABSurvey.B, 0, 0));
          break;
        case ABSurvey.B:
          statistics.push(new ABStatisticsResponseDto(ABSurvey.A, 0, 0));
          break;
      }
    }

    return statistics.map(
      (item) =>
        new ABStatisticsResponseDto(item.type, item.count, item.percent),
    );
  }

  async finyMyAnsweredSurvey(
    userId: string,
    query: BaseQueryDto,
  ): Promise<PageDto<SurveyResponseDto[]>> {
    const { page, offset } = query;

    const total = await this.answerModel.find({ author: userId }).count();

    const data = await this.answerModel
      .find({
        author: userId,
      })
      .skip((page - 1) * offset)
      .limit(offset)
      .sort('-createdAt')
      .populate<{ survey: Survey }>('survey');

    return new PageDto(
      page,
      offset,
      total,
      this.surveyTransformHelper.toArrayResponseDto(
        data.map((item) => item.survey),
      ),
    );
  }
}
