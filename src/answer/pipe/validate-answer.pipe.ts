import { CreateAnswerRequestDto } from '@/answer/dto/create-answer-request.dto';
import { SurveyService } from '@/survey/service/survey.service';
import { PipeTransform, BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class ValidateAnswerPipe implements PipeTransform {
  constructor(private readonly surveyService: SurveyService) {}

  async transform(requestDto: CreateAnswerRequestDto) {
    const survey = await this.surveyService.findOne(requestDto.survey);
    if (survey.questions.length !== requestDto.answers.length) {
      throw new BadRequestException('The number of questions does not match');
    }

    // TODO: NORMAL form selection 일치 확인
    // TODO: AB form selection 일치 확인
    return requestDto;
  }
}
