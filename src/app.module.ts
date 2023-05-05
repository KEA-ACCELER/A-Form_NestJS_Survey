import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SurveyModule } from '@/survey/survey.module';
import { FileModule } from '@/file/file.module';
import { AnswerModule } from '@/answer/answer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: `${process.env.DATABASE_URL}`,
      }),
    }),
    SurveyModule,
    FileModule,
    AnswerModule,
  ],
})
export class AppModule {}
