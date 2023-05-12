export enum Status {
  NORMAL = 'NORMAL',
  DELETED = 'DELETED',
}

export enum SurveyType {
  NORMAL = 'NORMAL',
  AB = 'AB',
}

export enum QuestionType {
  RADIO = 'RADIO',
  CHECKBOX = 'CHECKBOX',
  SHORTFORM = 'SHORTFORM',
}

export enum SelectionType {
  LETTER = 'LETTER',
  IMAGE = 'IMAGE',
}

export enum SuveyProgressStatus {
  ALL = 'all',
  IN_PROGRESS = 'in-progress', // 진행중
  END = 'end', // 종료
}

export enum SurveySort {
  POPULAR = 'popular', // 인기순
  ASC = 'asc', // 오름차순
  DESC = 'desc', // 내림차순
}

export enum UserEndpoint {
  GET_USER_INFO_URI = 'app/user/info',
}

export enum RedisKey {
  ANSWER = 'answer',
}

export enum ABSurvey {
  A = 'A',
  B = 'B',
}
