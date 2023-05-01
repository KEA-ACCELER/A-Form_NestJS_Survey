import { Types } from 'mongoose';
import { CreateSurveyRequestDto } from '@/survey/dto/create-survey-request.dto';
import { SurveyService } from '@/survey/service/survey.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ParseObjectIdPipe } from '@/common/pipes/parse-object-id.pipe';

@Controller('survey')
export class SurveyController {
  constructor(private surveyService: SurveyService) {}

  @Post()
  async create(@Body() createSurveyRequestDto: CreateSurveyRequestDto) {
    return await this.surveyService.create(createSurveyRequestDto);
  }

  @Get(':_id')
  async findOne(@Param('_id', ParseObjectIdPipe) _id: Types.ObjectId) {
    return await this.surveyService.findOne(_id);
  }
}
