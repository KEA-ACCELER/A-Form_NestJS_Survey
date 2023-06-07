import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class S3Helper {
  private readonly s3;
  private endpoint = process.env.AWS_ENDPOINT;
  private region = process.env.REGION;
  private accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
  private secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';
  private bucketName = process.env.S3_BUCKET_NAME || '';

  constructor() {
    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
      endpoint: this.endpoint,
      forcePathStyle: true,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    fileName: string,
  ): Promise<string> {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: file.buffer,
        ACL: 'public-read',
      }),
    );

    return `${this.endpoint}${this.bucketName}/${fileName}`;
  }
}
