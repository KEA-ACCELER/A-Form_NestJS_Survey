import { ErrorMessage } from '@/common/constant/error-message';
import { FindPopularSurveyDto } from '@/survey/dto/find-popular-survey.dto';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import moment from 'moment-timezone';

@Injectable()
export class FindPopularSurveyDtoPipe
  implements PipeTransform<FindPopularSurveyDto>
{
  transform(value: FindPopularSurveyDto) {
    const date = moment.tz(value.date, 'Asia/Seoul').utc().toDate(); //UTC
    const now = new Date();

    if (date.getTime() > now.getTime()) {
      throw new BadRequestException(ErrorMessage.INVALID_DATE);
    }

    date.setMinutes(0);
    date.setSeconds(0);

    return {
      date,
      type: value.type,
    };
  }
}
