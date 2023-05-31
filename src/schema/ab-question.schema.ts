import { Prop } from '@nestjs/mongoose';

export class ABQuestion {
  @Prop({ type: String })
  imageUrl: string;

  @Prop({ type: String })
  description: string;

  constructor(imageUrl: string, description: string) {
    this.imageUrl = imageUrl;
    this.description = description;
  }
}
