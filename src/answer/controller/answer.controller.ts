import { AuthGuard } from '@/common/guard/auth.guard';
import { AnswerService } from '@/answer/service/answer.service';
import { UserResponseDto } from '@/common/dto/user-response.dto';
import { User } from '@/common/decorator/user.decorator';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateAnswerRequestDto } from '@/answer/dto/create-answer-request.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('answers')
@Controller('answers')
export class AnswerController {
  constructor(private answerService: AnswerService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  // @UsePipes(ValidateAnswerPipe)
  @ApiOperation({ summary: '설문 응답 API' })
  @ApiCreatedResponse({
    type: String,
  })
  create(
    @User() user: UserResponseDto,
    @Body() requestDto: CreateAnswerRequestDto,
  ): Promise<string> {
    return this.answerService.create(user.userId, requestDto);
  }
}
