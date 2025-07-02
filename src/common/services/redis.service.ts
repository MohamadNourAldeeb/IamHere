import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { CashingOptions } from 'src/config/redis.config';
@Injectable()
export class RedisService implements OnModuleInit {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis(CashingOptions);
  }

  publishRedisCache = async (key: string, payload: any) => {
    await this.redis.publish(key, payload);
  };

  onModuleInit() {
    // Connect to Redis
    // this.redis.connect();
  }
  addToRedisCache = async (
    key: string,
    payload: any,
    time = 360 * 24 * 60 * 60,
  ) => {
    await this.redis.set(key, payload, 'EX', time);
  };

  getFromRedisCache = async (key: string) => await this.redis.get(key);

  getKeysFromRedisCache = async (key: string) => await this.redis.keys(key);

  deleteFromRedis = async (key: string) => {
    await this.redis.del(key, function (err: any, response: any) {
      if (response === 1) {
        // console.log('Deleted Successfully ✅');
      } else {
        // console.log('Cannot delete' + { err });
      }
    });
  };
}
