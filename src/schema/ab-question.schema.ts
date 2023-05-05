import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ABQuestion {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Prop({ type: String })
  imageUrl: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Prop({ type: String })
  description: string;

  constructor(imageUrl: string, description: string) {
    this.imageUrl = imageUrl;
    this.description = description;
  }
}
