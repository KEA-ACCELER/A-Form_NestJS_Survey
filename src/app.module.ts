import { RedisConfigService } from './cache/cache.config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SurveyModule } from '@/survey/survey.module';
import { FileModule } from '@/file/file.module';
import { AnswerModule } from '@/answer/answer.module';
import { MyPageModule } from '@/my-page/my-page.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BatchModule } from '@/batch/batch.module';
import { CacheModule } from './cache/cache.module';

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
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useClass: RedisConfigService,
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    SurveyModule,
    FileModule,
    AnswerModule,
    MyPageModule,
    BatchModule,
    CacheModule,
  ],
})
export class AppModule {}
