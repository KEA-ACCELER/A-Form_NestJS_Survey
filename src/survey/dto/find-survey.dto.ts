import { BaseQueryDto } from '@/common/dto/base-query.dto';
import { SurveySort } from '@/common/constant/enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FindSurveyDto extends BaseQueryDto {
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  content?: string;

  @ApiProperty({
    enum: SurveySort,
    required: false,
    default: SurveySort.DESC,
  })
  @IsOptional()
  sort?: SurveySort;

  constructor(content?: string, sort?: SurveySort) {
    super();
    this.content = content;
    this.sort = sort;
  }
}
