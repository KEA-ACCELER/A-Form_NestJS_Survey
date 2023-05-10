import { SurveyCheckHelper } from '@/answer/helper/survey-check.helper';
import { RedisKey, SurveyType } from '@/common/enum';
import { RedisHelper } from '@/common/helper/redis.helper';
import { Answer } from '@/schema/answer.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class CacheHelper {
  constructor(
    private readonly redisHelper: RedisHelper,
    private readonly surveyCheckHelper: SurveyCheckHelper,
    @InjectModel(Answer.name) private answerModel: Model<Answer>,
  ) {}

  async incrementTotalCount(survey: string): Promise<void> {
    const key = `${RedisKey.ANSWER}:${survey}`;
    let totalCnt = await this.redisHelper.get(key);

    // 만일 카운트가 없다면 설정
    if (!totalCnt) {
      totalCnt = await this.redisHelper.set(
        key,
        (
          await this.answerModel.count({
            survey,
          })
        ).toString(),
      );
    }

    await this.redisHelper.increment(key, totalCnt);
  }

  async updateAnswer(
    _id: Types.ObjectId,
    answers: (number | string)[][] | string,
  ): Promise<void> {
    const prevKey = `${RedisKey.ANSWER}:${_id}`;

    const surveyType = await this.surveyCheckHelper.getSurveyType(_id);
    if (surveyType === SurveyType.AB) {
      await this.updateABAnswer(_id, prevKey, answers as string);
    } else if (surveyType === SurveyType.NORMAL) {
      if (Array.isArray(answers)) {
        for (const [idx, answer] of answers.entries()) {
          // checkbox나 radio일 경우에만 통계 저장
          if (answer.every((item: any) => typeof item === 'number')) {
            for (const checked of answer as number[]) {
              await this.updateNormalSurveyAnswer(_id, prevKey, checked, idx);
            }
          }
        }
      }
    }
  }

  async updateABAnswer(_id: Types.ObjectId, prevKey: string, type: string) {
    const key = `${prevKey}:${type}`;

    let total = await this.redisHelper.get(key);
    if (!total)
      total = await this.redisHelper.set(
        key,
        (
          await this.answerModel.countDocuments({
            _id,
            'answers.0': [type],
          })
        ).toString(),
      );
    await this.redisHelper.increment(key, total);
  }

  async updateNormalSurveyAnswer(
    _id: Types.ObjectId,
    prevKey: string,
    checked: number,
    idx: number,
  ) {
    const key = `${prevKey}:${idx}:${checked}`;

    let total = await this.redisHelper.get(key);
    if (!total)
      total = await this.redisHelper.set(
        key,
        (
          await this.answerModel.countDocuments({
            _id,
            [`answers.${idx}`]: checked, //리터럴 속성 동적 지정 위해 대괄호 필요
          })
        ).toString(),
      );
    await this.redisHelper.increment(key, total);
  }
}
