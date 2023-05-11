import { QueryHelper } from '@/survey/helper/query.helper';
import { PageDto } from '@/common/dto/page.dto';
import { UpdateSurveyRequestDto } from '@/survey/dto/update-survey-request.dto';
import { Status, SuveyProgressStatus } from '@/common/enum';
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

@Injectable()
export class SurveyService {
  constructor(
    @InjectModel(Survey.name) private surveyModel: Model<Survey>,
    private queryHelper: QueryHelper,
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

    // TODO: add view
    const sortQuery: { [key: string]: SortOrder } = query?.sort
      ? this.queryHelper.getSortQuery(query.sort)
      : { createdAt: -1 };

    const keywordQuery = query?.content
      ? this.queryHelper.getKeywordQuery(query.content)
      : null;

    const progressQuery =
      query.progressStatus !== SuveyProgressStatus.ALL
        ? this.queryHelper.getProgressQuery(query.progressStatus)
        : null;

    const findQuery: FilterQuery<Survey> = {
      status: Status.NORMAL,
    };

    if (keywordQuery || progressQuery) {
      findQuery.$or = [
        ...(keywordQuery ? keywordQuery : []),
        ...(progressQuery ? progressQuery : []),
      ];
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
    if (!survey) throw new NotFoundException('survey not found');

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
      throw new UnauthorizedException();
    }
  }

  async findMySurveys(author: string): Promise<Survey[]> {
    return await this.surveyModel.find({
      author,
      status: Status.NORMAL,
    });
  }
}
