import { RedisKey } from '@/common/enum';
import { RedisHelper } from '@/common/helper/redis.helper';
import { Answer } from '@/schema/answer.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CacheHelper {
  constructor(
    private readonly redisHelper: RedisHelper,
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
}
