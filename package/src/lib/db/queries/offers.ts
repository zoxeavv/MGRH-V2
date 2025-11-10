import { and, desc, eq, sql } from 'drizzle-orm';

import { db } from '../client';
import {
  clients,
  offerItems,
  offerVersions,
  offers,
  profiles,
} from '../schema';

export type OfferListItem = {
  id: string;
  title: string;
  summary: string | null;
  isPublished: boolean;
  clientName: string;
  organizationId: string;
  updatedAt: Date;
};

export const listOffers = async (organizationId: string) => {
  const rows = await db
    .select({
      id: offers.id,
      title: offers.title,
      summary: offers.summary,
      isPublished: offers.isPublished,
      updatedAt: offers.updatedAt,
      clientName: clients.name,
    })
    .from(offers)
    .leftJoin(clients, eq(clients.id, offers.clientId))
    .where(eq(offers.organizationId, organizationId))
    .orderBy(desc(offers.updatedAt))
    .execute();

  return rows;
};

export const getOfferDetail = async (organizationId: string, offerId: string) => {
  const [offer] = await db
    .select({
      id: offers.id,
      title: offers.title,
      summary: offers.summary,
      isPublished: offers.isPublished,
      currentVersionId: offers.currentVersionId,
      createdAt: offers.createdAt,
      updatedAt: offers.updatedAt,
      client: {
        id: clients.id,
        name: clients.name,
      },
      creator: {
        id: profiles.id,
        fullName: profiles.fullName,
        email: profiles.email,
      },
    })
    .from(offers)
    .leftJoin(clients, eq(clients.id, offers.clientId))
    .leftJoin(profiles, eq(profiles.id, offers.createdByProfileId))
    .where(and(eq(offers.organizationId, organizationId), eq(offers.id, offerId)))
    .execute();

  if (!offer) {
    return null;
  }

  const versions = await db
    .select({
      id: offerVersions.id,
      versionNumber: offerVersions.versionNumber,
      title: offerVersions.title,
      summary: offerVersions.summary,
      createdAt: offerVersions.createdAt,
    })
    .from(offerVersions)
    .where(eq(offerVersions.offerId, offer.id))
    .orderBy(desc(offerVersions.versionNumber))
    .execute();

  const currentVersionId = offer.currentVersionId ?? versions[0]?.id;

  const items = await db
    .select({
      id: offerItems.id,
      name: offerItems.name,
      description: offerItems.description,
      quantity: offerItems.quantity,
      unitPrice: offerItems.unitPrice,
    })
    .from(offerItems)
    .where(eq(offerItems.offerVersionId, currentVersionId!))
    .orderBy(desc(offerItems.createdAt))
    .execute();

  const total = await db
    .select({
      amount: sql<number>`
        coalesce(
          sum(
            (offer_items.quantity::numeric) * (offer_items.unit_price::numeric)
          ),
          0
        )
      `,
    })
    .from(offerItems)
    .where(eq(offerItems.offerVersionId, currentVersionId!))
    .execute();

  return {
    offer,
    versions,
    currentVersionId,
    items,
    total: Number(total[0]?.amount ?? 0),
  };
};

