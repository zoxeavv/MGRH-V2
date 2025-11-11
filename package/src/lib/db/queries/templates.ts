"use server";

import { db } from "@/lib/db";
import { templates } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { firstOrError, normalizeString } from "@/lib/guards";
import { withServerActionLogging } from "@/lib/logger";
import type { Template, NewTemplate } from "@/lib/db/schema";

export async function getTemplates(organizationId: string) {
  const rows = await db
    .select()
    .from(templates)
    .where(eq(templates.organizationId, organizationId))
    .orderBy(templates.createdAt);

  return rows;
}

export async function getTemplateById(templateId: string, organizationId: string) {
  const rows = await db
    .select()
    .from(templates)
    .where(and(eq(templates.id, templateId), eq(templates.organizationId, organizationId)))
    .limit(1);

  return rows[0] ?? null;
}

export async function createTemplate(
  organizationId: string,
  data: Omit<NewTemplate, "organizationId" | "createdAt" | "updatedAt" | "createdById">
) {
  return withServerActionLogging("createTemplate", async () => {
    const normalizedData: NewTemplate = {
      organizationId,
      name: normalizeString(data.name),
      description: data.description ? normalizeString(data.description) : undefined,
      content: normalizeString(data.content),
      category: data.category ? normalizeString(data.category) : undefined,
      isPublic: data.isPublic ?? false,
      metadata: data.metadata ?? {},
      createdById: data.createdById,
    };

    const rows = await db.insert(templates).values(normalizedData).returning();
    return firstOrError(rows);
  })();
}

export async function updateTemplate(
  templateId: string,
  organizationId: string,
  data: Partial<Omit<NewTemplate, "organizationId" | "id" | "createdAt" | "updatedAt" | "createdById">>
) {
  return withServerActionLogging("updateTemplate", async () => {
    const normalizedData: Partial<NewTemplate> = {};
    if (data.name !== undefined) normalizedData.name = normalizeString(data.name);
    if (data.description !== undefined) normalizedData.description = data.description ? normalizeString(data.description) : undefined;
    if (data.content !== undefined) normalizedData.content = normalizeString(data.content);
    if (data.category !== undefined) normalizedData.category = data.category ? normalizeString(data.category) : undefined;
    if (data.isPublic !== undefined) normalizedData.isPublic = data.isPublic;
    if (data.metadata !== undefined) normalizedData.metadata = data.metadata;

    normalizedData.updatedAt = new Date();

    const rows = await db
      .update(templates)
      .set(normalizedData)
      .where(and(eq(templates.id, templateId), eq(templates.organizationId, organizationId)))
      .returning();

    return firstOrError(rows);
  })();
}

export async function deleteTemplate(templateId: string, organizationId: string) {
  return withServerActionLogging("deleteTemplate", async () => {
    await db
      .delete(templates)
      .where(and(eq(templates.id, templateId), eq(templates.organizationId, organizationId)));
  })();
}
