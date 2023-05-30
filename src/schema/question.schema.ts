import { QuestionType } from '@/common/constant/enum';
import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Selection } from '@/schema/selection.schema';

export class Question {
  @Prop({ type: String })
  title: string;

  @Prop({ type: String, enum: QuestionType })
  type: QuestionType;

  @Prop({ type: Boolean })
  isRequired: boolean;

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
