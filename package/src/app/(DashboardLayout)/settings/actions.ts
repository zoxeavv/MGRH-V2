'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

import { getActiveMembershipOrRedirect } from '@/lib/auth/session';
import { db } from '@/lib/db/client';
import { memberships, organizations } from '@/lib/db/schema';
import {
  disableMemberSchema,
  inviteMemberSchema,
  updateMemberRoleSchema,
  updateOrganizationSchema,
} from '@/lib/validation/settings';

type ActionResult<T = unknown> = { success: true; data: T } | { success: false; error: string };

const requireAdmin = (role: string) => {
  if (role !== 'owner' && role !== 'admin') {
    throw new Error('Only owners and admins may manage organization settings.');
  }
};

export const updateOrgProfile = async (rawInput: unknown): Promise<ActionResult> => {
  const input = updateOrganizationSchema.safeParse(rawInput);

  if (!input.success) {
    return { success: false, error: input.error.flatten().formErrors.join(', ') };
  }

  const context = await getActiveMembershipOrRedirect();
  requireAdmin(context.membership.role);

  await db
    .update(organizations)
    .set({
      name: input.data.name,
      slug: input.data.slug,
      logoUrl: input.data.logoUrl ?? null,
      primaryColor: input.data.primaryColor ?? null,
      secondaryColor: input.data.secondaryColor ?? null,
      updatedAt: new Date(),
    })
    .where(eq(organizations.id, context.organization.id))
    .execute();

  revalidatePath('/settings');

  return { success: true, data: { id: context.organization.id } };
};

export const inviteMember = async (rawInput: unknown): Promise<ActionResult> => {
  const input = inviteMemberSchema.safeParse(rawInput);

  if (!input.success) {
    return { success: false, error: input.error.flatten().formErrors.join(', ') };
  }

  const context = await getActiveMembershipOrRedirect();
  requireAdmin(context.membership.role);

  await db
    .insert(memberships)
    .values({
      organizationId: context.organization.id,
      role: 'user',
      status: 'pending',
      invitedEmail: input.data.email,
    })
    .execute();

  revalidatePath('/settings');

  return { success: true, data: { email: input.data.email } };
};

export const updateMemberRole = async (rawInput: unknown): Promise<ActionResult> => {
  const input = updateMemberRoleSchema.safeParse(rawInput);

  if (!input.success) {
    return { success: false, error: input.error.flatten().formErrors.join(', ') };
  }

  const context = await getActiveMembershipOrRedirect();
  requireAdmin(context.membership.role);

  await db
    .update(memberships)
    .set({
      role: input.data.role,
      updatedAt: new Date(),
    })
    .where(eq(memberships.id, input.data.membershipId))
    .execute();

  revalidatePath('/settings');

  return { success: true, data: { id: input.data.membershipId } };
};

export const disableMember = async (rawInput: unknown): Promise<ActionResult> => {
  const input = disableMemberSchema.safeParse(rawInput);

  if (!input.success) {
    return { success: false, error: input.error.flatten().formErrors.join(', ') };
  }

  const context = await getActiveMembershipOrRedirect();
  requireAdmin(context.membership.role);

  await db
    .update(memberships)
    .set({
      status: 'disabled',
      updatedAt: new Date(),
    })
    .where(eq(memberships.id, input.data.membershipId))
    .execute();

  revalidatePath('/settings');

  return { success: true, data: { id: input.data.membershipId } };
};

