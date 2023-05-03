import { SortOrder } from 'mongoose';
import { SurveySort, SuveyProgressStatus } from '@/common/enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QueryHelper {
  getSortQuery(type: SurveySort): { [key: string]: SortOrder } {
    switch (type) {
      case SurveySort.ASC: {
        return { createdAt: 1 };
      }
      case SurveySort.DESC: {
        return { createdAt: -1 };
      }
      case SurveySort.POPULAR: {
        return { view: 1 };
      }
    }
  }

  getKeywordQuery(content: string): Array<any> {
    return [
      { title: { $regex: content, $options: 'i' } },
      { discription: { $regex: content, $options: 'i' } },
      // TODO: author name check
    ];
  }

  getProgressQuery(progressStatus?: SuveyProgressStatus): any {
    switch (progressStatus) {
      case SuveyProgressStatus.END: {
        return [
          {
            deadline: {
              $lt: new Date(),
            },
          },
        ];
      }
      case SuveyProgressStatus.IN_PROGRESS: {
        return [
          {
            deadline: {
              $gt: new Date(),
            },
          },
        ];
      }
    }
  }
}
