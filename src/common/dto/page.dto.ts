import { ApiProperty } from '@nestjs/swagger';

export class PageDto<T> {
  @ApiProperty({
    type: Number,
  })
  page: number;

  @ApiProperty({
    type: Number,
  })
  offset: number;

  @ApiProperty({
    type: Number,
  })
  total: number;

  @ApiProperty({
    isArray: true,
  })
  data: T;

  constructor(page: number, offset: number, total: number, data: T) {
    this.page = page;
    this.offset = offset;
    this.total = total;
    this.data = data;
  }

  getSkip(): number {
    return (this.page - 1) * this.offset;
  }
}
