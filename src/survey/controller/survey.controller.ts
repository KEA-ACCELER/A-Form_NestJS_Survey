import {
  NormalStatistics,
  SurveyStatistics,
  ABStatistics,
} from '@/survey/dto/survey-statistics.dto';
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
} from '@nestjs/swagger';
import { Survey } from '@/schema/survey.schema';
import { PageDto } from '@/common/dto/page.dto';
import { PaginationResponse } from '@/common/decorator/pagination-response.decorator';
import { AuthGuard } from '@/common/guard/auth.guard';
import { User } from '@/common/decorator/user.decorator';
import { AnswerService } from '@/answer/service/answer.service';

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
  @PaginationResponse(Survey)
  async findAll(@Query() query: FindSurveyDto): Promise<PageDto<Survey[]>> {
    return await this.surveyService.findAll(query);
  }

  @Get(':_id')
  @ApiParam({
    name: '_id',
    type: String,
  })
  @ApiOperation({ summary: '설문 상세 조회 API' })
  @ApiOkResponse({
    type: Survey,
  })
  async findOne(
    @Param('_id', ParseObjectIdPipe) _id: Types.ObjectId,
  ): Promise<Survey> {
    return await this.surveyService.findOne(_id);
  }

  @Get(':_id/statistics')
  @ApiParam({
    name: '_id',
    type: String,
  })
  @ApiOperation({ summary: '설문 통계 조회 API' })
  @ApiExtraModels(NormalStatistics, ABStatistics)
  @ApiOkResponse({
    type: SurveyStatistics,
  })
  async findOneStatistics(
    @Param('_id', ParseObjectIdPipe) _id: Types.ObjectId,
  ): Promise<SurveyStatistics> {
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
