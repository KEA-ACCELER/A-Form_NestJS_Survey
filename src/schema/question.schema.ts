import { QuestionType } from '@/common/enum';
import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export class Question {
  @Prop({ type: String })
  title: string;

  @Prop({ type: String, enum: QuestionType })
  type: QuestionType;

  @Prop({ type: Types.Array })
  selection: Selection[];

  constructor(title: string, type: QuestionType, selection: Selection[]) {
    this.title = title;
    this.type = type;
    this.selection = selection;
  }
}
