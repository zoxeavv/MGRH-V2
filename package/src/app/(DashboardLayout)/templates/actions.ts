'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

import { logActivity } from '@/lib/activity/actions';
import { getActiveMembershipOrRedirect } from '@/lib/auth/session';
import { db } from '@/lib/db/client';
import { templateAssets, templates } from '@/lib/db/schema';
import {
  attachAssetSchema,
  publishTemplateSchema,
  templateFormSchema,
} from '@/lib/validation/templates';

type ActionResult<T = unknown> = { success: true; data: T } | { success: false; error: string };

export const saveTemplateDraft = async (rawInput: unknown): Promise<ActionResult<{ id: string }>> => {
  const input = templateFormSchema.safeParse(rawInput);

  if (!input.success) {
    return { success: false, error: input.error.flatten().formErrors.join(', ') };
  }

  const { organization, profile } = await getActiveMembershipOrRedirect();

  const metadata = {
    tags: input.data.tags ?? [],
  };

  if (input.data.id) {
    await db
      .update(templates)
      .set({
        title: input.data.title,
        category: input.data.category,
        content: input.data.content,
        isDraft: input.data.isDraft ?? true,
        previewImageUrl: input.data.previewImageUrl ?? null,
        metadata,
        updatedAt: new Date(),
      })
      .where(eq(templates.id, input.data.id))
      .execute();

    await logActivity({
      action: 'updated',
      entityType: 'template',
      entityId: input.data.id,
      metadata: { title: input.data.title },
    });

    revalidatePath('/templates');
    revalidatePath(`/templates/${input.data.id}/edit`);

    return { success: true, data: { id: input.data.id } };
  }

  const [createdTemplate] = await db
    .insert(templates)
    .values({
      organizationId: organization.id,
      createdByProfileId: profile.id,
      title: input.data.title,
      category: input.data.category,
      content: input.data.content,
      isDraft: input.data.isDraft ?? true,
      previewImageUrl: input.data.previewImageUrl ?? null,
      metadata,
    })
    .returning({ id: templates.id })
    .execute();

  await logActivity({
    action: 'created',
    entityType: 'template',
    entityId: createdTemplate.id,
    metadata: { title: input.data.title },
  });

  revalidatePath('/templates');
  revalidatePath(`/templates/${createdTemplate.id}/edit`);

  return { success: true, data: { id: createdTemplate.id } };
};

export const attachAsset = async (rawInput: unknown): Promise<ActionResult> => {
  const input = attachAssetSchema.safeParse(rawInput);

  if (!input.success) {
    return { success: false, error: input.error.flatten().formErrors.join(', ') };
  }

  await db
    .insert(templateAssets)
    .values({
      templateId: input.data.templateId,
      url: input.data.url,
      type: input.data.type,
    })
    .execute();

  revalidatePath(`/templates/${input.data.templateId}/edit`);

  return { success: true, data: { id: input.data.templateId } };
};

export const publishTemplate = async (rawInput: unknown): Promise<ActionResult> => {
  const input = publishTemplateSchema.safeParse(rawInput);

  if (!input.success) {
    return { success: false, error: input.error.flatten().formErrors.join(', ') };
  }

  await db
    .update(templates)
    .set({
      isDraft: input.data.isDraft,
      updatedAt: new Date(),
    })
    .where(eq(templates.id, input.data.id))
    .execute();

  await logActivity({
    action: input.data.isDraft ? 'updated' : 'published',
    entityType: 'template',
    entityId: input.data.id,
  });

  revalidatePath('/templates');
  revalidatePath(`/templates/${input.data.id}/edit`);

  return { success: true, data: { id: input.data.id } };
};

