"use server";

import { db } from "@/lib/db";
import { offers } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { firstOrError, normalizeArray, normalizeString } from "@/lib/guards";
import { withServerActionLogging } from "@/lib/logger";
import type { Offer, NewOffer } from "@/lib/db/schema";

export async function getOffers(organizationId: string) {
  const rows = await db
    .select()
    .from(offers)
    .where(eq(offers.organizationId, organizationId))
    .orderBy(offers.createdAt);

  return rows;
}

export async function getOfferById(offerId: string, organizationId: string) {
  const rows = await db
    .select()
    .from(offers)
    .where(and(eq(offers.id, offerId), eq(offers.organizationId, organizationId)))
    .limit(1);

  return rows[0] ?? null;
}

export async function createOffer(
  organizationId: string,
  data: Omit<NewOffer, "organizationId" | "createdAt" | "updatedAt" | "createdById">
) {
  return withServerActionLogging("createOffer", async () => {
    const normalizedData: NewOffer = {
      organizationId,
      clientId: data.clientId,
      title: normalizeString(data.title),
      status: data.status ?? "draft",
      items: normalizeArray(data.items),
      subtotal: normalizeString(data.subtotal ?? "0"),
      tax: normalizeString(data.tax ?? "0"),
      total: normalizeString(data.total ?? "0"),
      currency: normalizeString(data.currency ?? "USD"),
      validUntil: data.validUntil ?? undefined,
      sentAt: data.sentAt ?? undefined,
      acceptedAt: data.acceptedAt ?? undefined,
      metadata: data.metadata ?? {},
      createdById: data.createdById,
    };

    const rows = await db.insert(offers).values(normalizedData).returning();
    return firstOrError(rows);
  })();
}

export async function updateOffer(
  offerId: string,
  organizationId: string,
  data: Partial<Omit<NewOffer, "organizationId" | "id" | "createdAt" | "updatedAt" | "createdById">>
) {
  return withServerActionLogging("updateOffer", async () => {
    const normalizedData: Partial<NewOffer> = {};
    if (data.title !== undefined) normalizedData.title = normalizeString(data.title);
    if (data.status !== undefined) normalizedData.status = data.status;
    if (data.items !== undefined) normalizedData.items = normalizeArray(data.items);
    if (data.subtotal !== undefined) normalizedData.subtotal = normalizeString(data.subtotal);
    if (data.tax !== undefined) normalizedData.tax = normalizeString(data.tax);
    if (data.total !== undefined) normalizedData.total = normalizeString(data.total);
    if (data.currency !== undefined) normalizedData.currency = normalizeString(data.currency);
    if (data.validUntil !== undefined) normalizedData.validUntil = data.validUntil;
    if (data.sentAt !== undefined) normalizedData.sentAt = data.sentAt;
    if (data.acceptedAt !== undefined) normalizedData.acceptedAt = data.acceptedAt;
    if (data.metadata !== undefined) normalizedData.metadata = data.metadata;

    normalizedData.updatedAt = new Date();

    const rows = await db
      .update(offers)
      .set(normalizedData)
      .where(and(eq(offers.id, offerId), eq(offers.organizationId, organizationId)))
      .returning();

    return firstOrError(rows);
  })();
}

export async function deleteOffer(offerId: string, organizationId: string) {
  return withServerActionLogging("deleteOffer", async () => {
    await db
      .delete(offers)
      .where(and(eq(offers.id, offerId), eq(offers.organizationId, organizationId)));
  })();
}
