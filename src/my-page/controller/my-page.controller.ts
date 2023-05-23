import { FindSurveyDto } from '@/survey/dto/find-survey.dto';
import { BaseQueryDto } from '@/common/dto/base-query.dto';
import { ABQuestion } from '@/schema/ab-question.schema';
import { Question } from '@/schema/question.schema';
import { AnswerService } from '@/answer/service/answer.service';
import { User } from '@/common/decorator/user.decorator';
import { UserResponseDto } from '@/common/dto/user-response.dto';
import { AuthGuard } from '@/common/guard/auth.guard';
import { ParseObjectIdPipe } from '@/common/pipes/parse-object-id.pipe';
import { Answer } from '@/schema/answer.schema';
import { Survey } from '@/schema/survey.schema';
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
    type: Answer,
  })
  findMyAnswerBySurvey(
    @User() user: UserResponseDto,
    @Param('_id', ParseObjectIdPipe) survey: Types.ObjectId,
  ): Promise<Answer> {
    return this.answerService.findMyAnswerBySurvey(user.userId, survey);
  }

  @Get('surveys')
  @ApiOperation({ summary: '나의 설문 목록 조회 API' })
  @ApiExtraModels(Question, ABQuestion)
  @PaginationResponse(Survey)
  findMySurveys(
    @User() user: UserResponseDto,
    @Query() query: FindSurveyDto,
  ): Promise<PageDto<Survey[]>> {
    return this.surveyService.findMySurveys(user.userId, query);
  }

  @Get('surveys/answers')
  @ApiOperation({ summary: '내가 응답한 설문 조회 API' })
  @PaginationResponse(Survey)
  finyMyAnsweredSurvey(
    @User() user: UserResponseDto,
    @Query() query: BaseQueryDto,
  ): Promise<PageDto<Survey[]>> {
    return this.answerService.finyMyAnsweredSurvey(user.userId, query);
  }
}
