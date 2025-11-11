'use server';

import { db } from '@/lib/db';
import { offers } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { firstOrError, normalizeArray, normalizeString, normalizeNumber } from '@/lib/guards';
import { withServerActionLogging } from '@/lib/logger';
import { revalidatePath } from 'next/cache';

export interface OfferItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface CreateOfferInput {
  organizationId: string;
  clientId: string;
  templateId?: string | undefined;
  title: string;
  items: OfferItem[];
  subtotal: number;
  taxRate: number;
  total: number;
  validUntil?: Date | undefined;
  createdById: string;
}

export const createOffer = withServerActionLogging(
  'createOffer',
  async (input: CreateOfferInput) => {
    const normalizedItems = normalizeArray(input.items).map((item) => ({
      id: normalizeString(item.id),
      name: normalizeString(item.name),
      description: normalizeString(item.description || ''),
      quantity: normalizeNumber(item.quantity),
      unitPrice: normalizeNumber(item.unitPrice),
    }));

    const result = await db
      .insert(offers)
      .values({
        organizationId: input.organizationId,
        clientId: input.clientId,
        templateId: input.templateId || null,
        title: normalizeString(input.title),
        status: 'draft',
        items: normalizedItems,
        subtotal: input.subtotal.toString(),
        taxRate: input.taxRate.toString(),
        total: input.total.toString(),
        validUntil: input.validUntil || null,
        createdById: input.createdById,
      })
      .returning();

    const offer = firstOrError(result);
    revalidatePath('/offers');
    revalidatePath(`/offers/${offer.id}`);
    return offer;
  }
);

interface UpdateOfferInput {
  id: string;
  organizationId: string;
  title?: string;
  items?: OfferItem[];
  subtotal?: number;
  taxRate?: number;
  total?: number;
  status?: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validUntil?: Date;
}

export const updateOffer = withServerActionLogging(
  'updateOffer',
  async (input: UpdateOfferInput) => {
    const updateData: Partial<typeof offers.$inferInsert> = {};

    if (input.title !== undefined) updateData.title = normalizeString(input.title);
    if (input.items !== undefined) {
      updateData.items = normalizeArray(input.items).map((item) => ({
        id: normalizeString(item.id),
        name: normalizeString(item.name),
        description: normalizeString(item.description || ''),
        quantity: normalizeNumber(item.quantity),
        unitPrice: normalizeNumber(item.unitPrice),
      }));
    }
    if (input.subtotal !== undefined) updateData.subtotal = input.subtotal.toString();
    if (input.taxRate !== undefined) updateData.taxRate = input.taxRate.toString();
    if (input.total !== undefined) updateData.total = input.total.toString();
    if (input.status !== undefined) updateData.status = input.status;
    if (input.validUntil !== undefined) updateData.validUntil = input.validUntil;

    const result = await db
      .update(offers)
      .set(updateData)
      .where(and(eq(offers.id, input.id), eq(offers.organizationId, input.organizationId)))
      .returning();

    const offer = firstOrError(result);
    revalidatePath('/offers');
    revalidatePath(`/offers/${offer.id}`);
    return offer;
  }
);

export const sendOffer = withServerActionLogging(
  'sendOffer',
  async (offerId: string, organizationId: string) => {
    const result = await db
      .update(offers)
      .set({
        status: 'sent',
        sentAt: new Date(),
      })
      .where(and(eq(offers.id, offerId), eq(offers.organizationId, organizationId)))
      .returning();

    const offer = firstOrError(result);
    revalidatePath('/offers');
    revalidatePath(`/offers/${offer.id}`);
    return offer;
  }
);

export const deleteOffer = withServerActionLogging(
  'deleteOffer',
  async (offerId: string, organizationId: string) => {
    await db
      .delete(offers)
      .where(and(eq(offers.id, offerId), eq(offers.organizationId, organizationId)));

    revalidatePath('/offers');
  }
);
