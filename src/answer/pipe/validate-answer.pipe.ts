import { CreateAnswerRequestDto } from '@/answer/dto/create-answer-request.dto';
import { SurveyType } from '@/common/enum';
import { SurveyService } from '@/survey/service/survey.service';
import { PipeTransform, BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class ValidateAnswerPipe implements PipeTransform {
  constructor(private readonly surveyService: SurveyService) {}

  async transform(requestDto: CreateAnswerRequestDto) {
    const survey = await this.surveyService.findOne(requestDto.survey);
    if (survey.type === SurveyType.NORMAL) {
      if (survey.questions.length !== requestDto.answers.length) {
        throw new BadRequestException('The number of questions does not match');
      }
    } else if (survey.type === SurveyType.AB) {
      if (requestDto.answers.length !== 1)
        throw new BadRequestException('The number of questions does not match');
    }

    // TODO: NORMAL form selection 일치 확인
    // TODO: AB form selection 일치 확인
    return requestDto;
  }
}
