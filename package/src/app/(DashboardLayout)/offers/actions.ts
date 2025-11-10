'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { and, desc, eq, sql } from 'drizzle-orm';
import { getActiveMembershipOrRedirect } from '@/lib/auth/session';
import { getDbClient } from '@/lib/db/client';
import {
  offers,
  offerVersions,
  offerItems,
  templates,
} from '@/lib/db/schema';
import { logActivity } from '@/lib/services/activity';

const offerItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().nonnegative(),
});

const createOfferSchema = z.object({
  clientId: z.string().uuid(),
  templateId: z.string().uuid(),
  values: z.object({
    title: z.string().min(2),
    summary: z.string().optional(),
    items: z.array(offerItemSchema),
  }),
});

const duplicateVersionSchema = z.object({
  offerId: z.string().uuid(),
});

const updateItemSchema = z.object({
  itemId: z.string().uuid(),
  name: z.string().optional(),
  description: z.string().optional(),
  quantity: z.number().int().positive().optional(),
  unitPrice: z.number().nonnegative().optional(),
});

const publishOfferSchema = z.object({
  offerId: z.string().uuid(),
  isPublished: z.boolean(),
});

export const createOfferFromTemplate = async (input: z.infer<typeof createOfferSchema>) => {
  const { membership, profile } = await getActiveMembershipOrRedirect();
  const db = getDbClient();
  const data = createOfferSchema.parse(input);

  const [template] = await db
    .select({
      title: templates.title,
      content: templates.content,
    })
    .from(templates)
    .where(and(eq(templates.id, data.templateId), eq(templates.organizationId, membership.organization_id)));

  if (!template) {
    throw new Error('Template introuvable.');
  }

  const [createdOffer] = await db
    .insert(offers)
    .values({
      organizationId: membership.organization_id,
      clientId: data.clientId,
      createdByProfileId: profile.id,
      title: data.values.title,
      summary: data.values.summary ?? template.content.slice(0, 280),
      isPublished: false,
    })
    .returning({ id: offers.id });

  const [version] = await db
    .insert(offerVersions)
    .values({
      offerId: createdOffer.id,
      versionNumber: 1,
      title: data.values.title,
      summary: data.values.summary ?? template.content.slice(0, 280),
      createdByProfileId: profile.id,
    })
    .returning({ id: offerVersions.id });

  if (data.values.items.length > 0) {
    await db.insert(offerItems).values(
      data.values.items.map((item) => ({
        offerVersionId: version.id,
        name: item.name,
        description: item.description ?? null,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toFixed(2),
      })),
    );
  }

  await db
    .update(offers)
    .set({ currentVersionId: version.id })
    .where(eq(offers.id, createdOffer.id));

  await logActivity({
    organizationId: membership.organization_id,
    actorProfileId: profile.id,
    action: 'created',
    entityType: 'offer',
    entityId: createdOffer.id,
  });

  revalidatePath('/offers');
  revalidatePath(`/offers/${createdOffer.id}`);

  return { id: createdOffer.id };
};

export const duplicateVersion = async (input: z.infer<typeof duplicateVersionSchema>) => {
  const { membership, profile } = await getActiveMembershipOrRedirect();
  const db = getDbClient();
  const data = duplicateVersionSchema.parse(input);

  const [offer] = await db
    .select({
      id: offers.id,
      currentVersionId: offers.currentVersionId,
    })
    .from(offers)
    .where(and(eq(offers.id, data.offerId), eq(offers.organizationId, membership.organization_id)));

  if (!offer || !offer.currentVersionId) {
    throw new Error('Offre introuvable ou sans version courante.');
  }

  const [currentVersion] = await db
    .select({
      id: offerVersions.id,
      title: offerVersions.title,
      summary: offerVersions.summary,
    })
    .from(offerVersions)
    .where(eq(offerVersions.id, offer.currentVersionId));

  if (!currentVersion) {
    throw new Error('Version courante introuvable.');
  }

  const items = await db
    .select({
      name: offerItems.name,
      description: offerItems.description,
      quantity: offerItems.quantity,
      unitPrice: offerItems.unitPrice,
    })
    .from(offerItems)
    .where(eq(offerItems.offerVersionId, currentVersion.id));

  const [{ value: nextVersion }] = await db
    .select({ value: sql<number>`coalesce(max(${offerVersions.versionNumber}), 0) + 1` })
    .from(offerVersions)
    .where(eq(offerVersions.offerId, data.offerId));

  const [newVersion] = await db
    .insert(offerVersions)
    .values({
      offerId: data.offerId,
      versionNumber: nextVersion,
      title: currentVersion.title,
      summary: currentVersion.summary,
      createdByProfileId: profile.id,
    })
    .returning({ id: offerVersions.id });

  if (items.length > 0) {
    await db.insert(offerItems).values(
      items.map((item) => ({
        offerVersionId: newVersion.id,
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    );
  }

  await db
    .update(offers)
    .set({ currentVersionId: newVersion.id })
    .where(eq(offers.id, data.offerId));

  await logActivity({
    organizationId: membership.organization_id,
    actorProfileId: profile.id,
    action: 'duplicated',
    entityType: 'offer',
    entityId: data.offerId,
  });

  revalidatePath(`/offers/${data.offerId}`);
  return { id: newVersion.id };
};

export const updateItem = async (input: z.infer<typeof updateItemSchema>) => {
  await getActiveMembershipOrRedirect();
  const db = getDbClient();
  const data = updateItemSchema.parse(input);

  const update: Record<string, unknown> = {};
  if (data.name !== undefined) update.name = data.name;
  if (data.description !== undefined) update.description = data.description;
  if (data.quantity !== undefined) update.quantity = data.quantity;
  if (data.unitPrice !== undefined) update.unitPrice = data.unitPrice.toFixed(2);

  if (Object.keys(update).length === 0) return;

  await db.update(offerItems).set(update).where(eq(offerItems.id, data.itemId));

  revalidatePath('/offers');
};

export const publishOffer = async (input: z.infer<typeof publishOfferSchema>) => {
  const { membership, profile } = await getActiveMembershipOrRedirect();
  const db = getDbClient();
  const data = publishOfferSchema.parse(input);

  await db
    .update(offers)
    .set({ isPublished: data.isPublished })
    .where(and(eq(offers.id, data.offerId), eq(offers.organizationId, membership.organization_id)));

  await logActivity({
    organizationId: membership.organization_id,
    actorProfileId: profile.id,
    action: data.isPublished ? 'published' : 'updated',
    entityType: 'offer',
    entityId: data.offerId,
  });

  revalidatePath('/offers');
  revalidatePath(`/offers/${data.offerId}`);
};
