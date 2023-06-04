import { FileRepository } from '@/file/repository/file.repository';
import { S3Helper } from '@/file/helper/s3.helper';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  constructor(
    private s3Helper: S3Helper,
    private fileRepository: FileRepository,
  ) {}

  async uploadFiles(files: Array<Express.Multer.File>): Promise<string[]> {
    const result: string[] = [];

    files && files.length
      ? await Promise.all(
          files.map(async (file) => {
            const fileName = uuidv4();
            const uploadData = await this.s3Helper.uploadFile(file, fileName);

            result.push(
              (
                await this.fileRepository.create(
                  file.originalname,
                  uploadData.Location,
                )
              ).s3Link,
            );
          }),
        )
      : [];

    return result;
  }
}
