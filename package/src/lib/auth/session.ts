import type { User } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export type ProfileRow = {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type MembershipRow = {
  id: string;
  organization_id: string;
  profile_id: string;
  role: 'owner' | 'admin' | 'user';
  status: 'active' | 'pending' | 'disabled';
  invited_email: string | null;
  created_at: string;
  updated_at: string;
  organization?: {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
  };
};

export type AuthContext = {
  supabase: ReturnType<typeof createSupabaseServerClient>;
  user: User;
  profile: ProfileRow;
};

export const getUserOrRedirect = async (): Promise<AuthContext> => {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/authentication/login');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle<ProfileRow>();

  if (profileError || !profile) {
    redirect('/authentication/login');
  }

  return { supabase, user, profile };
};

export const getActiveMembershipOrRedirect = async () => {
  const { supabase, user, profile } = await getUserOrRedirect();

  const { data: membership, error } = await supabase
    .from('memberships')
    .select(
      `
        *,
        organization:organizations (
          id,
          name,
          slug,
          logo_url
        )
      `,
    )
    .eq('profile_id', profile.id)
    .eq('status', 'active')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle<MembershipRow>();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  if (!membership || !membership.organization) {
    redirect('/settings?missing_org=1');
  }

  return { supabase, user, profile, membership };
};
