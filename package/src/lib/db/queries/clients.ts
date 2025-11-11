"use server";

import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema";
import { eq, and, like, inArray } from "drizzle-orm";
import { firstOrError, normalizeArray, normalizeString } from "@/lib/guards";
import { withServerActionLogging } from "@/lib/logger";
import type { Client, NewClient } from "@/lib/db/schema";

export async function getClients(organizationId: string) {
  const rows = await db
    .select()
    .from(clients)
    .where(eq(clients.organizationId, organizationId))
    .orderBy(clients.createdAt);

  return rows;
}

export async function getClientById(clientId: string, organizationId: string) {
  const rows = await db
    .select()
    .from(clients)
    .where(and(eq(clients.id, clientId), eq(clients.organizationId, organizationId)))
    .limit(1);

  return rows[0] ?? null;
}

export async function createClient(
  organizationId: string,
  data: Omit<NewClient, "organizationId" | "createdAt" | "updatedAt">
) {
  return withServerActionLogging("createClient", async () => {
    const normalizedData: NewClient = {
      organizationId,
      name: normalizeString(data.name),
      email: data.email ? normalizeString(data.email) : undefined,
      phone: data.phone ? normalizeString(data.phone) : undefined,
      company: data.company ? normalizeString(data.company) : undefined,
      status: data.status ?? "prospect",
      tags: normalizeArray(data.tags),
      notes: normalizeArray(data.notes),
      metadata: data.metadata ?? {},
      ownerId: data.ownerId ?? undefined,
    };

    const rows = await db.insert(clients).values(normalizedData).returning();
    return firstOrError(rows);
  })();
}

export async function updateClient(
  clientId: string,
  organizationId: string,
  data: Partial<Omit<NewClient, "organizationId" | "id" | "createdAt" | "updatedAt">>
) {
  return withServerActionLogging("updateClient", async () => {
    const normalizedData: Partial<NewClient> = {};
    if (data.name !== undefined) normalizedData.name = normalizeString(data.name);
    if (data.email !== undefined) normalizedData.email = data.email ? normalizeString(data.email) : undefined;
    if (data.phone !== undefined) normalizedData.phone = data.phone ? normalizeString(data.phone) : undefined;
    if (data.company !== undefined) normalizedData.company = data.company ? normalizeString(data.company) : undefined;
    if (data.status !== undefined) normalizedData.status = data.status;
    if (data.tags !== undefined) normalizedData.tags = normalizeArray(data.tags);
    if (data.notes !== undefined) normalizedData.notes = normalizeArray(data.notes);
    if (data.metadata !== undefined) normalizedData.metadata = data.metadata;
    if (data.ownerId !== undefined) normalizedData.ownerId = data.ownerId;

    normalizedData.updatedAt = new Date();

    const rows = await db
      .update(clients)
      .set(normalizedData)
      .where(and(eq(clients.id, clientId), eq(clients.organizationId, organizationId)))
      .returning();

    return firstOrError(rows);
  })();
}

export async function deleteClient(clientId: string, organizationId: string) {
  return withServerActionLogging("deleteClient", async () => {
    await db
      .delete(clients)
      .where(and(eq(clients.id, clientId), eq(clients.organizationId, organizationId)));
  })();
}

export async function searchClients(organizationId: string, query: string) {
  const searchTerm = `%${query}%`;
  const rows = await db
    .select()
    .from(clients)
    .where(
      and(
        eq(clients.organizationId, organizationId),
        like(clients.name, searchTerm)
      )
    )
    .limit(50);

  return rows;
}
