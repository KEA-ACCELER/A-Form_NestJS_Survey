import { CreateSelectionRequestDto } from '@/survey/dto/create-selection-request.dto';
import { QuestionType } from '@/common/enum';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuestionRequestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(QuestionType)
  type: QuestionType;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateSelectionRequestDto)
  selections: Selection[];

  constructor(title: string, type: QuestionType, selections: Selection[]) {
    this.title = title;
    this.type = type;
    this.selections = selections;
  }
}
