import { SurveyType } from '@/common/enum';
import { SurveyService } from '@/survey/service/survey.service';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class SurveyCheckHelper {
  constructor(private surveyService: SurveyService) {}

  getSurveyType = async (_id: Types.ObjectId): Promise<SurveyType> => {
    const survey = await this.surveyService.findOne(_id);
    return survey.type;
  };
}
