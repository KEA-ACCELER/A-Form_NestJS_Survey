import { SelectionResponseDto } from '@/survey/dto/selection-response.dto';
import { QuestionType } from '@/common/constant/enum';
import { ApiProperty } from '@nestjs/swagger';

export class QuestionResponseDto {
  @ApiProperty({
    type: String,
  })
  title: string;

  @ApiProperty({
    enum: QuestionType,
  })
  type: QuestionType;

  @ApiProperty({
    type: Boolean,
  })
  isRequired: boolean;

  @ApiProperty({
    isArray: true,
    type: SelectionResponseDto,
    required: false,
  })
  selections?: SelectionResponseDto[];

  constructor(
    title: string,
    type: QuestionType,
    isRequired: boolean,
    selections?: SelectionResponseDto[],
  ) {
    this.title = title;
    this.type = type;
    this.isRequired = isRequired;
    this.selections = selections;
  }
}
