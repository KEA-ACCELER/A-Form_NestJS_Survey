import { SurveyResponseDto } from '@/survey/dto/survey-response.dto';
import { Survey } from '@/schema/survey.schema';

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
        createdAt,
        updatedAt,
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
      createdAt,
      updatedAt,
      status,
      description,
    };
  };
}
