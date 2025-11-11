import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { firstOrNull } from '../guards';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function createServerClient() {
  const cookieStore = await cookies();
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Ignore cookie errors in middleware
        }
      },
    },
  });
}

export async function getSession() {
  const supabase = await createServerClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Session error:', error);
    return null;
  }
  
  return session;
}

export async function getUser() {
  const session = await getSession();
  if (!session?.user) {
    return null;
  }
  
  return session.user;
}

export async function getCurrentOrganizationId(): Promise<string | null> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }
  
  // Get organization from user metadata or session
  // For now, we'll fetch from database in a separate query
  return null;
}
