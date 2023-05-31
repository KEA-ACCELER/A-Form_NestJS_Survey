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
import { SurveyResponseDto } from '@/survey/dto/survey-response.dto';
import { TransformHelper } from '@/survey/helper/transform.helper';

@Injectable()
export class SurveyService {
  constructor(
    @InjectModel(Survey.name) private surveyModel: Model<Survey>,
    private queryHelper: QueryHelper,
    private transformHelper: TransformHelper,
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
}
