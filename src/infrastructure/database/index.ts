import * as schema from './schema/users';

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2';

const connectionString = process.env.MYSQL_URL;
const client = mysql.createConnection(connectionString as string);
export const db = drizzle(client, { schema, mode: 'default' });

export { schema };
