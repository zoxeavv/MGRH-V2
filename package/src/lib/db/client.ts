import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { serverEnv } from '@/lib/env/server';
import * as schema from './schema';

const globalForDb = globalThis as unknown as {
  postgresSql?: ReturnType<typeof postgres>;
  db?: ReturnType<typeof drizzle<typeof schema>>;
};

export const getDbClient = () => {
  if (!globalForDb.postgresSql) {
    globalForDb.postgresSql = postgres(serverEnv.SUPABASE_DB_URL, {
      prepare: false,
      max: 10,
      idle_timeout: 20,
    });
  }

  if (!globalForDb.db) {
    globalForDb.db = drizzle(globalForDb.postgresSql, {
      schema,
    });
  }

  return globalForDb.db;
};

export type DatabaseClient = ReturnType<typeof getDbClient>;
