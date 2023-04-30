import { CreateSurveyRequestDto } from '@/survey/dto/create-survey-request.dto';
import { SurveyService } from '@/survey/service/survey.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('survey')
export class SurveyController {
  constructor(private surveyService: SurveyService) {}

  @Post()
  async create(@Body() createSurveyRequestDto: CreateSurveyRequestDto) {
    return await this.surveyService.create(createSurveyRequestDto);
  }
}
