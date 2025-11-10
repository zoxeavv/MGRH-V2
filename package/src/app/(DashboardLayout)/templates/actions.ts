'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { getActiveMembershipOrRedirect } from '@/lib/auth/session';
import { getDbClient } from '@/lib/db/client';
import { templates, templateAssets } from '@/lib/db/schema';
import { logActivity } from '@/lib/services/activity';

const baseTemplateSchema = z.object({
  title: z.string().min(2),
  category: z.string().optional(),
  content: z.string().min(1),
  tags: z.array(z.string().trim()).optional(),
  previewImageUrl: z.string().url().optional(),
  isDraft: z.boolean().optional(),
});

const createTemplateSchema = baseTemplateSchema;

const updateTemplateSchema = baseTemplateSchema.extend({
  id: z.string().uuid(),
});

const attachAssetSchema = z.object({
  templateId: z.string().uuid(),
  url: z.string().url(),
  type: z.string().min(1),
});

const publishTemplateSchema = z.object({
  id: z.string().uuid(),
  isDraft: z.boolean(),
});

export const saveTemplateDraft = async (input: z.infer<typeof createTemplateSchema> & { id?: string }) => {
  const { membership, profile } = await getActiveMembershipOrRedirect();
  const db = getDbClient();

  if (input.id) {
    const data = updateTemplateSchema.parse(input);
    await db
      .update(templates)
      .set({
        title: data.title,
        category: data.category ?? null,
        content: data.content,
        isDraft: data.isDraft ?? true,
        metadata: { tags: data.tags ?? [] },
        previewImageUrl: data.previewImageUrl ?? null,
        updatedAt: new Date(),
      })
      .where(eq(templates.id, data.id));

    await logActivity({
      organizationId: membership.organization_id,
      actorProfileId: profile.id,
      action: 'updated',
      entityType: 'template',
      entityId: data.id,
      metadata: { title: data.title },
    });

    revalidatePath('/templates');
    revalidatePath(`/templates/${data.id}/edit`);
    return { id: data.id };
  }

  const data = createTemplateSchema.parse(input);

  const [created] = await db
    .insert(templates)
    .values({
      organizationId: membership.organization_id,
      createdByProfileId: profile.id,
      title: data.title,
      category: data.category ?? null,
      content: data.content,
      isDraft: data.isDraft ?? true,
      metadata: { tags: data.tags ?? [] },
      previewImageUrl: data.previewImageUrl ?? null,
    })
    .returning({ id: templates.id });

  await logActivity({
    organizationId: membership.organization_id,
    actorProfileId: profile.id,
    action: 'created',
    entityType: 'template',
    entityId: created.id,
    metadata: { title: data.title },
  });

  revalidatePath('/templates');
  revalidatePath(`/templates/${created.id}/edit`);

  return created;
};

export const attachAsset = async (input: z.infer<typeof attachAssetSchema>) => {
  const { membership, profile } = await getActiveMembershipOrRedirect();
  const db = getDbClient();
  const data = attachAssetSchema.parse(input);

  const [created] = await db
    .insert(templateAssets)
    .values({
      templateId: data.templateId,
      url: data.url,
      type: data.type,
    })
    .returning({ id: templateAssets.id });

  await logActivity({
    organizationId: membership.organization_id,
    actorProfileId: profile.id,
    action: 'updated',
    entityType: 'template',
    entityId: data.templateId,
    metadata: { assetId: created.id },
  });

  revalidatePath(`/templates/${data.templateId}/edit`);
  return created;
};

export const publishTemplate = async (input: z.infer<typeof publishTemplateSchema>) => {
  const { membership, profile } = await getActiveMembershipOrRedirect();
  const db = getDbClient();
  const data = publishTemplateSchema.parse(input);

  await db
    .update(templates)
    .set({ isDraft: data.isDraft })
    .where(eq(templates.id, data.id));

  await logActivity({
    organizationId: membership.organization_id,
    actorProfileId: profile.id,
    action: data.isDraft ? 'updated' : 'published',
    entityType: 'template',
    entityId: data.id,
  });

  revalidatePath('/templates');
  revalidatePath(`/templates/${data.id}/edit`);
};
