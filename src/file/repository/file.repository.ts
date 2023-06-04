import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File } from '@/schema/file.schema';

@Injectable()
export class FileRepository {
  constructor(@InjectModel(File.name) private fileModel: Model<File>) {}

  async create(originName: string, s3Link: string): Promise<File> {
    return await this.fileModel.create({
      originName,
      s3Link,
    });
  }
}
