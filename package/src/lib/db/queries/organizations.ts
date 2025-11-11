import { db } from '../index';
import { organizationMembers, organizations, users } from '../schema';
import { eq, and } from 'drizzle-orm';
import { firstOrNull, normalizeArray } from '../../guards';

export async function getOrganizationByUserId(userId: string) {
  const result = await db
    .select({
      organization: organizations,
      role: organizationMembers.role,
    })
    .from(organizationMembers)
    .innerJoin(organizations, eq(organizationMembers.organizationId, organizations.id))
    .where(eq(organizationMembers.userId, userId))
    .limit(1);
  
  return firstOrNull(result);
}

export async function getOrganizationById(orgId: string) {
  const result = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, orgId))
    .limit(1);
  
  return firstOrNull(result);
}

export async function getUserOrganizations(userId: string) {
  const result = await db
    .select({
      organization: organizations,
      role: organizationMembers.role,
    })
    .from(organizationMembers)
    .innerJoin(organizations, eq(organizationMembers.organizationId, organizations.id))
    .where(eq(organizationMembers.userId, userId));
  
  return normalizeArray(result);
}
