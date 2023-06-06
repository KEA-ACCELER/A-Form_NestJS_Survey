import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/clients/s3';

@Injectable()
export class S3Helper {
  private readonly s3;
  private endpoint = new AWS.Endpoint(process.env.AWS_ENDPOINT || '');
  private region = process.env.REGION;
  private accessKey = process.env.AWS_ACCESS_KEY_ID || '';
  private secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';

  constructor() {
    this.s3 = new AWS.S3({
      endpoint: this.endpoint,
      region: this.region,
      credentials: {
        accessKeyId: this.accessKey,
        secretAccessKey: this.secretAccessKey,
      },
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    fileName: string,
  ): Promise<ManagedUpload.SendData> {
    return await this.s3
      .upload({
        Bucket: process.env.S3_BUCKET_NAME || '',
        Key: fileName,
        Body: file.buffer,
      })
      .promise();
  }
}
