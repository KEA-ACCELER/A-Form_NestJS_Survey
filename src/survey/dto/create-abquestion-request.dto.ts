import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateABQuestionRequestDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  description: string;

  constructor(imageUrl: string, description: string) {
    this.imageUrl = imageUrl;
    this.description = description;
  }
}
