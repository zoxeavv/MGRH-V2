'use server';

import { revalidatePath } from 'next/cache';
import { and, desc, eq } from 'drizzle-orm';

import { logActivity } from '@/lib/activity/actions';
import { getActiveMembershipOrRedirect } from '@/lib/auth/session';
import { db } from '@/lib/db/client';
import { offerItems, offerVersions, offers } from '@/lib/db/schema';
import {
  createOfferFromTemplateSchema,
  duplicateVersionSchema,
  publishOfferSchema,
  updateItemSchema,
} from '@/lib/validation/offers';

type ActionResult<T = unknown> = { success: true; data: T } | { success: false; error: string };

export const createOfferFromTemplate = async (rawInput: unknown): Promise<ActionResult<{ id: string }>> => {
  const input = createOfferFromTemplateSchema.safeParse(rawInput);

  if (!input.success) {
    return { success: false, error: input.error.flatten().formErrors.join(', ') };
  }

  const { organization, profile } = await getActiveMembershipOrRedirect();

  const [offer] = await db
    .insert(offers)
    .values({
      organizationId: organization.id,
      clientId: input.data.clientId,
      createdByProfileId: profile.id,
      title: input.data.values.title,
      summary: input.data.values.summary ?? null,
      isPublished: false,
    })
    .returning({ id: offers.id })
    .execute();

  const [version] = await db
    .insert(offerVersions)
    .values({
      offerId: offer.id,
      versionNumber: 1,
      title: input.data.values.title,
      summary: input.data.values.summary ?? null,
      createdByProfileId: profile.id,
    })
    .returning({ id: offerVersions.id })
    .execute();

  await db
    .insert(offerItems)
    .values(
      input.data.values.items.map((item) => ({
        offerVersionId: version.id,
        name: item.name,
        description: item.description ?? null,
        quantity: String(item.quantity),
        unitPrice: String(item.unitPrice),
      })),
    )
    .execute();

  await db
    .update(offers)
    .set({ currentVersionId: version.id })
    .where(eq(offers.id, offer.id))
    .execute();

  await logActivity({
    action: 'created',
    entityType: 'offer',
    entityId: offer.id,
    metadata: { version: 1 },
  });

  revalidatePath('/offers');
  revalidatePath(`/offers/${offer.id}`);

  return { success: true, data: { id: offer.id } };
};

export const duplicateVersion = async (rawInput: unknown): Promise<ActionResult<{ versionId: string }>> => {
  const input = duplicateVersionSchema.safeParse(rawInput);

  if (!input.success) {
    return { success: false, error: input.error.flatten().formErrors.join(', ') };
  }

  const { organization, profile } = await getActiveMembershipOrRedirect();

  const [offer] = await db
    .select({
      id: offers.id,
      organizationId: offers.organizationId,
    })
    .from(offers)
    .where(and(eq(offers.id, input.data.offerId), eq(offers.organizationId, organization.id)))
    .execute();

  if (!offer) {
    return { success: false, error: 'Offer not found' };
  }

  const [latestVersion] = await db
    .select({
      id: offerVersions.id,
      versionNumber: offerVersions.versionNumber,
      title: offerVersions.title,
      summary: offerVersions.summary,
    })
    .from(offerVersions)
    .where(eq(offerVersions.offerId, offer.id))
    .orderBy(desc(offerVersions.versionNumber))
    .limit(1)
    .execute();

  if (!latestVersion) {
    return { success: false, error: 'Offer has no versions to duplicate' };
  }

  const newVersionNumber = latestVersion.versionNumber + 1;

  const [newVersion] = await db
    .insert(offerVersions)
    .values({
      offerId: offer.id,
      versionNumber: newVersionNumber,
      title: latestVersion.title,
      summary: latestVersion.summary,
      createdByProfileId: profile.id,
    })
    .returning({ id: offerVersions.id })
    .execute();

  const items = await db
    .select({
      name: offerItems.name,
      description: offerItems.description,
      quantity: offerItems.quantity,
      unitPrice: offerItems.unitPrice,
    })
    .from(offerItems)
    .where(eq(offerItems.offerVersionId, latestVersion.id))
    .execute();

  if (items.length > 0) {
    await db
      .insert(offerItems)
      .values(
        items.map((item) => ({
          offerVersionId: newVersion.id,
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      )
      .execute();
  }

  await db
    .update(offers)
    .set({ currentVersionId: newVersion.id, updatedAt: new Date() })
    .where(eq(offers.id, offer.id))
    .execute();

  await logActivity({
    action: 'duplicated',
    entityType: 'offer',
    entityId: offer.id,
    metadata: { version: newVersionNumber },
  });

  revalidatePath(`/offers/${offer.id}`);

  return { success: true, data: { versionId: newVersion.id } };
};

export const updateItem = async (rawInput: unknown): Promise<ActionResult> => {
  const input = updateItemSchema.safeParse(rawInput);

  if (!input.success) {
    return { success: false, error: input.error.flatten().formErrors.join(', ') };
  }

  const patch: Record<string, unknown> = {};
  if (input.data.name !== undefined) patch.name = input.data.name;
  if (input.data.description !== undefined) patch.description = input.data.description;
  if (input.data.quantity !== undefined) patch.quantity = String(input.data.quantity);
  if (input.data.unitPrice !== undefined) patch.unitPrice = String(input.data.unitPrice);

  if (Object.keys(patch).length === 0) {
    return { success: false, error: 'No fields to update' };
  }

  await db.update(offerItems).set(patch).where(eq(offerItems.id, input.data.itemId)).execute();

  revalidatePath('/offers');
  revalidatePath(`/offers/${input.data.offerId}`);

  return { success: true, data: { id: input.data.itemId } };
};

export const publishOffer = async (rawInput: unknown): Promise<ActionResult> => {
  const input = publishOfferSchema.safeParse(rawInput);

  if (!input.success) {
    return { success: false, error: input.error.flatten().formErrors.join(', ') };
  }

  await db
    .update(offers)
    .set({ isPublished: input.data.isPublished, updatedAt: new Date() })
    .where(eq(offers.id, input.data.offerId))
    .execute();

  await logActivity({
    action: input.data.isPublished ? 'published' : 'updated',
    entityType: 'offer',
    entityId: input.data.offerId,
  });

  revalidatePath('/offers');
  revalidatePath(`/offers/${input.data.offerId}`);

  return { success: true, data: { id: input.data.offerId } };
};

