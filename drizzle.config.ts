import type { Config } from 'drizzle-kit';

export default {
  schema: './src/infrastructure/database/schema/*.ts',
  out: './src/infrastructure/database/migrations',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.MYSQL_URL || '',
    ssl: {
      rejectUnauthorized: false,
    },
  },
  verbose: true,
  strict: true,
} satisfies Config;
