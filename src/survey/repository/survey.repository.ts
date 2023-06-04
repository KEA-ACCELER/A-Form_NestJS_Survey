import { Answer } from '@/schema/answer.schema';
import { Status } from '@/common/constant/enum';
import { Survey } from '@/schema/survey.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder, Types } from 'mongoose';
import { CreateSurveyRequestDto } from '@/survey/dto/create-survey-request.dto';
import { UpdateSurveyRequestDto } from '@/survey/dto/update-survey-request.dto';

@Injectable()
export class SurveyRepository {
  constructor(
    @InjectModel(Survey.name) private surveyModel: Model<Survey>,
    @InjectModel(Answer.name) private answerModel: Model<Answer>,
  ) {}

  async create(
    author: string,
    createSurveyDto: CreateSurveyRequestDto,
  ): Promise<Types.ObjectId> {
    return (
      await this.surveyModel.create({
        author,
        ...createSurveyDto,
      })
    )._id;
  }

  async findOne(_id: Types.ObjectId): Promise<Survey | null> {
    return await this.surveyModel.findOne({
      _id,
      status: Status.NORMAL,
    });
  }

  async checkAuthority(
    _id: Types.ObjectId,
    author: string,
  ): Promise<Survey | null> {
    return await this.surveyModel.findOne({
      _id,
      author,
    });
  }

  async update(
    _id: Types.ObjectId,
    updateSurveyDto: UpdateSurveyRequestDto,
  ): Promise<void> {
    await this.surveyModel.updateOne(
      {
        _id,
        status: Status.NORMAL,
      },
      { $set: updateSurveyDto },
    );
  }

  async delete(_id: Types.ObjectId): Promise<void> {
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

  async findPopularSurvey(startTime: Date, endTime: Date): Promise<Survey[]> {
    const popularSurveys: { _id: string; count: number }[] =
      await this.answerModel.aggregate([
        { $match: { createdAt: { $gte: startTime, $lt: endTime } } },
        { $group: { _id: '$survey', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]);
    const popularSurveyIds = popularSurveys.map((item) => item._id);

    const surveys: Survey[] = [];

    for (const _id of popularSurveyIds) {
      const survey = await this.surveyModel.findOne({ _id });
      if (survey) {
        surveys.push(survey);
      }
    }

    return surveys;
  }

  async findSurveysWithQueryCnt(
    findQuery: FilterQuery<Survey>,
  ): Promise<number> {
    return await this.surveyModel.countDocuments(findQuery);
  }

  async findSurveysWithQuery(
    page: number,
    offset: number,
    findQuery: FilterQuery<Survey>,
    sortQuery?: { [key: string]: SortOrder },
  ): Promise<Survey[]> {
    return await this.surveyModel
      .find(findQuery)
      .skip((page - 1) * offset)
      .limit(offset)
      .sort(sortQuery);
  }
}
