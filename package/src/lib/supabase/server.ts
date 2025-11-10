import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { clientEnv } from '@/lib/env/client';
import { serverEnv } from '@/lib/env/server';

type SupabaseDatabase = any;

export const createSupabaseServerClient = (): SupabaseClient<SupabaseDatabase> => {
  const cookieStore = cookies();

  return createServerClient<SupabaseDatabase>(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options?: CookieOptions) => {
          cookieStore.set({ name, value, ...(options ?? {}) });
        },
        remove: (name: string, options?: CookieOptions) => {
          cookieStore.set({ name, value: '', ...(options ?? {}), maxAge: 0 });
        },
      } as const,
    },
  );
};

let serviceClient: SupabaseClient<SupabaseDatabase> | undefined;

export const createSupabaseServiceRoleClient = (): SupabaseClient<SupabaseDatabase> => {
  if (!serviceClient) {
    serviceClient = createClient<SupabaseDatabase>(
      clientEnv.NEXT_PUBLIC_SUPABASE_URL,
      serverEnv.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }

  return serviceClient;
};
