import { connectRedis, disconnectRedis } from './infrastructure/redis';

import { createServer } from './main/server';
import { logger } from './infrastructure/logger';

async function start() {
    try {
        await connectRedis();

        const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
        const server = createServer(port);

        logger.info(`🚀 Server running at ${server.server?.hostname}:${server.server?.port}`);


        const shutdown = async () => {
            logger.info('Shutting down server...');
            await disconnectRedis();
            process.exit(0);
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);

    } catch (error) {
        logger.error('Failed to start server', { error });
        process.exit(1);
    }
}

start();
