import { and, desc, eq } from 'drizzle-orm';
import { getDbClient } from '@/lib/db/client';
import { offers, clients, offerVersions, offerItems, templates } from '@/lib/db/schema';

export const listOffers = async (organizationId: string) => {
  const db = getDbClient();
  return db
    .select({
      id: offers.id,
      title: offers.title,
      isPublished: offers.isPublished,
      createdAt: offers.createdAt,
      updatedAt: offers.updatedAt,
      clientName: clients.name,
    })
    .from(offers)
    .leftJoin(clients, eq(offers.clientId, clients.id))
    .where(eq(offers.organizationId, organizationId))
    .orderBy(desc(offers.updatedAt));
};

export const listClientsForOrganization = async (organizationId: string) => {
  const db = getDbClient();
  return db
    .select({
      id: clients.id,
      name: clients.name,
    })
    .from(clients)
    .where(eq(clients.organizationId, organizationId))
    .orderBy(clients.name);
};

export const listTemplatesForOrganization = async (organizationId: string) => {
  const db = getDbClient();
  return db
    .select({
      id: templates.id,
      title: templates.title,
      category: templates.category,
      content: templates.content,
      isDraft: templates.isDraft,
    })
    .from(templates)
    .where(eq(templates.organizationId, organizationId))
    .orderBy(desc(templates.updatedAt));
};

export const getOfferDetail = async (organizationId: string, offerId: string) => {
  const db = getDbClient();

  const [offer] = await db
    .select({
      id: offers.id,
      title: offers.title,
      summary: offers.summary,
      isPublished: offers.isPublished,
      currentVersionId: offers.currentVersionId,
      createdAt: offers.createdAt,
      updatedAt: offers.updatedAt,
      clientId: offers.clientId,
      clientName: clients.name,
    })
    .from(offers)
    .leftJoin(clients, eq(offers.clientId, clients.id))
    .where(and(eq(offers.organizationId, organizationId), eq(offers.id, offerId)));

  return offer ?? null;
};

export const listOfferVersions = async (offerId: string) => {
  const db = getDbClient();
  return db
    .select({
      id: offerVersions.id,
      versionNumber: offerVersions.versionNumber,
      title: offerVersions.title,
      summary: offerVersions.summary,
      createdAt: offerVersions.createdAt,
    })
    .from(offerVersions)
    .where(eq(offerVersions.offerId, offerId))
    .orderBy(desc(offerVersions.versionNumber));
};

export const listOfferItemsByVersion = async (offerVersionId: string) => {
  const db = getDbClient();
  return db
    .select({
      id: offerItems.id,
      name: offerItems.name,
      description: offerItems.description,
      quantity: offerItems.quantity,
      unitPrice: offerItems.unitPrice,
    })
    .from(offerItems)
    .where(eq(offerItems.offerVersionId, offerVersionId))
    .orderBy(offerItems.createdAt);
};
