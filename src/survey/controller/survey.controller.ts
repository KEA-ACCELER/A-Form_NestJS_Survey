import { ABQuestionResponseDto } from '@/survey/dto/ab-question-response.dto';
import { QuestionResponseDto } from '@/survey/dto/question-response.dto';
import {
  NormalStatisticsResponseDto,
  SurveyStatisticsResponseDto,
  ABStatisticsResponseDto,
  NormalStatisticsValue,
} from '@/survey/dto/survey-statistics-response.dto';
import { UserResponseDto } from '@/common/dto/user-response.dto';
import { FindSurveyDto } from '@/survey/dto/find-survey.dto';
import { Types } from 'mongoose';
import { CreateSurveyRequestDto } from '@/survey/dto/create-survey-request.dto';
import { SurveyService } from '@/survey/service/survey.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ParseObjectIdPipe } from '@/common/pipes/parse-object-id.pipe';
import { UpdateSurveyRequestDto } from '@/survey/dto/update-survey-request.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { PageDto } from '@/common/dto/page.dto';
import { PaginationResponse } from '@/common/decorator/pagination-response.decorator';
import { AuthGuard } from '@/common/guard/auth.guard';
import { User } from '@/common/decorator/user.decorator';
import { AnswerService } from '@/answer/service/answer.service';
import { CreateABQuestionRequestDto } from '@/survey/dto/create-abquestion-request.dto';
import { CreateQuestionRequestDto } from '@/survey/dto/create-question-request.dto';
import { FindPopularSurveyDto } from '@/survey/dto/find-popular-survey.dto';
import { SurveyResponseDto } from '@/survey/dto/survey-response.dto';

@ApiTags('surveys')
@Controller('surveys')
export class SurveyController {
  constructor(
    private surveyService: SurveyService,
    private answerService: AnswerService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '설문 생성 API' })
  @ApiExtraModels(CreateABQuestionRequestDto, CreateQuestionRequestDto)
  @ApiCreatedResponse({
    type: String,
  })
  async create(
    @User() user: UserResponseDto,
    @Body() createSurveyRequestDto: CreateSurveyRequestDto,
  ): Promise<string> {
    return await this.surveyService.create(user.userId, createSurveyRequestDto);
  }

  @Get()
  @ApiOperation({ summary: '설문 전체 조회 API' })
  @ApiExtraModels(QuestionResponseDto, ABQuestionResponseDto)
  @PaginationResponse(SurveyResponseDto)
  async findAll(
    @Query() query: FindSurveyDto,
  ): Promise<PageDto<SurveyResponseDto[]>> {
    return await this.surveyService.findAll(query);
  }

  @Get('popular')
  @ApiOperation({ summary: '인기 설문 조회 API' })
  @ApiOkResponse({
    schema: {
      oneOf: [
        { type: 'array', items: { $ref: getSchemaPath(SurveyResponseDto) } },
        { type: 'array', items: { type: 'string' } },
      ],
    },
  })
  async findPopular(
    @Query() query: FindPopularSurveyDto,
  ): Promise<SurveyResponseDto[] | string[]> {
    return await this.surveyService.findPopular(query);
  }

  @Get(':_id')
  @ApiParam({
    name: '_id',
    type: String,
  })
  @ApiOperation({ summary: '설문 상세 조회 API' })
  @ApiExtraModels(QuestionResponseDto, ABQuestionResponseDto)
  @ApiOkResponse({
    type: SurveyResponseDto,
  })
  async findOne(
    @Param('_id', ParseObjectIdPipe) _id: Types.ObjectId,
  ): Promise<SurveyResponseDto> {
    return await this.surveyService.findOne(_id);
  }

  @Get(':_id/statistics')
  @ApiParam({
    name: '_id',
    type: String,
  })
  @ApiOperation({ summary: '설문 통계 조회 API' })
  @ApiExtraModels(
    NormalStatisticsResponseDto,
    ABStatisticsResponseDto,
    NormalStatisticsValue,
  )
  @ApiOkResponse({
    type: SurveyStatisticsResponseDto,
  })
  async findOneStatistics(
    @Param('_id', ParseObjectIdPipe) _id: Types.ObjectId,
  ): Promise<SurveyStatisticsResponseDto> {
    return await this.answerService.findOneStatistics(_id);
  }

  @Patch(':_id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: '_id',
    type: String,
  })
  @ApiOperation({ summary: '설문 수정 API' })
  @ApiOkResponse({
    type: String,
  })
  async update(
    @User() user: UserResponseDto,
    @Param('_id', ParseObjectIdPipe) _id: Types.ObjectId,
    @Body() updateSurveyRequestDto: UpdateSurveyRequestDto,
  ): Promise<string> {
    return await this.surveyService.update(
      _id,
      user.userId,
      updateSurveyRequestDto,
    );
  }

  @Delete(':_id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: '_id',
    type: String,
  })
  @ApiOperation({ summary: '설문 삭제 API' })
  @ApiOkResponse()
  async delete(
    @User() user: UserResponseDto,
    @Param('_id', ParseObjectIdPipe) _id: Types.ObjectId,
  ): Promise<void> {
    return await this.surveyService.delete(_id, user.userId);
  }
}
