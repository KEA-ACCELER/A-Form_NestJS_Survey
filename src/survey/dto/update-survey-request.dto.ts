import { CreateSurveyRequestDto } from '@/survey/dto/create-survey-request.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateSurveyRequestDto extends PartialType(
  CreateSurveyRequestDto,
) {}
