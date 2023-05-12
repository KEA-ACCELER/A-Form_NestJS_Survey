import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateAnswerRequestDto {
  @ApiProperty({
    oneOf: [
      { type: 'array', items: { type: 'array', items: { type: 'string' } } },
      { type: 'array', items: { type: 'array', items: { type: 'number' } } },
      { type: 'string' },
    ],
  })
  @IsNotEmpty()
  answers: [string | number][] | string;

  constructor(answer: [string | number][] | string) {
    this.answers = answer;
  }
}
