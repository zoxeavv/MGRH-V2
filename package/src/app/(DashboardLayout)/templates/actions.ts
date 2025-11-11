'use server';

import { db } from '@/lib/db';
import { templates } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { firstOrError, normalizeArray, normalizeString } from '@/lib/guards';
import { withServerActionLogging } from '@/lib/logger';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const templateSchema = z.object({
  name: z.string().min(1, 'Title is required').transform((val) => val.trim()),
  description: z.string().default('').transform((val) => val.trim()),
  content: z.string().default(''),
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
});

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

interface CreateTemplateInput {
  organizationId: string;
  name: string;
  description?: string | undefined;
  content?: string | undefined;
  tags?: string[] | undefined;
  category?: string | undefined;
  createdById: string;
}

export const createTemplate = withServerActionLogging(
  'createTemplate',
  async (input: CreateTemplateInput) => {
    // Validate with zod
    const validated = templateSchema.parse({
      name: input.name.trim(),
      description: input.description || '',
      content: input.content || '',
      tags: normalizeArray(input.tags),
      category: input.category,
    });

    // Check for duplicate slug
    const existingTemplates = await db
      .select()
      .from(templates)
      .where(eq(templates.organizationId, input.organizationId))
      .limit(100);

    const slug = generateSlug(validated.name);
    const normalizedTemplates = normalizeArray(existingTemplates);
    const duplicate = normalizedTemplates.find((t) => {
      const existingSlug = generateSlug(t.name);
      return existingSlug === slug;
    });

    if (duplicate) {
      throw new Error(`Template with slug "${slug}" already exists`);
    }

    const normalizedSections = normalizeArray([]);

    const insertValues = {
      organizationId: input.organizationId,
      name: normalizeString(validated.name),
      description: validated.description || null,
      content: validated.content || null,
      sections: normalizedSections,
      createdById: input.createdById,
    };

    const result = await db
      .insert(templates)
      .values(insertValues)
      .returning();

    const template = firstOrError(result);
    revalidatePath('/templates');
    revalidatePath(`/templates/${template.id}`);
    return template;
  }
);

interface UpdateTemplateInput {
  id: string;
  organizationId: string;
  name?: string | undefined;
  description?: string | undefined;
  content?: string | undefined;
  tags?: string[] | undefined;
  category?: string | undefined;
}

export const updateTemplate = withServerActionLogging(
  'updateTemplate',
  async (input: UpdateTemplateInput) => {
    const updateData: Partial<typeof templates.$inferInsert> = {};

    if (input.name !== undefined) {
      const trimmed = input.name.trim();
      if (trimmed.length === 0) {
        throw new Error('Title cannot be empty');
      }
      updateData.name = normalizeString(trimmed);
    }
    if (input.content !== undefined) {
      updateData.content = input.content ? normalizeString(input.content) : null;
    }

    const result = await db
      .update(templates)
      .set(updateData)
      .where(and(eq(templates.id, input.id), eq(templates.organizationId, input.organizationId)))
      .returning();

    const template = firstOrError(result);
    revalidatePath('/templates');
    revalidatePath(`/templates/${template.id}`);
    return template;
  }
);

export const deleteTemplate = withServerActionLogging(
  'deleteTemplate',
  async (templateId: string, organizationId: string) => {
    await db
      .delete(templates)
      .where(and(eq(templates.id, templateId), eq(templates.organizationId, organizationId)));

    revalidatePath('/templates');
  }
);
