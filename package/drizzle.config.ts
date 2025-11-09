import 'dotenv/config';

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.SUPABASE_DB_URL!,
  },
} as const;

