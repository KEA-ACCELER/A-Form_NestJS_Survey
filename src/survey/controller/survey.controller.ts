import { BaseQueryDto } from '@/common/dto/base-query.dto';
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
} from '@nestjs/common';
import { ParseObjectIdPipe } from '@/common/pipes/parse-object-id.pipe';
import { UpdateSurveyRequestDto } from '@/survey/dto/update-survey-request.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Survey } from '@/schema/survey.schema';
import { PageDto } from '@/common/dto/page.dto';
import { PaginationResponse } from '@/common/decorator/pagination-response.decorator';

@ApiTags('survey')
@Controller('survey')
export class SurveyController {
  constructor(private surveyService: SurveyService) {}

  @Post()
  @ApiCreatedResponse({
    type: String,
  })
  async create(
    @Body() createSurveyRequestDto: CreateSurveyRequestDto,
  ): Promise<string> {
    return await this.surveyService.create(createSurveyRequestDto);
  }

  @Get()
  @PaginationResponse(Survey)
  async findAll(
    @Query() baseQueryDto: BaseQueryDto,
  ): Promise<PageDto<Survey[]>> {
    return await this.surveyService.findAll(baseQueryDto);
  }

  @Get(':_id')
  @ApiParam({
    name: '_id',
    type: String,
  })
  @ApiOkResponse({
    type: Survey,
  })
  async findOne(
    @Param('_id', ParseObjectIdPipe) _id: Types.ObjectId,
  ): Promise<Survey> {
    return await this.surveyService.findOne(_id);
  }

  @Patch(':_id')
  @ApiParam({
    name: '_id',
    type: String,
  })
  @ApiOkResponse({
    type: String,
  })
  async update(
    @Param('_id', ParseObjectIdPipe) _id: Types.ObjectId,
    @Body() updateSurveyRequestDto: UpdateSurveyRequestDto,
  ): Promise<string> {
    return await this.surveyService.update(_id, updateSurveyRequestDto);
  }

  @Delete(':_id')
  @ApiParam({
    name: '_id',
    type: String,
  })
  @ApiOkResponse()
  async delete(
    @Param('_id', ParseObjectIdPipe) _id: Types.ObjectId,
  ): Promise<void> {
    return await this.surveyService.delete(_id);
  }
}
