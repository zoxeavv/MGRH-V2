'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { getActiveMembershipOrRedirect } from '@/lib/auth/session';
import { getDbClient } from '@/lib/db/client';
import { memberships, organizations, profiles } from '@/lib/db/schema';
import { logActivity } from '@/lib/services/activity';

const updateOrgSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  logoUrl: z.string().url().optional(),
});

const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(['owner', 'admin', 'user']).default('user'),
});

const updateMemberRoleSchema = z.object({
  membershipId: z.string().uuid(),
  role: z.enum(['owner', 'admin', 'user']),
});

const disableMemberSchema = z.object({
  membershipId: z.string().uuid(),
});

export const updateOrgProfile = async (input: z.infer<typeof updateOrgSchema>) => {
  const { membership, profile } = await getActiveMembershipOrRedirect();
  if (membership.role === 'user') {
    throw new Error('Seuls les administrateurs peuvent modifier les informations de l’organisation.');
  }

  const db = getDbClient();
  const data = updateOrgSchema.parse(input);

  await db
    .update(organizations)
    .set({
      name: data.name,
      slug: data.slug,
      logoUrl: data.logoUrl ?? null,
      updatedAt: new Date(),
    })
    .where(eq(organizations.id, membership.organization_id));

  await logActivity({
    organizationId: membership.organization_id,
    actorProfileId: profile.id,
    action: 'updated',
    entityType: 'organization',
    entityId: membership.organization_id,
  });

  revalidatePath('/settings');
};

export const inviteMember = async (input: z.infer<typeof inviteMemberSchema>) => {
  const { membership, profile } = await getActiveMembershipOrRedirect();
  if (membership.role === 'user') {
    throw new Error('Seuls les administrateurs peuvent inviter des membres.');
  }

  const db = getDbClient();
  const data = inviteMemberSchema.parse(input);

  const [existingProfile] = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.email, data.email));

  if (!existingProfile) {
    throw new Error("Ce profil n'existe pas encore. Créez-le avant d'envoyer une invitation.");
  }

  const [invited] = await db
    .insert(memberships)
    .values({
      organizationId: membership.organization_id,
      profileId: existingProfile.id,
      role: data.role,
      status: 'pending',
      invitedEmail: data.email,
    })
    .onConflictDoNothing()
    .returning({ id: memberships.id });

  await logActivity({
    organizationId: membership.organization_id,
    actorProfileId: profile.id,
    action: 'invited',
    entityType: 'membership',
    entityId: invited?.id ?? data.email,
    metadata: { email: data.email },
  });

  revalidatePath('/settings');
};

export const updateMemberRole = async (input: z.infer<typeof updateMemberRoleSchema>) => {
  const { membership, profile } = await getActiveMembershipOrRedirect();
  if (membership.role === 'user') {
    throw new Error('Seuls les administrateurs peuvent modifier les rôles.');
  }

  const db = getDbClient();
  const data = updateMemberRoleSchema.parse(input);

  await db
    .update(memberships)
    .set({ role: data.role })
    .where(eq(memberships.id, data.membershipId));

  await logActivity({
    organizationId: membership.organization_id,
    actorProfileId: profile.id,
    action: 'updated',
    entityType: 'membership',
    entityId: data.membershipId,
    metadata: { role: data.role },
  });

  revalidatePath('/settings');
};

export const disableMember = async (input: z.infer<typeof disableMemberSchema>) => {
  const { membership, profile } = await getActiveMembershipOrRedirect();
  if (membership.role === 'user') {
    throw new Error('Seuls les administrateurs peuvent désactiver des membres.');
  }

  const db = getDbClient();
  const data = disableMemberSchema.parse(input);

  await db
    .update(memberships)
    .set({ status: 'disabled' })
    .where(eq(memberships.id, data.membershipId));

  await logActivity({
    organizationId: membership.organization_id,
    actorProfileId: profile.id,
    action: 'deleted',
    entityType: 'membership',
    entityId: data.membershipId,
  });

  revalidatePath('/settings');
};
