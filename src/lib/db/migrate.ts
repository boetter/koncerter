// Run this script once to apply migrations to your database:
// DATABASE_URL=file:local.db npx tsx src/lib/db/migrate.ts
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { createClient } from '@libsql/client';

const url = process.env.DATABASE_URL ?? 'file:local.db';
const authToken = process.env.DATABASE_AUTH_TOKEN;

const client = createClient({ url, authToken: authToken || undefined });
const db = drizzle(client);

await migrate(db, { migrationsFolder: './drizzle' });
console.log('Migrations applied');
client.close();
