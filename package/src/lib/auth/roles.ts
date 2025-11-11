import { getOrganizationByUserId, getUserOrganizations } from '@/lib/db/queries/organizations';
import { normalizeArray } from '@/lib/guards';

export type UserRole = 'owner' | 'member';

export interface OrganizationWithRole {
  id: string;
  name: string;
  role: UserRole;
}

export async function getCurrentUserRole(
  userId: string,
  organizationId: string
): Promise<UserRole | null> {
  const orgData = await getOrganizationByUserId(userId);
  
  if (!orgData || orgData.organization.id !== organizationId) {
    return null;
  }
  
  return orgData.role as UserRole;
}

export async function getUserOrganizationsWithRole(
  userId: string
): Promise<OrganizationWithRole[]> {
  const orgs = await getUserOrganizations(userId);
  return normalizeArray(orgs).map((org) => ({
    id: org.organization.id,
    name: org.organization.name,
    role: org.role as UserRole,
  }));
}

export function assertRole(
  userRole: UserRole | null,
  requiredRoles: UserRole[]
): void {
  if (!userRole) {
    throw new Error('User is not a member of this organization');
  }
  
  if (!requiredRoles.includes(userRole)) {
    throw new Error(`Access denied. Required role: ${requiredRoles.join(' or ')}`);
  }
}

export function hasRole(
  userRole: UserRole | null,
  requiredRoles: UserRole[]
): boolean {
  if (!userRole) {
    return false;
  }
  
  return requiredRoles.includes(userRole);
}
