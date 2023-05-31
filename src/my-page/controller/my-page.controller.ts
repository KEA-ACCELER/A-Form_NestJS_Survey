import { ABQuestionResponseDto } from '@/survey/dto/ab-question-response.dto';
import { QuestionResponseDto } from '@/survey/dto/question-response.dto';
import { SurveyResponseDto } from '@/survey/dto/survey-response.dto';
import { FindSurveyDto } from '@/survey/dto/find-survey.dto';
import { BaseQueryDto } from '@/common/dto/base-query.dto';
import { AnswerService } from '@/answer/service/answer.service';
import { User } from '@/common/decorator/user.decorator';
import { UserResponseDto } from '@/common/dto/user-response.dto';
import { AuthGuard } from '@/common/guard/auth.guard';
import { ParseObjectIdPipe } from '@/common/pipes/parse-object-id.pipe';
import { SurveyService } from '@/survey/service/survey.service';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { PageDto } from '@/common/dto/page.dto';
import { PaginationResponse } from '@/common/decorator/pagination-response.decorator';
import { AnswerResponseDto } from '@/survey/dto/answer-response.dto';

@ApiTags('my-page')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('surveys/my-page')
export class MyPageController {
  constructor(
    private answerService: AnswerService,
    private surveyService: SurveyService,
  ) {}

  @Get('surveys/:_id/answers')
  @ApiParam({
    name: '_id',
    type: String,
  })
  @ApiOperation({ summary: '특정 설문에 내가 응답한 내역 조회 API' })
  @ApiOkResponse({
    type: AnswerResponseDto,
  })
  findMyAnswerBySurvey(
    @User() user: UserResponseDto,
    @Param('_id', ParseObjectIdPipe) survey: Types.ObjectId,
  ): Promise<AnswerResponseDto> {
    return this.answerService.findMyAnswerBySurvey(user.userId, survey);
  }

  @Get('surveys')
  @ApiOperation({ summary: '나의 설문 목록 조회 API' })
  @ApiExtraModels(QuestionResponseDto, ABQuestionResponseDto)
  @PaginationResponse(SurveyResponseDto)
  findMySurveys(
    @User() user: UserResponseDto,
    @Query() query: FindSurveyDto,
  ): Promise<PageDto<SurveyResponseDto[]>> {
    return this.surveyService.findMySurveys(user.userId, query);
  }

  @Get('surveys/answers')
  @ApiOperation({ summary: '내가 응답한 설문 조회 API' })
  @PaginationResponse(SurveyResponseDto)
  finyMyAnsweredSurvey(
    @User() user: UserResponseDto,
    @Query() query: BaseQueryDto,
  ): Promise<PageDto<SurveyResponseDto[]>> {
    return this.answerService.finyMyAnsweredSurvey(user.userId, query);
  }
}
