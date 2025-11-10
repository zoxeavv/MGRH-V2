'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { getActiveMembershipOrRedirect } from '@/lib/auth/session';
import { getDbClient } from '@/lib/db/client';
import { clients, notes, tasks } from '@/lib/db/schema';
import { logActivity } from '@/lib/services/activity';

const createClientSchema = z.object({
  name: z.string().min(2),
  description: z.string().max(2000).optional(),
  status: z.enum(['lead', 'active', 'inactive', 'archived']).optional(),
  tags: z.array(z.string().trim()).optional(),
  contacts: z
    .array(
      z.object({
        label: z.string().optional(),
        value: z.string(),
      }),
    )
    .optional(),
});

const updateClientStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['lead', 'active', 'inactive', 'archived']),
});

const addNoteSchema = z.object({
  clientId: z.string().uuid(),
  content: z.string().min(1),
});

const addTaskSchema = z.object({
  clientId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  assigneeProfileId: z.string().uuid().optional(),
});

const updateTaskStatusSchema = z.object({
  taskId: z.string().uuid(),
  status: z.enum(['todo', 'in_progress', 'done']),
});

const importRowSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
  status: z.enum(['lead', 'active', 'inactive', 'archived']).optional(),
});

export type ImportRow = z.infer<typeof importRowSchema>;

export const createClient = async (input: z.infer<typeof createClientSchema>) => {
  const { profile, membership } = await getActiveMembershipOrRedirect();
  const db = getDbClient();

  const data = createClientSchema.parse(input);

  const [created] = await db
    .insert(clients)
    .values({
      organizationId: membership.organization_id,
      createdByProfileId: profile.id,
      name: data.name,
      description: data.description ?? null,
      status: data.status ?? 'lead',
      tags: data.tags ?? [],
      contacts: data.contacts ?? [],
    })
    .returning({ id: clients.id });

  await logActivity({
    organizationId: membership.organization_id,
    actorProfileId: profile.id,
    action: 'created',
    entityType: 'client',
    entityId: created.id,
    metadata: { name: data.name },
  });

  revalidatePath('/clients');
  revalidatePath(`/clients/${created.id}`);

  return created;
};

export const updateClientStatus = async (input: z.infer<typeof updateClientStatusSchema>) => {
  const { profile, membership } = await getActiveMembershipOrRedirect();
  const db = getDbClient();
  const data = updateClientStatusSchema.parse(input);

  await db
    .update(clients)
    .set({ status: data.status })
    .where(and(eq(clients.id, data.id), eq(clients.organizationId, membership.organization_id)));

  await logActivity({
    organizationId: membership.organization_id,
    actorProfileId: profile.id,
    action: 'status_changed',
    entityType: 'client',
    entityId: data.id,
    metadata: { status: data.status },
  });

  revalidatePath('/clients');
  revalidatePath(`/clients/${data.id}`);
};

export const addNote = async (input: z.infer<typeof addNoteSchema>) => {
  const { profile, membership } = await getActiveMembershipOrRedirect();
  const db = getDbClient();
  const data = addNoteSchema.parse(input);

  const [created] = await db
    .insert(notes)
    .values({
      organizationId: membership.organization_id,
      clientId: data.clientId,
      authorProfileId: profile.id,
      content: data.content,
    })
    .returning({ id: notes.id });

  await logActivity({
    organizationId: membership.organization_id,
    actorProfileId: profile.id,
    action: 'created',
    entityType: 'client',
    entityId: data.clientId,
    metadata: { noteId: created.id },
  });

  revalidatePath(`/clients/${data.clientId}`);
  return created;
};

export const addTask = async (input: z.infer<typeof addTaskSchema>) => {
  const { profile, membership } = await getActiveMembershipOrRedirect();
  const db = getDbClient();
  const data = addTaskSchema.parse(input);

  const [created] = await db
    .insert(tasks)
    .values({
      organizationId: membership.organization_id,
      clientId: data.clientId,
      title: data.title,
      description: data.description ?? null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      authorProfileId: profile.id,
      assigneeProfileId: data.assigneeProfileId ?? null,
    })
    .returning({ id: tasks.id, status: tasks.status });

  await logActivity({
    organizationId: membership.organization_id,
    actorProfileId: profile.id,
    action: 'created',
    entityType: 'client',
    entityId: data.clientId,
    metadata: { taskId: created.id },
  });

  revalidatePath(`/clients/${data.clientId}`);
  return created;
};

export const updateTaskStatus = async (input: z.infer<typeof updateTaskStatusSchema>) => {
  const { profile, membership } = await getActiveMembershipOrRedirect();
  const db = getDbClient();
  const data = updateTaskStatusSchema.parse(input);

  const [updated] = await db
    .update(tasks)
    .set({ status: data.status })
    .where(and(eq(tasks.id, data.taskId), eq(tasks.organizationId, membership.organization_id)))
    .returning({ clientId: tasks.clientId });

  if (updated?.clientId) {
    await logActivity({
      organizationId: membership.organization_id,
      actorProfileId: profile.id,
      action: 'status_changed',
      entityType: 'client',
      entityId: updated.clientId,
      metadata: { taskId: data.taskId, status: data.status },
    });

    revalidatePath(`/clients/${updated.clientId}`);
  }
};

export const importClients = async (rows: ImportRow[]) => {
  const { profile, membership } = await getActiveMembershipOrRedirect();
  const db = getDbClient();

  const parsedRows = rows
    .map((row) => {
      const result = importRowSchema.safeParse(row);
      return result.success ? result.data : null;
    })
    .filter((row): row is ImportRow => row !== null);

  if (parsedRows.length === 0) {
    return { created: 0, updated: 0, ignored: rows.length };
  }

  const existing = await db
    .select({
      id: clients.id,
      name: clients.name,
    })
    .from(clients)
    .where(eq(clients.organizationId, membership.organization_id));

  const existingMap = new Map(existing.map((client) => [client.name.toLowerCase(), client.id]));

  let created = 0;
  let updatedCount = 0;

  for (const row of parsedRows) {
    const tags = Array.isArray(row.tags) ? row.tags : row.tags?.split(',').map((tag) => tag.trim()).filter(Boolean) ?? [];
    const contactsArray =
      row.email || row.phone
        ? [
            row.email ? { label: 'Email', value: row.email } : null,
            row.phone ? { label: 'Téléphone', value: row.phone } : null,
          ].filter(Boolean)
        : [];

    const existingId = existingMap.get(row.name.toLowerCase());
    if (existingId) {
      await db
        .update(clients)
        .set({
          status: row.status ?? 'lead',
          tags,
          contacts: contactsArray,
          updatedAt: new Date(),
        })
        .where(eq(clients.id, existingId));

      updatedCount += 1;
      await logActivity({
        organizationId: membership.organization_id,
        actorProfileId: profile.id,
        action: 'updated',
        entityType: 'client',
        entityId: existingId,
        metadata: { source: 'import' },
      });
    } else {
      const [createdRow] = await db
        .insert(clients)
        .values({
          organizationId: membership.organization_id,
          createdByProfileId: profile.id,
          name: row.name,
          status: row.status ?? 'lead',
          tags,
          contacts: contactsArray,
        })
        .returning({ id: clients.id });

      existingMap.set(row.name.toLowerCase(), createdRow.id);
      created += 1;

      await logActivity({
        organizationId: membership.organization_id,
        actorProfileId: profile.id,
        action: 'created',
        entityType: 'client',
        entityId: createdRow.id,
        metadata: { source: 'import' },
      });
    }
  }

  revalidatePath('/clients');

  return {
    created,
    updated: updatedCount,
    ignored: rows.length - parsedRows.length,
  };
};
