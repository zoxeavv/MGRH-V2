import { eq } from 'drizzle-orm';

import { db } from '../client';
import { memberships, organizations, profiles } from '../schema';

export const getOrganizationSettings = async (organizationId: string) => {
  const [organization] = await db
    .select({
      id: organizations.id,
      name: organizations.name,
      slug: organizations.slug,
      logoUrl: organizations.logoUrl,
      primaryColor: organizations.primaryColor,
      secondaryColor: organizations.secondaryColor,
    })
    .from(organizations)
    .where(eq(organizations.id, organizationId))
    .execute();

  if (!organization) {
    return null;
  }

  const members = await db
    .select({
      id: memberships.id,
      role: memberships.role,
      status: memberships.status,
      invitedEmail: memberships.invitedEmail,
      createdAt: memberships.createdAt,
      profileId: profiles.id,
      profileName: profiles.fullName,
      profileEmail: profiles.email,
    })
    .from(memberships)
    .leftJoin(profiles, eq(profiles.id, memberships.profileId))
    .where(eq(memberships.organizationId, organizationId))
    .execute();

  return {
    organization,
    members,
  };
};

