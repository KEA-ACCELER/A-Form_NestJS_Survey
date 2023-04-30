import { Survey } from '@/schema/survey.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SurveyService {
  constructor(@InjectModel(Survey.name) private surveyModel: Model<Survey>) {}

  async create(createSurveyDto: any): Promise<any> {
    const createdSurvey = new this.surveyModel(createSurveyDto);
    return (await createdSurvey.save())._id;
  }
}
