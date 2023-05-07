import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SurveyModule } from '@/survey/survey.module';
import { FileModule } from '@/file/file.module';

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
    SurveyModule,
    FileModule,
  ],
})
export class AppModule {}
