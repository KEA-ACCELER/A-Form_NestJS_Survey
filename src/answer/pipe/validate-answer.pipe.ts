import { ABSurvey } from '@/common/enum';
import { Question } from '@/schema/question.schema';
import { CreateAnswerRequestDto } from '@/answer/dto/create-answer-request.dto';
import { SurveyType, QuestionType } from '@/common/enum';
import { SurveyService } from '@/survey/service/survey.service';
import { PipeTransform, BadRequestException, Injectable } from '@nestjs/common';

// TODO: NormalForm validate 처리하기
@Injectable()
export class ValidateAnswerPipe implements PipeTransform {
  constructor(private readonly surveyService: SurveyService) {}

  async transform(requestDto: CreateAnswerRequestDto) {
    const survey = await this.surveyService.findOne(requestDto.survey);
    if (survey.type === SurveyType.NORMAL) {
      // this.isArrayOfType(requestDto.answers, 'number');
      // this.isArrayOfType(requestDto.answers, 'string');
      // this.validateNormalSurvey(
      //   survey.questions,
      //   requestDto.answers as (string | number)[][],
      // );
    } else if (survey.type === SurveyType.AB) {
      if (typeof requestDto.answers !== 'string')
        throw new BadRequestException('Check answers type');
      this.validateABSurvey(requestDto.answers);
    }
    return requestDto;
  }

  // validateCheckBox(question: Question, answers: number[]) {
  //   if (question.selections) {
  //     if (answers.length < 0 || answers.length > question.selections.length) {
  //       throw new BadRequestException('The number of questions does not match');
  //     }
  //     if (question.selections?.length < Math.max(...answers)) {
  //       throw new BadRequestException('Check selections');
  //     }
  //   }
  // }

  // validateRadio(question: Question, answers: number[]) {
  //   if (answers.length !== 1) {
  //     throw new BadRequestException('The number of questions does not match');
  //   }
  // }

  // validateShortForm(answers: string[]) {
  //   if (answers.length !== 1)
  //     throw new BadRequestException('The number of questions does not match');
  // }

  // validateNormalSurvey(questions: any[], answers: (string | number)[][]) {
  //   if (questions.length !== answers.length) {
  //     throw new BadRequestException('The number of questions does not match');
  //   }
  //   questions.forEach((question: Question) => {
  //     if (question.type === QuestionType.CHECKBOX) {
  //       this.isArrayOfType(answers, 'number'); // 배열 요소 전체가 number인지 확인
  //       answers.forEach((answer: any[]) => {
  //         this.validateCheckBox(question, answers as number[]);
  //       });
  //     } else if (question.type === QuestionType.RADIO) {
  //       this.isArrayOfType(answers, 'number'); // 배열 요소 전체가 number인지 확인
  //       this.validateRadio(question, answers as number[]);
  //     }
  //     if (question.type === QuestionType.SHORTFORM) {
  //       this.isArrayOfType(answers, 'string'); // 배열 요소 전체가 string인지 확인
  //       this.validateShortForm(answers as string[]);
  //     }
  //   });
  // }

  validateABSurvey(answers: string) {
    if (answers !== ABSurvey.A && answers !== ABSurvey.B)
      throw new BadRequestException('answers must be A or B');
  }

  isArrayOfType(arr: any, type: string) {
    if (!(Array.isArray(arr) && arr.every((item) => typeof item === type))) {
      throw new BadRequestException('The number of questions does not match');
    }
  }
}
