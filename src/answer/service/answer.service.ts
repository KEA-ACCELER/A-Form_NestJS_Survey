import { AnswerRepository } from '@/answer/repository/answer.repository';
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
import { Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { SurveyService } from '@/survey/service/survey.service';
import { SurveyType, ABSurvey } from '@/common/constant/enum';
import { BaseQueryDto } from '@/common/dto/base-query.dto';
import { AnswerResponseDto } from '@/survey/dto/answer-response.dto';
import { SurveyResponseDto } from '@/survey/dto/survey-response.dto';

@Injectable()
export class AnswerService {
  constructor(
    private answerRepository: AnswerRepository,
    private surveyService: SurveyService,
    private surveyTransformHelper: SurveyTransformHelper,
    private answerTransformHelper: AnswerTransformHelper,
  ) {}

  async create(
    author: string,
    survey: Types.ObjectId,
    requestDto: CreateAnswerRequestDto,
  ): Promise<string> {
    if (await this.answerRepository.checkUserAnswer(author, survey)) {
      throw new BadRequestException(ErrorMessage.ALREADY_ANSWERED);
    }

    return (
      await this.answerRepository.create(author, survey, requestDto)
    ).toString();
  }

  async findMyAnswerBySurvey(
    author: string,
    survey: Types.ObjectId,
  ): Promise<AnswerResponseDto> {
    const result = await this.answerRepository.checkUserAnswer(author, survey);
    if (!result) throw new BadRequestException(ErrorMessage.NOT_FOUND);

    return this.answerTransformHelper.toResponseDto(result);
  }

  async findOneStatistics(
    survey: Types.ObjectId,
  ): Promise<SurveyStatisticsResponseDto> {
    const totalCnt = await this.answerRepository.findAnswerCnt(survey);

    const { type: surveyType } = await this.surveyService.findOne(survey);

    let statistics = [];

    switch ((await this.surveyService.findOne(survey)).type) {
      case SurveyType.NORMAL: {
        statistics = await this.findNormalSurveyStatistics(survey);
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
  ): Promise<NormalStatisticsResponseDto[]> {
    const statistics = await this.answerRepository.findNormalSurveyStatistics(
      survey,
    );

    const { questions } = (await this.surveyService.findOne(survey)) as {
      questions: Question[];
    };

    statistics.map((item: NormalStatisticsResponseDto) => {
      item.type = questions[item.index].type;
      item.values.sort((a, b) => a.answer - b.answer);

      // totalCnt는 해당 question의 selection에 대한 응답 개수
      const totalCnt = item.values.reduce((acc, value) => acc + value.count, 0);
      item.values.map((value: NormalStatisticsValue) => {
        value.percent = Math.round((value.count / totalCnt) * 100);
      });
    });

    return statistics.map(
      (item) =>
        new NormalStatisticsResponseDto(item.index, item.values, item.type),
    );
  }

  async findABSurveyStatistics(
    survey: Types.ObjectId,
    totalCnt: number,
  ): Promise<ABStatisticsResponseDto[]> {
    let statistics = await this.answerRepository.findABSurveyStatistics(survey);

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
          statistics.unshift(new ABStatisticsResponseDto(ABSurvey.A, 0, 0));
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

    const total = await this.answerRepository.findMyAnsweredSurveyCnt(userId);

    const data = await this.answerRepository.findMyAnsweredSurvey(
      userId,
      page,
      offset,
    );

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
