import { z } from 'zod';
import { clientEnv } from './client';

const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_DB_URL: z.string().url(),
});

export const serverEnv = serverEnvSchema.parse({
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_DB_URL: process.env.SUPABASE_DB_URL,
});

export const supabaseConfig = {
  url: clientEnv.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  serviceRoleKey: serverEnv.SUPABASE_SERVICE_ROLE_KEY,
};

export type ServerEnv = typeof serverEnv;
