import { PageDto } from '@/common/dto/page.dto';
import { BaseQueryDto } from '@/common/dto/base-query.dto';
import { UpdateSurveyRequestDto } from '@/survey/dto/update-survey-request.dto';
import { Status } from '@/common/enum';
import { CreateSurveyRequestDto } from '@/survey/dto/create-survey-request.dto';
import { Survey } from '@/schema/survey.schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class SurveyService {
  constructor(@InjectModel(Survey.name) private surveyModel: Model<Survey>) {}

  async create(createSurveyDto: CreateSurveyRequestDto): Promise<string> {
    const createdSurvey = new this.surveyModel(createSurveyDto);
    return (await createdSurvey.save())._id.toString();
  }

  async findAll(baseQueryDto: BaseQueryDto): Promise<PageDto<Survey[]>> {
    const { page, offset } = baseQueryDto;
    return new PageDto(
      page,
      offset,
      await this.surveyModel
        .find({
          status: Status.NORMAL,
        })
        .count(),
      await this.surveyModel
        .find()
        .skip(page * offset)
        .limit(offset)
        .sort('-createdAt'),
    );
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
