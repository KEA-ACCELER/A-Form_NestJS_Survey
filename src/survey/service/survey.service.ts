import { Answer } from '@/schema/answer.schema';
import { PopularSurveyHelper } from '@/survey/helper/popular-survey.helper';
import { ErrorMessage } from '@/common/constant/error-message';
import { QueryHelper } from '@/survey/helper/query.helper';
import { PageDto } from '@/common/dto/page.dto';
import { UpdateSurveyRequestDto } from '@/survey/dto/update-survey-request.dto';
import { Status } from '@/common/constant/enum';
import { CreateSurveyRequestDto } from '@/survey/dto/create-survey-request.dto';
import { Survey } from '@/schema/survey.schema';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder, Types } from 'mongoose';
import { FindSurveyDto } from '@/survey/dto/find-survey.dto';
import { FindPopularSurveyDto } from '../dto/find-popular-survey.dto';

@Injectable()
export class SurveyService {
  constructor(
    @InjectModel(Survey.name) private surveyModel: Model<Survey>,
    @InjectModel(Answer.name) private answerModel: Model<Answer>,
    private queryHelper: QueryHelper,
    private popularSurveyHelper: PopularSurveyHelper,
  ) {}

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

  async findAll(query: FindSurveyDto): Promise<PageDto<Survey[]>> {
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

    return new PageDto(page, offset, total, data);
  }

  async findOne(_id: Types.ObjectId): Promise<Survey> {
    const survey = await this.surveyModel.findOne({
      _id,
      status: Status.NORMAL,
    });
    if (!survey) throw new NotFoundException(ErrorMessage.NOT_FOUND);

    return survey;
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

  async findMySurveys(author: string): Promise<Survey[]> {
    return await this.surveyModel.find({
      author,
      status: Status.NORMAL,
    });
  }

  // 인기글은 입력받은 시간의 한 시간 전 가장 응답이 많은 순 5개
  // 만일 응답이 많은 survey가 5개가 없다면 그 시간대의 글을 오래된 순으로
  async findPopular(query: FindPopularSurveyDto): Promise<Survey[]> {
    const [startTime, endTime] =
      this.popularSurveyHelper.getResponseTimeRange(query);

    const popularSurvey = await this.answerModel.aggregate([
      { $match: { createdAt: { $gte: startTime, $lt: endTime } } },
      { $group: { _id: '$survey' } },
      { $limit: 5 },
    ]);

    const popularSurveyIds = popularSurvey.map((item) => item._id);

    if (popularSurvey.length !== 5) {
      const surveyAtThatTime = await this.surveyModel
        .find({
          createdAt: {
            $gte: startTime,
            $lte: endTime,
          },
          _id: {
            $nin: popularSurveyIds,
          },
        })
        .sort({
          createdAt: 1,
        })
        .limit(5 - popularSurvey.length);

      popularSurvey.push(...surveyAtThatTime);
    }

    return popularSurvey;
  }
}
