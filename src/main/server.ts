import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { errorHandler } from '@/interface/middleware/error-handler';
import { swagger } from '@elysiajs/swagger';
import { v1Routes } from './routes/v1';

export const createServer = (port: number = 3000) => {
    return new Elysia()
        .use(cors())
        .use(swagger({
            path: '/docs',
            documentation: {
                info: {
                    title: 'ElysiaJS + Drizzle',
                    version: '1.0.0'
                }
            }
        }))

        .use(errorHandler)
        .use(v1Routes)

        .get('/health', () => ({
            status: 'ok',
            timestamp: new Date().toISOString()
        }))

        .listen(port);
};