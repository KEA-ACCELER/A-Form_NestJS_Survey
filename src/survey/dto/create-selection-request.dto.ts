import { SelectionType } from '@/common/constant/enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateSelectionRequestDto {
  @ApiProperty({
    enum: SelectionType,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(SelectionType)
  type: SelectionType;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  constructor(type: SelectionType, content: string) {
    this.type = type;
    this.content = content;
  }
}
