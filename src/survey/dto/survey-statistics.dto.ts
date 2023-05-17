import { ABSurvey, SurveyType } from '@/common/constant/enum';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsObject } from 'class-validator';

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
    enum: ABSurvey,
  })
  @IsEnum(ABSurvey)
  type: ABSurvey;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  count: number;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  percent: number;

  constructor(type: ABSurvey, count: number, percent: number) {
    this.type = type;
    this.count = count;
    this.percent = percent;
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
    type: 'array',
    items: {
      oneOf: [
        { $ref: getSchemaPath(ABStatistics) },
        { $ref: getSchemaPath(NormalStatistics) },
      ],
    },
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
