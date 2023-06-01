import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SurveyModule } from '@/survey/survey.module';
import { FileModule } from '@/file/file.module';
import { AnswerModule } from '@/answer/answer.module';
import { CacheModule } from '@nestjs/cache-manager';
import { MyPageModule } from '@/my-page/my-page.module';
import * as redisStore from 'cache-manager-ioredis';
import { ScheduleModule } from '@nestjs/schedule';
import { BatchModule } from '@/batch/batch.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    MongooseModule.forRootAsync({
      useFactory: () => {
        const credentials = `${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_URL}`;
        const uri =
          process.env.NODE_ENV === 'local'
            ? `mongodb+srv://${credentials}`
            : `mongodb://${credentials}`;
        return { uri };
      },
    }),
    //CacheModule.register(), // memory-cache 패키지 사용해 인메모리 캐시 설정
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => {
        return {
          store: redisStore,
          host: process.env.REDIS_HOST,
          port: 6379,
          ttl: 60 * 60 * 24, // 24시간 후 만료
        };
      },
    }),
    ScheduleModule.forRoot(),
    SurveyModule,
    FileModule,
    AnswerModule,
    MyPageModule,
    BatchModule,
  ],
})
export class AppModule {}
