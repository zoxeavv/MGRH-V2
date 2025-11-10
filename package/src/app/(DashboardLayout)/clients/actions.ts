'use server';

import { revalidatePath } from 'next/cache';
import { and, eq } from 'drizzle-orm';

import { logActivity } from '@/lib/activity/actions';
import { getActiveMembershipOrRedirect } from '@/lib/auth/session';
import { db } from '@/lib/db/client';
import { clients, notes, tasks } from '@/lib/db/schema';
import {
  addNoteSchema,
  addTaskSchema,
  createClientSchema,
  importClientsSchema,
  updateClientStatusSchema,
  updateTaskStatusSchema,
} from '@/lib/validation/clients';

type ActionResult<T = unknown> = { success: true; data: T } | { success: false; error: string };

export const createClient = async (rawInput: unknown): Promise<ActionResult> => {
  const input = createClientSchema.safeParse(rawInput);

  if (!input.success) {
    return { success: false, error: input.error.flatten().formErrors.join(', ') };
  }

  const { organization, profile } = await getActiveMembershipOrRedirect();

  const [createdClient] = await db
    .insert(clients)
    .values({
      organizationId: organization.id,
      createdByProfileId: profile.id,
      name: input.data.name,
      description: input.data.description ?? null,
      status: input.data.status,
      contacts: input.data.contacts ?? [],
      tags: input.data.tags ?? [],
    })
    .returning({ id: clients.id })
    .execute();

  await logActivity({
    action: 'created',
    entityType: 'client',
    entityId: createdClient.id,
    metadata: { name: input.data.name, status: input.data.status },
  });

  revalidatePath('/clients');

  return {
    success: true,
    data: { id: createdClient.id },
  };
};

export const updateClientStatus = async (rawInput: unknown): Promise<ActionResult> => {
  const input = updateClientStatusSchema.safeParse(rawInput);

  if (!input.success) {
    return { success: false, error: input.error.flatten().formErrors.join(', ') };
  }

  const { organization } = await getActiveMembershipOrRedirect();

  const [updated] = await db
    .update(clients)
    .set({
      status: input.data.status,
      updatedAt: new Date(),
    })
    .where(and(eq(clients.id, input.data.clientId), eq(clients.organizationId, organization.id)))
    .returning({ id: clients.id, name: clients.name })
    .execute();

  if (!updated) {
    return { success: false, error: 'Client not found' };
  }

  await logActivity({
    action: 'status_changed',
    entityType: 'client',
    entityId: updated.id,
    metadata: { status: input.data.status },
  });

  revalidatePath('/clients');
  revalidatePath(`/clients/${updated.id}`);

  return { success: true, data: updated };
};

export const addNote = async (rawInput: unknown): Promise<ActionResult> => {
  const input = addNoteSchema.safeParse(rawInput);

  if (!input.success) {
    return { success: false, error: input.error.flatten().formErrors.join(', ') };
  }

  const { organization, profile } = await getActiveMembershipOrRedirect();

  const [note] = await db
    .insert(notes)
    .values({
      organizationId: organization.id,
      clientId: input.data.clientId,
      authorProfileId: profile.id,
      content: input.data.content,
    })
    .returning({ id: notes.id })
    .execute();

  await logActivity({
    action: 'created',
    entityType: 'client',
    entityId: input.data.clientId,
    metadata: { noteId: note.id },
  });

  revalidatePath(`/clients/${input.data.clientId}`);

  return { success: true, data: { id: note.id } };
};

export const addTask = async (rawInput: unknown): Promise<ActionResult> => {
  const input = addTaskSchema.safeParse(rawInput);

  if (!input.success) {
    return { success: false, error: input.error.flatten().formErrors.join(', ') };
  }

  const { organization, profile } = await getActiveMembershipOrRedirect();

  const [task] = await db
    .insert(tasks)
    .values({
      organizationId: organization.id,
      clientId: input.data.clientId,
      authorProfileId: profile.id,
      assigneeProfileId: input.data.assigneeProfileId,
      title: input.data.title,
      description: input.data.description ?? null,
      dueDate: input.data.dueDate ? new Date(input.data.dueDate) : null,
      status: 'todo',
    })
    .returning({ id: tasks.id })
    .execute();

  await logActivity({
    action: 'created',
    entityType: 'client',
    entityId: input.data.clientId,
    metadata: { taskId: task.id },
  });

  revalidatePath(`/clients/${input.data.clientId}`);

  return { success: true, data: { id: task.id } };
};

export const updateTaskStatus = async (rawInput: unknown): Promise<ActionResult> => {
  const input = updateTaskStatusSchema.safeParse(rawInput);

  if (!input.success) {
    return { success: false, error: input.error.flatten().formErrors.join(', ') };
  }

  const { organization } = await getActiveMembershipOrRedirect();

  const [task] = await db
    .update(tasks)
    .set({
      status: input.data.status,
      updatedAt: new Date(),
    })
    .where(and(eq(tasks.id, input.data.taskId), eq(tasks.organizationId, organization.id)))
    .returning({ id: tasks.id, clientId: tasks.clientId })
    .execute();

  if (!task) {
    return { success: false, error: 'Task not found' };
  }

  await logActivity({
    action: 'status_changed',
    entityType: 'client',
    entityId: task.clientId!,
    metadata: { taskId: task.id, status: input.data.status },
  });

  if (task.clientId) {
    revalidatePath(`/clients/${task.clientId}`);
  }

  return { success: true, data: task };
};

type ImportSummary = {
  created: number;
  updated: number;
  skipped: number;
};

export const importClients = async (rawRows: unknown): Promise<ActionResult<ImportSummary>> => {
  const parsed = importClientsSchema.safeParse(rawRows);

  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().formErrors.join(', ') };
  }

  const { organization, profile } = await getActiveMembershipOrRedirect();

  const existingClients = await db
    .select({
      id: clients.id,
      name: clients.name,
      status: clients.status,
      contacts: clients.contacts,
      tags: clients.tags,
    })
    .from(clients)
    .where(eq(clients.organizationId, organization.id))
    .execute();

  const emailIndex = new Map<string, (typeof existingClients)[number]>();
  const nameIndex = new Map<string, (typeof existingClients)[number]>();

  for (const client of existingClients) {
    nameIndex.set(client.name.toLowerCase(), client);

    const contacts = (client.contacts as Array<Record<string, unknown>>) ?? [];
    contacts.forEach((contact) => {
      const email = typeof contact.email === 'string' ? contact.email.toLowerCase() : null;
      if (email) {
        emailIndex.set(email, client);
      }
    });
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const row of parsed.data) {
    const normalizedName = row.name.toLowerCase();
    const normalizedEmail = row.email?.toLowerCase();

    const existing =
      (normalizedEmail ? emailIndex.get(normalizedEmail) : undefined) ??
      nameIndex.get(normalizedName);

    const tags = row.tags ?? [];
    const contacts =
      row.email || row.phone
        ? [
            {
              name: row.name,
              email: row.email,
              phone: row.phone,
            },
          ]
        : [];

    if (existing) {
      const newStatus = row.status ?? (existing.status as string);
      const currentTags = (existing.tags as string[]) ?? [];

      await db
        .update(clients)
        .set({
          status: newStatus,
          updatedAt: new Date(),
          contacts: contacts.length > 0 ? contacts : (existing.contacts as any),
          tags: tags.length > 0 ? tags : currentTags,
        })
        .where(eq(clients.id, existing.id))
        .execute();

      await logActivity({
        action: 'updated',
        entityType: 'client',
        entityId: existing.id,
        metadata: { status: newStatus, source: 'import' },
      });
      updated += 1;

      revalidatePath(`/clients/${existing.id}`);
    } else {
      const [createdClient] = await db
        .insert(clients)
        .values({
          organizationId: organization.id,
          createdByProfileId: profile.id,
          name: row.name,
          status: row.status ?? 'lead',
          contacts,
          tags,
        })
        .returning({ id: clients.id })
        .execute();

      await logActivity({
        action: 'created',
        entityType: 'client',
        entityId: createdClient.id,
        metadata: { source: 'import' },
      });
      created += 1;
    }
  }

  revalidatePath('/clients');

  return {
    success: true,
    data: {
      created,
      updated,
      skipped,
    },
  };
};

