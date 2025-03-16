import { Elysia } from 'elysia';
import { logger } from '../logger';
import { redisClient } from '../redis';

interface RateLimiterOptions {
    windowMs: number;
    max: number;
    standardHeaders: boolean;
    message?: string;
}

export const createRateLimiter = (options: RateLimiterOptions) => {
    const { windowMs, max, standardHeaders, message } = options;

    return new Elysia({ name: 'Middleware.RateLimiter' })
        .derive(async ({ request, error, set, server }) => {
            try {
                const ip = server?.requestIP(request) || request.headers.get('x-forwarded-for') || 'unknown';

                const key = `rate-limit:${ip}:${request.method}:${new URL(request.url).pathname}`;

                let currentCount = await redisClient.get(key);
                let count = currentCount ? parseInt(currentCount) : 0;

                if (!currentCount) {
                    await redisClient.set(key, '1', { EX: Math.floor(windowMs / 1000) });
                    count = 1;
                } else {
                    count += 1;
                    await redisClient.set(key, count.toString(), { KEEPTTL: true });
                }

                const ttl = await redisClient.ttl(key);

                if (standardHeaders) {
                    set.headers['X-RateLimit-Limit'] = max.toString();
                    set.headers['X-RateLimit-Remaining'] = Math.max(0, max - count).toString();
                    set.headers['X-RateLimit-Reset'] = (Math.floor(Date.now() / 1000) + ttl).toString();
                }

                if (count > max) {
                    logger.warn(`Rate limit exceeded for ${ip} on ${request.method} ${new URL(request.url).pathname}`);

                    set.headers['Retry-After'] = ttl.toString();

                    return error(429, {
                        status: 'error',
                        message: message || 'Too many requests, please try again later'
                    });
                }

                return { rateLimited: false };
            } catch (err) {
                logger.error('Rate limiter error', { error: err });
                return { rateLimited: false };
            }
        });
};

export const strictRateLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    message: 'Too many attempts, please try again later'
});

export const globalRateLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true
});