import { db } from '../index';
import { templates } from '../schema';
import { eq, and } from 'drizzle-orm';
import { normalizeArray, firstOrNull } from '../../guards';

export async function getTemplatesByOrganizationId(organizationId: string) {
  const result = await db
    .select()
    .from(templates)
    .where(eq(templates.organizationId, organizationId));
  
  return normalizeArray(result);
}

export async function getTemplateById(templateId: string, organizationId: string) {
  const result = await db
    .select()
    .from(templates)
    .where(and(eq(templates.id, templateId), eq(templates.organizationId, organizationId)))
    .limit(1);
  
  return firstOrNull(result);
}

export async function getTemplateBySlug(slug: string, organizationId: string) {
  // Note: slug is stored in name or we need to add a slug field
  // For now, we'll search by name pattern
  const result = await db
    .select()
    .from(templates)
    .where(and(eq(templates.organizationId, organizationId)))
    .limit(100); // Get all and filter client-side for now
  
  return normalizeArray(result).find((t) => {
    const templateSlug = t.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return templateSlug === slug;
  }) || null;
}
