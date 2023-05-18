import { QuestionType } from '@/common/constant/enum';
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
    type: Boolean,
  })
  @Prop({ type: Boolean })
  isRequired: boolean;

  @ApiProperty({
    isArray: true,
    type: Selection,
    required: false,
  })
  @Prop({ type: Types.Array })
  selections?: Selection[];

  constructor(
    title: string,
    type: QuestionType,
    isRequired: boolean,
    selections?: Selection[],
  ) {
    this.title = title;
    this.type = type;
    this.isRequired = isRequired;
    this.selections = selections;
  }
}
