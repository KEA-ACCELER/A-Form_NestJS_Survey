import { ABSurvey } from '@/common/enum';
import { SurveyType } from '@/common/enum';
import { SurveyService } from '@/survey/service/survey.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class SurveyCheckHelper {
  constructor(private surveyService: SurveyService) {}

  getSurveyType = async (_id: Types.ObjectId): Promise<SurveyType> => {
    const survey = await this.surveyService.findOne(_id);
    return survey.type;
  };

  checkABUpdate = (answers: any[]): ABSurvey => {
    if (JSON.stringify(answers) === JSON.stringify(['A'])) {
      return ABSurvey.A;
    } else if (JSON.stringify(answers) === JSON.stringify(['B'])) {
      return ABSurvey.B;
    }
    throw new BadRequestException();
  };
}
