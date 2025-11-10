import { eq } from 'drizzle-orm';
import { getDbClient } from '@/lib/db/client';
import { organizations, memberships, profiles } from '@/lib/db/schema';

export const getOrganizationProfile = async (organizationId: string) => {
  const db = getDbClient();
  const [organization] = await db
    .select({
      id: organizations.id,
      name: organizations.name,
      slug: organizations.slug,
      logoUrl: organizations.logoUrl,
    })
    .from(organizations)
    .where(eq(organizations.id, organizationId));
  return organization ?? null;
};

export const listOrganizationMembers = async (organizationId: string) => {
  const db = getDbClient();
  return db
    .select({
      id: memberships.id,
      role: memberships.role,
      status: memberships.status,
      invitedEmail: memberships.invitedEmail,
      profileId: memberships.profileId,
      profileName: profiles.fullName,
      profileEmail: profiles.email,
      avatarUrl: profiles.avatarUrl,
    })
    .from(memberships)
    .leftJoin(profiles, eq(memberships.profileId, profiles.id))
    .where(eq(memberships.organizationId, organizationId));
};
