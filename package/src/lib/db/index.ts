import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// During build time, env vars may not be available
// Create a dummy client that will be replaced at runtime
const dbUrl = process.env.SUPABASE_DB_URL || 'postgresql://dummy:dummy@localhost:5432/dummy';

let client: postgres.Sql;
let db: ReturnType<typeof drizzle>;

if (process.env.SUPABASE_DB_URL) {
  client = postgres(process.env.SUPABASE_DB_URL);
  db = drizzle(client, { schema });
} else {
  // Dummy client for build time
  client = postgres(dbUrl);
  db = drizzle(client, { schema });
}

export { db };

export type Database = typeof db;
export * from './schema';
