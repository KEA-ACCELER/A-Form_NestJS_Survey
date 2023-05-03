import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class BaseQueryDto {
  @ApiProperty({
    required: true,
    default: 1,
  })
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiProperty({
    required: true,
    default: 10,
  })
  @IsNumber()
  @IsOptional()
  offset: number;

  constructor(page?: number, offset?: number) {
    this.page = page || 1;
    this.offset = offset || 10;
  }
}
