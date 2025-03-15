import { createServer } from './main/server';

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const server = createServer(port);

console.log(`🚀 Server running at ${server.server?.hostname}:${server.server?.port}`);
