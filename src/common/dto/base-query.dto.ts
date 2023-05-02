import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class BaseQueryDto {
  @ApiProperty({
    required: false,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiProperty({
    required: false,
    default: 10,
  })
  @IsNumber()
  @IsOptional()
  offset: number;

  constructor(page?: number, offset?: number) {
    this.page = page || 0;
    this.offset = offset || 10;
  }
}
