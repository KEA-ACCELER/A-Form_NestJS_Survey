import { ErrorMessage } from '@/common/constant/error-message';
import { Types } from 'mongoose';
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, Types.ObjectId> {
  public transform(value: any): Types.ObjectId {
    try {
      return new Types.ObjectId(value);
    } catch (error) {
      throw new BadRequestException(ErrorMessage.INVALID_OBJECT_ID);
    }
  }
}
