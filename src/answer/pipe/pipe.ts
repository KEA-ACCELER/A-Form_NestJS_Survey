import { CreateAnswerRequestDto } from '@/answer/dto/create-answer-request.dto';
import { PipeTransform, BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class TestPipe implements PipeTransform {
  async transform(requestDto: CreateAnswerRequestDto) {
    console.log('asdfasdfas');
    return requestDto;
  }
}
