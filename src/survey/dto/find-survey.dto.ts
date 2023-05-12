import { BaseQueryDto } from '@/common/dto/base-query.dto';
import { SurveySort, SuveyProgressStatus } from '@/common/constant/enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class FindSurveyDto extends BaseQueryDto {
  @ApiProperty({
    enum: SuveyProgressStatus,
    required: true,
    default: SuveyProgressStatus.ALL,
  })
  @IsNotEmpty()
  progressStatus: SuveyProgressStatus;

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

  constructor(
    progressStatus: SuveyProgressStatus,
    content?: string,
    sort?: SurveySort,
  ) {
    super();
    this.progressStatus = progressStatus;
    this.content = content;
    this.sort = sort;
  }
}
