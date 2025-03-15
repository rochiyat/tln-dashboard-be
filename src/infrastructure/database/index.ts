import * as schema from './schema/users';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.PG_URL || "postgres://postgres:postgres@localhost:5432/elysia_drizzle";
const client = postgres(connectionString);
export const db = drizzle(client, { schema });

export { schema };