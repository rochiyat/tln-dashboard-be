import { Elysia } from 'elysia';
import { authController } from '@/interface/controllers/auth.controller';
import { cors } from '@elysiajs/cors';
import { errorHandler } from '@/interface/middleware/error-handler';
import { swagger } from '@elysiajs/swagger';
import { userController } from '@/interface/controllers/user.controller';

export const createServer = (port: number = 3000) => {
    return new Elysia()
        .use(cors())
        .use(swagger({
            path: '/docs',
            documentation: {
                info: {
                    title: 'ElysiaJS + Drizzle API',
                    version: '1.0.0'
                }
            }
        }))

        .use(errorHandler)

        .use(authController)
        .use(userController)

        .get('/health', () => ({
            status: 'ok',
            timestamp: new Date().toISOString()
        }))

        .listen(port);
};