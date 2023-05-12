import { Types } from 'mongoose';
import { ABSurvey } from '@/common/constant/enum';
import { CreateAnswerRequestDto } from '@/answer/dto/create-answer-request.dto';
import { SurveyType } from '@/common/constant/enum';
import { SurveyService } from '@/survey/service/survey.service';
import {
  PipeTransform,
  BadRequestException,
  Injectable,
  ArgumentMetadata,
} from '@nestjs/common';
import { ErrorMessage } from '@/common/constant/error-message';

@Injectable()
export class ValidateAnswerPipe implements PipeTransform {
  constructor(private readonly surveyService: SurveyService) {}

  async transform(
    requestDto: CreateAnswerRequestDto,
    metadata: ArgumentMetadata,
  ) {
    const survey = await this.surveyService.findOne(
      new Types.ObjectId(metadata.data),
    );
    const { type: surveyType } = survey;

    switch (surveyType) {
      case SurveyType.NORMAL: {
        this.validateNormalSurvey(requestDto);
        break;
      }
      case SurveyType.AB: {
        this.validateABSurvey(requestDto);
        break;
      }
    }

    return requestDto;
  }

  validateNormalSurvey(requestDto: CreateAnswerRequestDto) {
    // 2차원 배열 check
    if (Array.isArray(requestDto.answers)) {
      for (const answer of requestDto.answers) {
        // 1차원 배열 check
        if (Array.isArray(answer)) {
          for (const item of answer) {
            // TODO: validate checkbox, radio, shorform
            if (typeof item !== 'string' && typeof item !== 'number') {
              throw new BadRequestException(ErrorMessage.INVALID_ANSWER_TYPE);
            }
          }
        } else {
          throw new BadRequestException(ErrorMessage.INVALID_ANSWER_TYPE);
        }
      }
    } else {
      throw new BadRequestException(ErrorMessage.INVALID_ANSWER_TYPE);
    }
  }

  validateABSurvey(requestDto: CreateAnswerRequestDto) {
    if (requestDto.answers !== ABSurvey.A && requestDto.answers !== ABSurvey.B)
      throw new BadRequestException(ErrorMessage.INVALID_AB_ANSWER_TYPE);
  }
}
