import { and, count, desc, eq, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { getDbClient } from '@/lib/db/client';
import { clients, offers, notes, offerVersions, tasks, profiles } from '@/lib/db/schema';

export type ClientListParams = {
  organizationId: string;
  search?: string;
  status?: 'lead' | 'active' | 'inactive' | 'archived';
  sort?: 'name' | 'created_at';
  page: number;
  pageSize: number;
};

export type ClientListItem = {
  id: string;
  name: string;
  status: string;
  description: string | null;
  tags: string[];
  contacts: Array<Record<string, unknown>>;
  updatedAt: Date | null;
};

export type PaginatedClients = {
  data: ClientListItem[];
  total: number;
  page: number;
  pageSize: number;
};

export const listClients = async ({
  organizationId,
  search,
  status,
  sort = 'name',
  page,
  pageSize,
}: ClientListParams): Promise<PaginatedClients> => {
  const db = getDbClient();

  const conditions = [eq(clients.organizationId, organizationId)];

  if (status) {
    conditions.push(eq(clients.status, status));
  }

  if (search) {
    const term = `%${search}%`;
    conditions.push(
      sql<boolean>`
        (${clients.name} ILIKE ${term})
        OR (${sql`coalesce(${clients.description}, '')`} ILIKE ${term})
        OR (${sql`coalesce(${clients.tags}::text, '')`} ILIKE ${term})
      `,
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const totalQueryBuilder = db.select({ value: count() }).from(clients);
  if (whereClause) {
    totalQueryBuilder.where(whereClause);
  }
  const totalQuery = await totalQueryBuilder;

  const total = totalQuery[0]?.value ?? 0;

  const orderBy =
    sort === 'created_at'
      ? desc(clients.createdAt)
      : sql`${clients.name} COLLATE "fr_FR" ASC`;

  const dataBuilder = db
    .select({
      id: clients.id,
      name: clients.name,
      status: clients.status,
      description: clients.description,
      tags: clients.tags,
      contacts: clients.contacts,
      updatedAt: clients.updatedAt,
    })
    .from(clients)
    .orderBy(orderBy)
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  if (whereClause) {
    dataBuilder.where(whereClause);
  }

  const data = await dataBuilder;

  return {
    data,
    total,
    page,
    pageSize,
  };
};

export const getClientById = async (organizationId: string, clientId: string) => {
  const db = getDbClient();

  const clientQuery = db
    .select({
      id: clients.id,
      name: clients.name,
      description: clients.description,
      status: clients.status,
      tags: clients.tags,
      contacts: clients.contacts,
      createdAt: clients.createdAt,
      updatedAt: clients.updatedAt,
    })
    .from(clients)
    .where(and(eq(clients.id, clientId), eq(clients.organizationId, organizationId)));

  const [client] = await clientQuery;

  return client ?? null;
};

export const getClientNotes = async (organizationId: string, clientId: string) => {
  const db = getDbClient();

  return db
    .select({
      id: notes.id,
      content: notes.content,
      createdAt: notes.createdAt,
      updatedAt: notes.updatedAt,
      authorId: notes.authorProfileId,
      authorName: profiles.fullName,
      authorEmail: profiles.email,
    })
    .from(notes)
    .leftJoin(profiles, eq(notes.authorProfileId, profiles.id))
    .where(and(eq(notes.organizationId, organizationId), eq(notes.clientId, clientId)))
    .orderBy(desc(notes.createdAt));
};

export const getClientTasks = async (organizationId: string, clientId: string) => {
  const db = getDbClient();
  const assigneeProfile = alias(profiles, 'assignee');

  return db
    .select({
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      status: tasks.status,
      dueDate: tasks.dueDate,
      assigneeId: tasks.assigneeProfileId,
      authorId: tasks.authorProfileId,
      createdAt: tasks.createdAt,
      authorName: profiles.fullName,
      assigneeName: assigneeProfile.fullName,
    })
    .from(tasks)
    .leftJoin(profiles, eq(tasks.authorProfileId, profiles.id))
    .leftJoin(assigneeProfile, eq(tasks.assigneeProfileId, assigneeProfile.id))
    .where(and(eq(tasks.organizationId, organizationId), eq(tasks.clientId, clientId)))
    .orderBy(desc(tasks.createdAt));
};

export const getClientOffers = async (organizationId: string, clientId: string) => {
  const db = getDbClient();

  return db
    .select({
      id: offers.id,
      title: offers.title,
      isPublished: offers.isPublished,
      createdAt: offers.createdAt,
      updatedAt: offers.updatedAt,
      currentVersion: offerVersions.versionNumber,
    })
    .from(offers)
    .leftJoin(offerVersions, eq(offerVersions.id, offers.currentVersionId))
    .where(and(eq(offers.organizationId, organizationId), eq(offers.clientId, clientId)))
    .orderBy(desc(offers.createdAt));
};
