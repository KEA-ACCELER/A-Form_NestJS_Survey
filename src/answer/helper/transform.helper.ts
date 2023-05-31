import { AnswerResponseDto } from '@/survey/dto/answer-response.dto';
import { Answer } from '@/schema/answer.schema';

export class TransformHelper {
  toArrayResponseDto = (data: Answer[]): AnswerResponseDto[] => {
    return data.map(
      ({ _id, survey, author, createdAt, updatedAt, answers }) => ({
        _id,
        survey,
        author,
        createdAt,
        updatedAt,
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
      createdAt,
      updatedAt,
      answers,
    };
  };
}
