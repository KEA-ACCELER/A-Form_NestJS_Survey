import { QueryHelper } from '@/survey/helper/query.helper';
import { PageDto } from '@/common/dto/page.dto';
import { UpdateSurveyRequestDto } from '@/survey/dto/update-survey-request.dto';
import { Status, SuveyProgressStatus } from '@/common/enum';
import { CreateSurveyRequestDto } from '@/survey/dto/create-survey-request.dto';
import { Survey } from '@/schema/survey.schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder, Types } from 'mongoose';
import { FindSurveyDto } from '@/survey/dto/find-survey.dto';

@Injectable()
export class SurveyService {
  constructor(
    @InjectModel(Survey.name) private surveyModel: Model<Survey>,
    private queryHelper: QueryHelper,
  ) {}

  async create(createSurveyDto: CreateSurveyRequestDto): Promise<string> {
    const createdSurvey = new this.surveyModel(createSurveyDto);
    return (await createdSurvey.save())._id.toString();
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
    if (!survey) throw new NotFoundException('not found');

    return survey;
  }

  async update(
    _id: Types.ObjectId,
    updateSurveyDto: UpdateSurveyRequestDto,
  ): Promise<string> {
    await this.findOne(_id);
    await this.surveyModel.updateOne(
      {
        _id,
        status: Status.NORMAL,
      },
      { $set: updateSurveyDto },
    );

    return _id.toString();
  }

  async delete(_id: Types.ObjectId): Promise<void> {
    await this.findOne(_id);
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
}
