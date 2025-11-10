'use server';

import { redirect } from 'next/navigation';

import { createSupabaseServerClient } from '../supabase/server';

export const signOut = async () => {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/authentication/login');
};

