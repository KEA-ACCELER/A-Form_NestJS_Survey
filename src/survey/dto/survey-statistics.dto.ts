import { ABSurvey, QuestionType, SurveyType } from '@/common/constant/enum';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber } from 'class-validator';

export class NormalStatisticsValue {
  @ApiProperty({
    type: String,
  })
  index: string;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  count: number;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  percent?: number;

  constructor(index: string, count: number, percent: number) {
    this.index = index;
    this.count = count;
    this.percent = percent;
  }
}

export class NormalStatistics {
  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  index: number;

  // TODO: surveyType을 넣어야함

  @ApiProperty({
    enum: QuestionType,
  })
  type: QuestionType;

  @ApiProperty({
    type: 'array',
  })
  values: NormalStatisticsValue;

  constructor(
    index: number,
    type: QuestionType,
    values: NormalStatisticsValue,
  ) {
    this.index = index;
    this.type = type;
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
