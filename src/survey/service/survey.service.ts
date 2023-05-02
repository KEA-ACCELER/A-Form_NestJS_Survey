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
    await this.surveyModel.updateOne(
      {
        _id,
        status: Status.NORMAL,
      },
      { $set: updateSurveyDto },
    );

    return _id.toString();
  }
}
