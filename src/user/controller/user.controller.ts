import { AnswerService } from '@/answer/service/answer.service';
import { User } from '@/common/decorator/user.decorator';
import { UserResponseDto } from '@/common/dto/user-response.dto';
import { AuthGuard } from '@/common/guard/auth.guard';
import { ParseObjectIdPipe } from '@/common/pipes/parse-object-id.pipe';
import { Answer } from '@/schema/answer.schema';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';

@ApiTags('my-page')
@Controller('my-page')
export class UserController {
  constructor(private answerService: AnswerService) {}

  @Get('surveys/:surveyId/answers')
  @ApiBearerAuth()
  @ApiParam({
    name: 'surveyId',
    type: String,
  })
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '특정 설문에 내가 응답한 내역 조회 API' })
  @ApiOkResponse({
    type: Answer,
  })
  findOne(
    @User() user: UserResponseDto,
    @Param('surveyId', ParseObjectIdPipe) survey: Types.ObjectId,
  ) {
    return this.answerService.findUserAnswerBySurvey(user.userId, survey);
  }
}
