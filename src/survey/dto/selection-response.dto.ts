import { SelectionType } from '@/common/constant/enum';
import { ApiProperty } from '@nestjs/swagger';

export class SelectionResponseDto {
  @ApiProperty({
    enum: SelectionType,
  })
  type: SelectionType;

  @ApiProperty({
    type: String,
  })
  content: string;

  constructor(type: SelectionType, content: string) {
    this.type = type;
    this.content = content;
  }
}
