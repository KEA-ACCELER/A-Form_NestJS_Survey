import { SurveyResponseDto } from '@/survey/dto/survey-response.dto';
import { Survey } from '@/schema/survey.schema';
import moment from 'moment-timezone';

export class TransformHelper {
  toArrayResponseDto = (data: Survey[]): SurveyResponseDto[] => {
    return data.map(
      ({
        _id,
        type,
        title,
        author,
        questions,
        createdAt,
        updatedAt,
        status,
        description,
      }) => ({
        _id,
        type,
        title,
        author,
        questions,
        createdAt: moment.utc(createdAt).tz('Asia/Seoul').format(),
        updatedAt: moment.utc(updatedAt).tz('Asia/Seoul').format(),
        status,
        description,
      }),
    );
  };

  toResponseDto = (data: Survey): SurveyResponseDto => {
    const {
      _id,
      type,
      title,
      author,
      questions,
      createdAt,
      updatedAt,
      status,
      description,
    } = data;

    return {
      _id,
      type,
      title,
      author,
      questions,
      createdAt: moment.utc(createdAt).tz('Asia/Seoul').format(),
      updatedAt: moment.utc(updatedAt).tz('Asia/Seoul').format(),
      status,
      description,
    };
  };
}
