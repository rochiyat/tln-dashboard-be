import * as schema from './schema/tln';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2';

const connectionString = process.env.MYSQL_URL_TLN;
const client = mysql.createPool(connectionString as string);
export const dbTln = drizzle(client, { schema, mode: 'default' });

export { schema };
