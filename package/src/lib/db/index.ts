import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/lib/db/schema';

const rawConnectionString = process.env.SUPABASE_DB_URL;

if (!rawConnectionString) {
  throw new Error(
    'SUPABASE_DB_URL is not set. Ensure environment variables are configured.'
  );
}

const connectionString: string = rawConnectionString;

declare global {
  // eslint-disable-next-line no-var
  var __drizzleDb__: PostgresJsDatabase<typeof schema> | undefined;
  // eslint-disable-next-line no-var
  var __drizzleClient__: ReturnType<typeof postgres> | undefined;
}

function createClient() {
  return postgres(connectionString, {
    ssl: 'require',
    max: 1,
    prepare: false,
  });
}

const client = global.__drizzleClient__ ?? createClient();

export const db: PostgresJsDatabase<typeof schema> =
  global.__drizzleDb__ ?? drizzle(client, { schema });

if (process.env.NODE_ENV !== 'production') {
  global.__drizzleClient__ = client;
  global.__drizzleDb__ = db;
}

export type Database = typeof db;
