import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.SUPABASE_DB_URL) {
  throw new Error('SUPABASE_DB_URL is not set');
}

const client = postgres(process.env.SUPABASE_DB_URL);
export const db = drizzle(client, { schema });

export type Database = typeof db;
export * from './schema';
