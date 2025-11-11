import { db } from '../index';
import { offers } from '../schema';
import { eq, and } from 'drizzle-orm';
import { normalizeArray, firstOrNull } from '../../guards';

export async function getOffersByOrganizationId(organizationId: string) {
  const result = await db
    .select()
    .from(offers)
    .where(eq(offers.organizationId, organizationId));
  
  return normalizeArray(result);
}

export async function getOfferById(offerId: string, organizationId: string) {
  const result = await db
    .select()
    .from(offers)
    .where(and(eq(offers.id, offerId), eq(offers.organizationId, organizationId)))
    .limit(1);
  
  return firstOrNull(result);
}

export async function getOffersByClientId(clientId: string, organizationId: string) {
  const result = await db
    .select()
    .from(offers)
    .where(
      and(
        eq(offers.clientId, clientId),
        eq(offers.organizationId, organizationId)
      )
    );
  
  return normalizeArray(result);
}
