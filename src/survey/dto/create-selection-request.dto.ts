import { SelectionType } from '@/common/enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateSelectionRequestDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(SelectionType)
  type: SelectionType;

  @IsString()
  @IsNotEmpty()
  content: string;

  constructor(type: SelectionType, content: string) {
    this.type = type;
    this.content = content;
  }
}
