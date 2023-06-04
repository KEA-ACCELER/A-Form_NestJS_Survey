import { KeyHelper } from '@/cache/helper/key.helper';
import { CacheService } from '@/cache/cache.service';
import { Answer } from '@/schema/answer.schema';
import { PopularSurveyHelper } from '@/survey/helper/popular-survey.helper';
import { ErrorMessage } from '@/common/constant/error-message';
import { QueryHelper } from '@/survey/helper/query.helper';
import { PageDto } from '@/common/dto/page.dto';
import { UpdateSurveyRequestDto } from '@/survey/dto/update-survey-request.dto';
import { PopularSurveyResponseType, Status } from '@/common/constant/enum';
import { CreateSurveyRequestDto } from '@/survey/dto/create-survey-request.dto';
import { Survey } from '@/schema/survey.schema';
import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder, Types } from 'mongoose';
import { FindSurveyDto } from '@/survey/dto/find-survey.dto';
import { FindPopularSurveyDto } from '../dto/find-popular-survey.dto';
import { SurveyResponseDto } from '@/survey/dto/survey-response.dto';
import { TransformHelper } from '@/survey/helper/transform.helper';

@Injectable()
export class SurveyService {
  constructor(
    @InjectModel(Survey.name) private surveyModel: Model<Survey>,
    @InjectModel(Answer.name) private answerModel: Model<Answer>,
    private queryHelper: QueryHelper,
    private popularSurveyHelper: PopularSurveyHelper,
    private transformHelper: TransformHelper,
    private cacheService: CacheService,
    private keyHelper: KeyHelper,
  ) {}

  private readonly logger = new Logger(SurveyService.name);

  async create(
    author: string,
    createSurveyDto: CreateSurveyRequestDto,
  ): Promise<string> {
    return (
      await this.surveyModel.create({
        author,
        ...createSurveyDto,
      })
    )._id.toString();
  }

  async findAll(query: FindSurveyDto): Promise<PageDto<SurveyResponseDto[]>> {
    const { page, offset } = query;

    const sortQuery: { [key: string]: SortOrder } = query?.sort
      ? this.queryHelper.getSortQuery(query.sort)
      : { createdAt: -1 };

    const keywordQuery = query?.content
      ? this.queryHelper.getKeywordQuery(query.content)
      : null;

    const findQuery: FilterQuery<Survey> = {
      status: Status.NORMAL,
    };

    if (keywordQuery) {
      findQuery.$or = [...(keywordQuery ? keywordQuery : [])];
    }

    const total = await this.surveyModel.find(findQuery).count();

    const data = await this.surveyModel
      .find(findQuery)
      .skip((page - 1) * offset)
      .limit(offset)
      .sort(sortQuery);

    return new PageDto(
      page,
      offset,
      total,
      this.transformHelper.toArrayResponseDto(data),
    );
  }

  async findOne(_id: Types.ObjectId): Promise<SurveyResponseDto> {
    const survey = await this.surveyModel.findOne({
      _id,
      status: Status.NORMAL,
    });
    if (!survey) throw new NotFoundException(ErrorMessage.NOT_FOUND);

    return this.transformHelper.toResponseDto(survey);
  }

  async update(
    _id: Types.ObjectId,
    author: string,
    updateSurveyDto: UpdateSurveyRequestDto,
  ): Promise<string> {
    await this.findOne(_id);
    await this.checkAuthority(_id, author);
    await this.surveyModel.updateOne(
      {
        _id,
        status: Status.NORMAL,
      },
      { $set: updateSurveyDto },
    );

    return _id.toString();
  }

  async delete(_id: Types.ObjectId, author: string): Promise<void> {
    await this.findOne(_id);
    await this.checkAuthority(_id, author);
    await this.surveyModel.updateOne(
      {
        _id,
      },
      {
        $set: {
          status: Status.DELETED,
        },
      },
    );
  }

  async checkAuthority(_id: Types.ObjectId, author: string): Promise<void> {
    if (
      !(await this.surveyModel.findOne({
        author,
        _id,
      }))
    ) {
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }
  }

  async findMySurveys(
    author: string,
    query: FindSurveyDto,
  ): Promise<PageDto<SurveyResponseDto[]>> {
    const { page, offset } = query;

    const sortQuery: { [key: string]: SortOrder } = query?.sort
      ? this.queryHelper.getSortQuery(query.sort)
      : { createdAt: -1 };

    const keywordQuery = query?.content
      ? this.queryHelper.getKeywordQuery(query.content)
      : null;

    const findQuery: FilterQuery<Survey> = {
      author,
      status: Status.NORMAL,
    };

    if (keywordQuery) {
      findQuery.$or = [...(keywordQuery ? keywordQuery : [])];
    }

    const total = await this.surveyModel.find(findQuery).count();

    const data = await this.surveyModel
      .find(findQuery)
      .skip((page - 1) * offset)
      .limit(offset)
      .sort(sortQuery);

    return new PageDto(
      page,
      offset,
      total,
      this.transformHelper.toArrayResponseDto(data),
    );
  }

  // 인기글은 입력받은 시간의 한 시간 전 가장 응답이 많은 순 5개
  // 만일 응답이 많은 survey가 5개가 없다면 그 시간대의 글을 오래된 순으로
  async findPopular(
    query: FindPopularSurveyDto,
  ): Promise<SurveyResponseDto[] | string[]> {
    const [startTime, endTime] =
      this.popularSurveyHelper.getResponseTimeRange(query);
    const cache = await this.cacheService.get(
      this.keyHelper.getPopularSurveyKey(endTime),
    );

    return cache
      ? await this.findPopularFromCache(query.type, cache)
      : await this.findPopularWithoutCache(query.type, startTime, endTime);
  }

  async findPopularFromCache(
    type: PopularSurveyResponseType,
    cache: string,
  ): Promise<string[] | SurveyResponseDto[]> {
    const popularSurveyIds = JSON.parse(cache);
    this.logger.debug('Using Cache');

    switch (type) {
      case PopularSurveyResponseType.ID:
        return popularSurveyIds;
      case PopularSurveyResponseType.OBJECT:
        return await Promise.all(
          popularSurveyIds.map(
            async (item: string) =>
              await this.findOne(new Types.ObjectId(item)),
          ),
        );
    }
  }

  async findPopularWithoutCache(
    type: PopularSurveyResponseType,
    startTime: Date,
    endTime: Date,
  ): Promise<string[] | SurveyResponseDto[]> {
    // 응답률 가장 많은 것 가져오기
    const popularSurvey: { _id: string; count: number }[] =
      await this.answerModel.aggregate([
        { $match: { createdAt: { $gte: startTime, $lt: endTime } } },
        { $group: { _id: '$survey', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]);
    const popularSurveyIds = popularSurvey.map((item) => item._id);

    // id로 객체 가져오기
    const result = (await Promise.all(
      popularSurveyIds.map(
        async (item) => await this.surveyModel.findOne({ _id: item }),
      ),
    )) as Survey[];

    // 응답률로 가져온게 5개 미만일 경우에 날짜로 가져오기
    if (result.length !== 5) {
      const surveyAtThatTime = await this.surveyModel
        .find({
          createdAt: {
            $gte: startTime,
            $lt: endTime,
          },
          _id: {
            $nin: popularSurveyIds,
          },
        })
        .sort({
          createdAt: 1,
        })
        .limit(5 - popularSurvey.length);
      result.push(...surveyAtThatTime);
    }

    await this.cacheService.set(
      this.keyHelper.getPopularSurveyKey(endTime),
      JSON.stringify(result.map((item) => item._id)),
    );

    switch (type) {
      case PopularSurveyResponseType.ID:
        return result.map((item) => item._id);
      case PopularSurveyResponseType.OBJECT:
        return this.transformHelper.toArrayResponseDto(result);
    }
  }
}
