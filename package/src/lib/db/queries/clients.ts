import { db } from '../index';
import { clients } from '../schema';
import { eq, and, ilike, or, inArray } from 'drizzle-orm';
import { normalizeArray, firstOrNull, firstOrError } from '../../guards';

export async function getClientsByOrganizationId(organizationId: string) {
  const result = await db
    .select()
    .from(clients)
    .where(eq(clients.organizationId, organizationId));
  
  return normalizeArray(result);
}

export async function getClientById(clientId: string, organizationId: string) {
  const result = await db
    .select()
    .from(clients)
    .where(and(eq(clients.id, clientId), eq(clients.organizationId, organizationId)))
    .limit(1);
  
  return firstOrNull(result);
}

export async function searchClients(
  organizationId: string,
  search?: string,
  status?: string[],
  ownerId?: string,
  tags?: string[]
) {
  const conditions = [eq(clients.organizationId, organizationId)];

  if (search) {
    conditions.push(
      or(
        ilike(clients.name, `%${search}%`),
        ilike(clients.email, `%${search}%`),
        ilike(clients.company, `%${search}%`)
      )!
    );
  }

  if (status && status.length > 0) {
    conditions.push(inArray(clients.status, status as any));
  }

  if (ownerId) {
    conditions.push(eq(clients.ownerId, ownerId));
  }

  if (tags && tags.length > 0) {
    // For JSONB array search, we'd need a more complex query
    // This is a simplified version
  }

  const result = await db
    .select()
    .from(clients)
    .where(and(...conditions));

  return normalizeArray(result);
}
