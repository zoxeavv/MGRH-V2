import { and, eq, sql, desc } from 'drizzle-orm';
import { getDbClient } from '@/lib/db/client';
import { templates, templateAssets } from '@/lib/db/schema';

export type TemplateListParams = {
  organizationId: string;
  category?: string;
  search?: string;
};

export const listTemplates = async ({ organizationId, category, search }: TemplateListParams) => {
  const db = getDbClient();
  const conditions = [eq(templates.organizationId, organizationId)];

  if (category) {
    conditions.push(eq(templates.category, category));
  }

  if (search) {
    const term = `%${search}%`;
    conditions.push(
      sql<boolean>`
        ${templates.title} ILIKE ${term}
        OR ${sql`coalesce(${templates.content}, '')`} ILIKE ${term}
      `,
    );
  }

  const whereClause = and(...conditions);

  return db
    .select({
      id: templates.id,
      title: templates.title,
      category: templates.category,
      isDraft: templates.isDraft,
      previewImageUrl: templates.previewImageUrl,
      updatedAt: templates.updatedAt,
    })
    .from(templates)
    .where(whereClause)
    .orderBy(desc(templates.updatedAt));
};

export const getTemplateById = async (organizationId: string, templateId: string) => {
  const db = getDbClient();

  const [template] = await db
    .select({
      id: templates.id,
      title: templates.title,
      category: templates.category,
      content: templates.content,
      isDraft: templates.isDraft,
      previewImageUrl: templates.previewImageUrl,
      metadata: templates.metadata,
      createdAt: templates.createdAt,
      updatedAt: templates.updatedAt,
    })
    .from(templates)
    .where(and(eq(templates.id, templateId), eq(templates.organizationId, organizationId)));

  return template ?? null;
};

export const listTemplateAssets = async (templateId: string) => {
  const db = getDbClient();
  return db
    .select({
      id: templateAssets.id,
      url: templateAssets.url,
      type: templateAssets.type,
      createdAt: templateAssets.createdAt,
    })
    .from(templateAssets)
    .where(eq(templateAssets.templateId, templateId))
    .orderBy(desc(templateAssets.createdAt));
};
