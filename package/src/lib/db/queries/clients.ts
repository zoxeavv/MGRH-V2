import { eq, desc, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { clients, users } from '@/lib/db/schema';
import { firstOrError } from '@/lib/guards';

export type ClientListItem = {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  tags: string[];
  ownerId: string | null;
  ownerName: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function listClientsByOrganization(
  organizationId: string
): Promise<ClientListItem[]> {
  const rows = await db
    .select({
      id: clients.id,
      name: clients.name,
      company: clients.company,
      email: clients.email,
      phone: clients.phone,
      status: clients.status,
      tags: clients.tags,
      createdAt: clients.createdAt,
      updatedAt: clients.updatedAt,
      ownerId: clients.ownerId,
      ownerName: users.fullName,
    })
    .from(clients)
    .leftJoin(users, eq(users.id, clients.ownerId))
    .where(eq(clients.organizationId, organizationId))
    .orderBy(desc(clients.createdAt));

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    company: row.company ?? null,
    email: row.email ?? null,
    phone: row.phone ?? null,
    status: row.status ?? 'prospect',
    tags: Array.isArray(row.tags) ? row.tags : [],
    ownerId: row.ownerId ?? null,
    ownerName: row.ownerName ?? null,
    createdAt: row.createdAt?.toISOString() ?? '',
    updatedAt: row.updatedAt?.toISOString() ?? '',
  }));
}

export type ClientDetail = Awaited<
  ReturnType<typeof getClientById>
>;

export async function getClientById(
  organizationId: string,
  clientId: string
) {
  const rows = await db
    .select({
      id: clients.id,
      name: clients.name,
      company: clients.company,
      email: clients.email,
      phone: clients.phone,
      status: clients.status,
      tags: clients.tags,
      notes: clients.notes,
      createdAt: clients.createdAt,
      updatedAt: clients.updatedAt,
      ownerId: clients.ownerId,
      ownerName: users.fullName,
    })
    .from(clients)
    .leftJoin(users, eq(users.id, clients.ownerId))
    .where(and(eq(clients.organizationId, organizationId), eq(clients.id, clientId)));

  const result = firstOrError<typeof rows[number]>(rows);
  return {
    id: result.id,
    name: result.name,
    company: result.company ?? null,
    email: result.email ?? null,
    phone: result.phone ?? null,
    status: result.status ?? 'prospect',
    tags: Array.isArray(result.tags) ? result.tags : [],
    notes: result.notes ?? null,
    ownerId: result.ownerId ?? null,
    ownerName: result.ownerName ?? null,
    createdAt: result.createdAt?.toISOString() ?? '',
    updatedAt: result.updatedAt?.toISOString() ?? '',
  };
}
