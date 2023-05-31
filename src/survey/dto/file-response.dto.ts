import { Status } from '@/common/constant/enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FileResponseDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  originName: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  s3Link: string;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;

  @ApiProperty({
    enum: Status,
  })
  status: Status;

  constructor(
    originName: string,
    s3Link: string,
    createdAt: Date,
    updatedAt: Date,
    status: Status,
  ) {
    this.originName = originName;
    this.s3Link = s3Link;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.status = status;
  }
}
