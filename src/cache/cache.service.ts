import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@InjectRedis() private readonly redis: Redis) {}

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async set(key: string, value: string, expire?: number) {
    this.logger.debug(`redis set key: ${key}, value: ${value}`);
    return await this.redis.set(key, value, 'EX', expire ?? 7 * 24 * 60 * 60);
  }

  async del(key: string): Promise<number> {
    return this.redis.del(key);
  }
}
