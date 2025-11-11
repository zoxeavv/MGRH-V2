'use server';

import { db } from '@/lib/db';
import { clients } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { firstOrError, normalizeArray, normalizeString } from '@/lib/guards';
import { withServerActionLogging } from '@/lib/logger';
import { revalidatePath } from 'next/cache';

interface CreateClientInput {
  organizationId: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: 'active' | 'inactive' | 'archived';
  tags?: string[];
  ownerId?: string;
}

export const createClient = withServerActionLogging(
  'createClient',
  async (input: CreateClientInput) => {
    const result = await db
      .insert(clients)
      .values({
        organizationId: input.organizationId,
        name: normalizeString(input.name),
        email: input.email ? normalizeString(input.email) : null,
        phone: input.phone ? normalizeString(input.phone) : null,
        company: input.company ? normalizeString(input.company) : null,
        status: input.status || 'active',
        tags: normalizeArray(input.tags),
        ownerId: input.ownerId || null,
        notes: [],
        files: [],
      })
      .returning();

    const client = firstOrError(result);
    revalidatePath('/clients');
    return client;
  }
);

interface UpdateClientInput {
  id: string;
  organizationId: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: 'active' | 'inactive' | 'archived';
  tags?: string[];
  ownerId?: string;
}

export const updateClient = withServerActionLogging(
  'updateClient',
  async (input: UpdateClientInput) => {
    const updateData: Partial<typeof clients.$inferInsert> = {};

    if (input.name !== undefined) updateData.name = normalizeString(input.name);
    if (input.email !== undefined) updateData.email = input.email ? normalizeString(input.email) : null;
    if (input.phone !== undefined) updateData.phone = input.phone ? normalizeString(input.phone) : null;
    if (input.company !== undefined) updateData.company = input.company ? normalizeString(input.company) : null;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.tags !== undefined) updateData.tags = normalizeArray(input.tags);
    if (input.ownerId !== undefined) updateData.ownerId = input.ownerId || null;

    const result = await db
      .update(clients)
      .set(updateData)
      .where(and(eq(clients.id, input.id), eq(clients.organizationId, input.organizationId)))
      .returning();

    const client = firstOrError(result);
    revalidatePath('/clients');
    revalidatePath(`/clients/${input.id}`);
    return client;
  }
);

export const deleteClient = withServerActionLogging(
  'deleteClient',
  async (clientId: string, organizationId: string) => {
    await db
      .delete(clients)
      .where(and(eq(clients.id, clientId), eq(clients.organizationId, organizationId)));

    revalidatePath('/clients');
  }
);

interface AddNoteInput {
  clientId: string;
  organizationId: string;
  content: string;
  userId: string;
}

export const addClientNote = withServerActionLogging(
  'addClientNote',
  async (input: AddNoteInput) => {
    const client = await db
      .select()
      .from(clients)
      .where(and(eq(clients.id, input.clientId), eq(clients.organizationId, input.organizationId)))
      .limit(1);

    const existingClient = firstOrError(client);
    const notes = normalizeArray(existingClient.notes);

    const newNote = {
      id: crypto.randomUUID(),
      content: normalizeString(input.content),
      createdAt: new Date().toISOString(),
      userId: input.userId,
    };

    const result = await db
      .update(clients)
      .set({
        notes: [...notes, newNote],
      })
      .where(and(eq(clients.id, input.clientId), eq(clients.organizationId, input.organizationId)))
      .returning();

    const updated = firstOrError(result);
    revalidatePath(`/clients/${input.clientId}`);
    return updated;
  }
);
