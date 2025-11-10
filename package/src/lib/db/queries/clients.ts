import { and, desc, eq, ilike, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

import { db } from '../client';
import { clients, notes, offers, offerVersions, profiles, tasks } from '../schema';

export type ClientListOptions = {
  organizationId: string;
  page: number;
  pageSize: number;
  search?: string;
  sort?: 'name' | 'status' | 'created_at';
  direction?: 'asc' | 'desc';
};

export type ClientListItem = {
  id: string;
  name: string;
  status: string;
  description: string | null;
  tags: string[];
  contacts: Array<Record<string, unknown>>;
  createdAt: Date;
  updatedAt: Date;
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

const getClientOrderBy = (options: ClientListOptions) => {
  const direction = options.direction ?? 'desc';

  switch (options.sort) {
    case 'name':
      return direction === 'asc' ? sql`${clients.name} asc` : sql`${clients.name} desc`;
    case 'status':
      return direction === 'asc' ? sql`${clients.status} asc` : sql`${clients.status} desc`;
    default:
      return direction === 'asc' ? sql`${clients.createdAt} asc` : sql`${clients.createdAt} desc`;
  }
};

export const listClients = async ({
  organizationId,
  page,
  pageSize,
  search,
  sort,
  direction,
}: ClientListOptions): Promise<PaginatedResult<ClientListItem>> => {
  const filters = [eq(clients.organizationId, organizationId)];

  if (search) {
    filters.push(ilike(clients.name, `%${search}%`));
  }

  const whereClause = and(...filters);

  const [{ count }] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(clients)
    .where(whereClause)
    .execute();

  const offset = (page - 1) * pageSize;

  const rows = await db
    .select({
      id: clients.id,
      name: clients.name,
      status: clients.status,
      description: clients.description,
      tags: clients.tags,
      contacts: clients.contacts,
      createdAt: clients.createdAt,
      updatedAt: clients.updatedAt,
    })
    .from(clients)
    .where(whereClause)
    .orderBy(getClientOrderBy({ organizationId, page, pageSize, search, sort, direction }))
    .limit(pageSize)
    .offset(offset)
    .execute();

  const total = Number(count ?? 0);
  const pageCount = Math.ceil(total / pageSize);

  return {
    items: rows.map((row) => ({
      ...row,
      tags: (row.tags as string[]) ?? [],
      contacts: (row.contacts as Array<Record<string, unknown>>) ?? [],
    })),
    total,
    page,
    pageSize,
    pageCount,
  };
};

export const getClientById = async (organizationId: string, clientId: string) => {
  const [client] = await db
    .select({
      id: clients.id,
      name: clients.name,
      status: clients.status,
      description: clients.description,
      tags: clients.tags,
      contacts: clients.contacts,
      createdAt: clients.createdAt,
      updatedAt: clients.updatedAt,
      createdByProfileId: clients.createdByProfileId,
    })
    .from(clients)
    .where(and(eq(clients.organizationId, organizationId), eq(clients.id, clientId)))
    .limit(1)
    .execute();

  if (!client) {
    return null;
  }

  const [creator] = await db
    .select({
      id: profiles.id,
      fullName: profiles.fullName,
      email: profiles.email,
    })
    .from(profiles)
    .where(eq(profiles.id, client.createdByProfileId))
    .limit(1)
    .execute();

  return {
    ...client,
    tags: (client.tags as string[]) ?? [],
    contacts: (client.contacts as Array<Record<string, unknown>>) ?? [],
    createdBy: creator ?? null,
  };
};

export const getClientNotes = async (organizationId: string, clientId: string) => {
  const rows = await db
    .select({
      id: notes.id,
      content: notes.content,
      createdAt: notes.createdAt,
      updatedAt: notes.updatedAt,
      authorId: profiles.id,
      authorName: profiles.fullName,
      authorEmail: profiles.email,
    })
    .from(notes)
    .leftJoin(profiles, eq(profiles.id, notes.authorProfileId))
    .where(and(eq(notes.organizationId, organizationId), eq(notes.clientId, clientId)))
    .orderBy(desc(notes.createdAt))
    .execute();

  return rows;
};

export const getClientTasks = async (organizationId: string, clientId: string) => {
  const assigneeProfiles = alias(profiles, 'assignee');

  const rows = await db
    .select({
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      status: tasks.status,
      dueDate: tasks.dueDate,
      createdAt: tasks.createdAt,
      updatedAt: tasks.updatedAt,
      authorId: tasks.authorProfileId,
      assigneeId: tasks.assigneeProfileId,
      authorName: profiles.fullName,
      assigneeName: assigneeProfiles.fullName,
    })
    .from(tasks)
    .leftJoin(profiles, eq(profiles.id, tasks.authorProfileId))
    .leftJoin(assigneeProfiles, eq(assigneeProfiles.id, tasks.assigneeProfileId))
    .where(and(eq(tasks.organizationId, organizationId), eq(tasks.clientId, clientId)))
    .orderBy(desc(tasks.createdAt))
    .execute();

  return rows;
};

export const getClientOffers = async (organizationId: string, clientId: string) => {
  const rows = await db
    .select({
      id: offers.id,
      title: offers.title,
      summary: offers.summary,
      isPublished: offers.isPublished,
      createdAt: offers.createdAt,
      updatedAt: offers.updatedAt,
      currentVersionId: offers.currentVersionId,
      versionNumber: offerVersions.versionNumber,
    })
    .from(offers)
    .leftJoin(offerVersions, eq(offerVersions.id, offers.currentVersionId))
    .where(and(eq(offers.organizationId, organizationId), eq(offers.clientId, clientId)))
    .orderBy(desc(offers.updatedAt))
    .execute();

  return rows;
};

export const listClientOptions = async (organizationId: string) => {
  const rows = await db
    .select({
      id: clients.id,
      name: clients.name,
    })
    .from(clients)
    .where(eq(clients.organizationId, organizationId))
    .orderBy(clients.name)
    .execute();

  return rows;
};
