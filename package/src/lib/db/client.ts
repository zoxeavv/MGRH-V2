import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

type DrizzleClient = PostgresJsDatabase<typeof schema>;

declare global {
  // eslint-disable-next-line no-var
  var __drizzle__: DrizzleClient | undefined;
}

const connectionString = process.env.SUPABASE_DB_URL;

if (!connectionString) {
  throw new Error(
    'Missing SUPABASE_DB_URL. Add it to your environment or .env.local before running the app.',
  );
}

const client =
  global.__drizzle__ ??
  drizzle(
    postgres(connectionString, {
      max: 1,
      prepare: false,
      ssl: 'require',
    }),
    { schema },
  );

if (!global.__drizzle__) {
  global.__drizzle__ = client;
}

export const db = client;
export * from './schema';

