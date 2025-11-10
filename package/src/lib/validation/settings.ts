import { z } from 'zod';

export const updateOrganizationSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  logoUrl: z.string().url().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
});

export const inviteMemberSchema = z.object({
  email: z.string().email(),
});

export const updateMemberRoleSchema = z.object({
  membershipId: z.string().uuid(),
  role: z.enum(['owner', 'admin', 'user']),
});

export const disableMemberSchema = z.object({
  membershipId: z.string().uuid(),
});

