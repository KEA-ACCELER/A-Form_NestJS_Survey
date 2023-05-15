import { SurveyType } from '@/common/constant/enum';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsObject, IsString } from 'class-validator';

export class NormalStatistics {
  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  index: number;

  @ApiProperty({
    type: Object,
    additionalProperties: {
      type: 'number',
    },
  })
  @IsObject()
  values: Record<string, number>;

  constructor(index: number, values: Record<string, number>) {
    this.index = index;
    this.values = values;
  }
}

export class ABStatistics {
  @ApiProperty({
    type: String,
  })
  @IsString()
  type: string;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  count: number;

  constructor(type: string, count: number) {
    this.type = type;
    this.count = count;
  }
}

export class SurveyStatistics {
  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  totalCnt: number;

  @ApiProperty({
    enum: SurveyType,
  })
  @IsEnum(SurveyType)
  type: SurveyType;

  @IsArray()
  @ApiProperty({
    isArray: true,
    oneOf: [
      { $ref: getSchemaPath(NormalStatistics) },
      { $ref: getSchemaPath(ABStatistics) },
    ],
  })
  statistics: NormalStatistics[] | ABStatistics[];

  constructor(
    totalCnt: number,
    type: SurveyType,
    statistics: NormalStatistics[] | ABStatistics[],
  ) {
    this.totalCnt = totalCnt;
    this.type = type;
    this.statistics = statistics;
  }
}
