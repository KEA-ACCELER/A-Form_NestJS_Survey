import { S3Helper } from '@/file/helper/s3.helper';
import { Module } from '@nestjs/common';
import { FileService } from '@/file/service/file.service';
import { FileController } from '@/file/controller/file.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from '@/schema/file.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
  ],
  providers: [FileService, S3Helper],
  controllers: [FileController],
})
export class FileModule {}
