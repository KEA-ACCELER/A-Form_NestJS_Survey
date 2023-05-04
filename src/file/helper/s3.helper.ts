import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/clients/s3';

@Injectable()
export class S3Helper {
  private readonly s3;

  constructor() {
    AWS.config.update({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
    this.s3 = new AWS.S3();
  }

  async uploadFile(
    file: Express.Multer.File,
    fileName: string,
  ): Promise<ManagedUpload.SendData> {
    return await this.s3
      .upload({
        Key: fileName,
        Body: file.buffer,
        Bucket: process.env.S3_BUCKET || '',
      })
      .promise();
  }
}
