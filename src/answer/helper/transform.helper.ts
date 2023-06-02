import { AnswerResponseDto } from '@/survey/dto/answer-response.dto';
import { Answer } from '@/schema/answer.schema';
import moment from 'moment-timezone';

export class TransformHelper {
  toArrayResponseDto = (data: Answer[]): AnswerResponseDto[] => {
    return data.map(
      ({ _id, survey, author, createdAt, updatedAt, answers }) => ({
        _id,
        survey,
        author,
        createdAt: moment.utc(createdAt).tz('Asia/Seoul').format(),
        updatedAt: moment.utc(updatedAt).tz('Asia/Seoul').format(),
        answers,
      }),
    );
  };

  toResponseDto = (data: Answer): AnswerResponseDto => {
    const { _id, survey, author, createdAt, updatedAt, answers } = data;

    return {
      _id,
      survey,
      author,
      createdAt: moment.utc(createdAt).tz('Asia/Seoul').format(),
      updatedAt: moment.utc(updatedAt).tz('Asia/Seoul').format(),
      answers,
    };
  };
}
