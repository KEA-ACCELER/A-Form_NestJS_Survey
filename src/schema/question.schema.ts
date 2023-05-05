import { QuestionType } from '@/common/enum';
import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Selection } from '@/schema/selection.schema';

export class Question {
  @ApiProperty({
    type: String,
  })
  @Prop({ type: String })
  title: string;

  @ApiProperty({
    enum: QuestionType,
  })
  @Prop({ type: String, enum: QuestionType })
  type: QuestionType;

  @ApiProperty({
    isArray: true,
    type: Selection,
    required: false,
  })
  @Prop({ type: Types.Array })
  selection?: Selection[];

  constructor(title: string, type: QuestionType, selection?: Selection[]) {
    this.title = title;
    this.type = type;
    this.selection = selection;
  }
}
