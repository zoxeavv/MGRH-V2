import { and, desc, eq, ilike, sql } from 'drizzle-orm';

import { db } from '../client';
import { templateAssets, templates } from '../schema';

export type TemplateListOptions = {
  organizationId: string;
  category?: string;
  search?: string;
};

export const listTemplates = async ({ organizationId, category, search }: TemplateListOptions) => {
  const filters = [eq(templates.organizationId, organizationId)];

  if (category && category !== 'all') {
    filters.push(eq(templates.category, category));
  }

  if (search) {
    filters.push(ilike(templates.title, `%${search}%`));
  }

  const rows = await db
    .select({
      id: templates.id,
      title: templates.title,
      category: templates.category,
      isDraft: templates.isDraft,
      previewImageUrl: templates.previewImageUrl,
      updatedAt: templates.updatedAt,
      metadata: templates.metadata,
    })
    .from(templates)
    .where(and(...filters))
    .orderBy(desc(templates.updatedAt))
    .execute();

  return rows.map((row) => ({
    ...row,
    metadata: (row.metadata as Record<string, unknown>) ?? {},
  }));
};

export const getTemplateById = async (organizationId: string, templateId: string) => {
  const [template] = await db
    .select({
      id: templates.id,
      title: templates.title,
      category: templates.category,
      content: templates.content,
      isDraft: templates.isDraft,
      previewImageUrl: templates.previewImageUrl,
      metadata: templates.metadata,
      tags: sql<string[]>`coalesce((templates.metadata->'tags')::text[],'{}')`,
    })
    .from(templates)
    .where(and(eq(templates.organizationId, organizationId), eq(templates.id, templateId)))
    .execute();

  if (!template) {
    return null;
  }

  const metadata = (template.metadata as Record<string, unknown>) ?? {};
  const tagsFromMetadata = Array.isArray(metadata.tags) ? (metadata.tags as string[]) : [];
  const tagsFromColumn = Array.isArray(template.tags) ? (template.tags as string[]) : [];

  return {
    ...template,
    metadata,
    tags: tagsFromMetadata.length > 0 ? tagsFromMetadata : tagsFromColumn,
  };
};

export const getTemplateAssets = async (templateId: string) => {
  return db
    .select({
      id: templateAssets.id,
      url: templateAssets.url,
      type: templateAssets.type,
      createdAt: templateAssets.createdAt,
    })
    .from(templateAssets)
    .where(eq(templateAssets.templateId, templateId))
    .orderBy(desc(templateAssets.createdAt))
    .execute();
};

