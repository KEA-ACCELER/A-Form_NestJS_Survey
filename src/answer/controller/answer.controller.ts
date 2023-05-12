import { ParseObjectIdPipe } from '@/common/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';
import { ValidateAnswerPipe } from '@/answer/pipe/validate-answer.pipe';
import { AuthGuard } from '@/common/guard/auth.guard';
import { AnswerService } from '@/answer/service/answer.service';
import { UserResponseDto } from '@/common/dto/user-response.dto';
import { User } from '@/common/decorator/user.decorator';
import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { CreateAnswerRequestDto } from '@/answer/dto/create-answer-request.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('answers')
@Controller('surveys/:_id/answers')
export class AnswerController {
  constructor(
    private answerService: AnswerService,
    private validateAnswerPipe: ValidateAnswerPipe,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiParam({
    name: '_id',
    type: String,
  })
  @ApiOperation({ summary: '설문 응답 API' })
  @ApiCreatedResponse({
    type: String,
  })
  async create(
    @Param('_id', ParseObjectIdPipe) _id: Types.ObjectId,
    @User() user: UserResponseDto,
    @Body() requestDto: CreateAnswerRequestDto,
  ): Promise<string> {
    await this.validateAnswerPipe.transform(requestDto, {
      type: 'param',
      data: _id.toString(),
    });
    return this.answerService.create(user.userId, _id, requestDto);
  }
}
