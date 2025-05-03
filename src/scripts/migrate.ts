import { db } from '@/infrastructure/database';
import { migrate } from 'drizzle-orm/mysql2/migrator';

async function main() {
  console.log('Running migrations...');

  await migrate(db, {
    migrationsFolder: './src/infrastructure/database/migrations',
  });

  console.log('Migrations completed successfully!');
  process.exit(0);
}

main().catch((err) => {
  console.error('Migration failed!', err);
  process.exit(1);
});
