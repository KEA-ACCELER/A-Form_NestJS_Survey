import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ABQuestionResponseDto {
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
