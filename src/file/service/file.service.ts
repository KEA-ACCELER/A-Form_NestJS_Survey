import { S3Helper } from '@/file/helper/s3.helper';
import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { File } from '@/schema/file.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class FileService {
  constructor(
    private s3Helper: S3Helper,
    @InjectModel(File.name) private fileModel: Model<File>,
  ) {}

  async uploadFiles(
    files: Array<Express.Multer.File>,
  ): Promise<Types.ObjectId[]> {
    const result: Types.ObjectId[] = [];

    files && files.length
      ? await Promise.all(
          files.map(async (file) => {
            const fileName = uuidv4();
            const uploadData = await this.s3Helper.uploadFile(file, fileName);

            result.push(
              (
                await this.fileModel.create({
                  originName: file.originalname,
                  s3Link: uploadData.Location,
                })
              )._id,
            );
          }),
        )
      : [];

    return result;
  }
}
