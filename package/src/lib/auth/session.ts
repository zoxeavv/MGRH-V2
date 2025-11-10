import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { createSupabaseServerClient, createSupabaseServiceRoleClient } from '../supabase/server';

const ACTIVE_ORGANIZATION_COOKIE = 'sb-active-organization-id';

type OrganizationLite = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
};

type MembershipRow = {
  id: string;
  organization_id: string;
  profile_id: string;
  role: 'owner' | 'admin' | 'user';
  status: 'active' | 'pending' | 'disabled';
  organization: OrganizationLite;
};

export const getUserOrRedirect = cache(async () => {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/authentication/login');
  }

  return user;
});

export const getActiveMembershipOrRedirect = cache(async () => {
  const user = await getUserOrRedirect();
  const supabase = createSupabaseServerClient();
  const cookieStore = cookies();

  const {
    data: profileData,
    error: profileError,
  } = await supabase
    .from('profiles')
    .select('id, email, full_name, avatar_url')
    .eq('user_id', user.id)
    .maybeSingle();

  if (profileError) {
    throw profileError;
  }

  let profile = profileData;

  if (!profile) {
    const serviceClient = createSupabaseServiceRoleClient();
    await serviceClient.from('profiles').insert({
      user_id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name ?? null,
      avatar_url: user.user_metadata?.avatar_url ?? null,
    });

    const { data: newProfile, error: newProfileError } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url')
      .eq('user_id', user.id)
      .maybeSingle();

    if (newProfileError || !newProfile) {
      redirect('/authentication/register');
    }

    profile = newProfile;
  }

  const preferredOrgId = cookieStore.get(ACTIVE_ORGANIZATION_COOKIE)?.value;

  let query = supabase
    .from('memberships')
    .select(
      `
        id,
        organization_id,
        profile_id,
        role,
        status,
        organization:organizations!inner (
          id,
          name,
          slug,
          logo_url,
          primary_color,
          secondary_color
        )
      `,
    )
    .eq('profile_id', profile.id)
    .eq('status', 'active')
    .limit(1);

  if (preferredOrgId) {
    query = query.eq('organization_id', preferredOrgId);
  }

  const { data: memberships, error: membershipError } = await query;

  if (membershipError) {
    throw membershipError;
  }

  const membership = memberships?.[0] as MembershipRow | undefined;

  if (!membership) {
    redirect('/authentication/login?reason=no-organization');
  }

  return {
    user,
    profile,
    membership,
    organization: membership.organization,
  };
});

export type ActiveMembershipContext = Awaited<ReturnType<typeof getActiveMembershipOrRedirect>>;

