import redisClient from '../config/redis.config';
import envConfig from '../config/env.config';
import { CACHE_KEYS } from '../config/constants';

export class CacheService {
    private static ttl = envConfig.cache.ttl;

    static async get<T>(key: string): Promise<T | null> {
        try {
            const data = await redisClient.get(key);
            if (!data) return null;
            return JSON.parse(data) as T;
        } catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    }


    static async set(key: string, data: any, ttl?: number): Promise<void> {
        try {
            const expiry = ttl || this.ttl;
            await redisClient.setex(key, expiry, JSON.stringify(data));
        } catch (error) {
            console.error('Cache set error:', error);
        }
    }

    static async delete(key: string): Promise<void> {
        try {
            await redisClient.del(key);
        } catch (error) {
            console.error('Cache delete error:', error);
        }
    }

    static async deletePattern(pattern: string): Promise<void> {
        try {
            const keys = await redisClient.keys(pattern);
            if (keys.length > 0) {
                await redisClient.del(...keys);
            }
        } catch (error) {
            console.error('Cache delete pattern error:', error);
        }
    }


    static async clear(): Promise<void> {
        try {
            await redisClient.flushdb();
        } catch (error) {
            console.error('Cache clear error:', error);
        }
    }


    static async invalidateClassCaches(): Promise<void> {
        try {
            await this.deletePattern('class:*');
            await this.deletePattern('classes:*');
        } catch (error) {
            console.error('Cache invalidation error:', error);
        }
    }


    static async invalidateClassCache(classId: string): Promise<void> {
        try {
            await this.delete(CACHE_KEYS.CLASS_BY_ID(classId));
            await this.deletePattern('classes:range:*');
            await this.delete(CACHE_KEYS.ALL_CLASSES);
        } catch (error) {
            console.error('Cache invalidation error:', error);
        }
    }


    static async invalidateDateRangeCaches(): Promise<void> {
        try {
            await this.deletePattern('classes:range:*');
        } catch (error) {
            console.error('Cache invalidation error:', error);
        }
    }


    static async getOrSet<T>(
        key: string,
        callback: () => Promise<T>,
        ttl?: number
    ): Promise<T> {
        const cached = await this.get<T>(key);
        if (cached !== null) {
            return cached;
        }

        const data = await callback();

        await this.set(key, data, ttl);

        return data;
    }
}