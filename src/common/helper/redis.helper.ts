import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisHelper {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  // Redis는 기본적으로 문자열만 저장할 수 있지만 cache-manager가 형변환해서 가져옴 -> 제대로 작동안함..?
  async get(key: string): Promise<string | undefined> {
    return await this.cacheManager.get(key);
  }

  async set(key: string, value: string): Promise<string> {
    await this.cacheManager.set(key, value);
    return value;
  }

  async increment(key: string, value: string): Promise<string> {
    const newValue = parseInt(value) + 1;
    await this.cacheManager.set(key, newValue.toString());
    return newValue.toString();
  }

  async delete(key: string): Promise<void> {
    return await this.cacheManager.del(key);
  }
}
