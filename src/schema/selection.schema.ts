import { SelectionType } from '@/common/enum';
import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class Selection {
  @ApiProperty({
    enum: SelectionType,
  })
  @Prop({ type: String, enum: SelectionType, required: true })
  type: SelectionType;

  @ApiProperty({
    type: String,
  })
  @Prop({ type: String, required: true })
  content: string;

  constructor(type: SelectionType, content: string) {
    this.type = type;
    this.content = content;
  }
}
