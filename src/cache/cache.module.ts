import { KeyHelper } from '@/cache/helper/key.helper';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';

@Module({
  imports: [RedisModule],
  providers: [CacheService, KeyHelper],
  exports: [CacheService],
})
export class CacheModule {}
