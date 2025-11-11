'use server';

import type { Session, User } from '@supabase/supabase-js';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export type OrganizationRole = 'owner' | 'member';

export type OrganizationSummary = {
  id: string;
  name: string;
  slug?: string | null;
  role: OrganizationRole;
};

export type SessionSummary = {
  session: Session;
  user: User;
};

export async function getSession(): Promise<SessionSummary | null> {
  const supabase = createSupabaseServerClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  if (!session || !session.user) {
    return null;
  }

  return {
    session,
    user: session.user,
  };
}

export async function requireSession(): Promise<SessionSummary> {
  const summary = await getSession();
  if (!summary) {
    throw new Error('Authentication required.');
  }
  return summary;
}

export async function getActiveOrganization(): Promise<OrganizationSummary | null> {
  const supabase = createSupabaseServerClient();

  const response = await supabase
    .from('organizations')
    .select('id, name')
    .limit(1)
    .maybeSingle();

  const organization = unwrapMaybeSingle(response);
  if (!organization) {
    return null;
  }

  return {
    id: organization.id,
    name: organization.name,
    role: 'owner',
  };
}

export function unwrapMaybeSingle<T>(
  response: PostgrestSingleResponse<T>
): T | null {
  if (response.error) {
    // Propagate the error unless this is the expected "no rows" scenario.
    if (response.error.code === 'PGRST116') {
      throw response.error;
    }
    if (response.error.code !== 'PGRST108') {
      throw response.error;
    }
  }

  if (!response.data) {
    return null;
  }

  return response.data;
}
