import { addDays } from 'date-fns';
import { and, desc, eq, not, sql } from 'drizzle-orm';

import { db } from '../client';
import {
  activityLog,
  clients,
  offers,
  offerItems,
  offerVersions,
  profiles,
  tasks,
} from '../schema';

export type DashboardKpis = {
  activeClients: number;
  publishedOffers: number;
  estimatedRevenue: number;
  tasksDueSoon: number;
};

export type ActivityFeedItem = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown>;
  actor: {
    id: string;
    fullName: string | null;
    email: string;
  };
  createdAt: Date;
};

export type RevenueByMonth = {
  month: string;
  total: number;
};

export const getDashboardKpis = async (organizationId: string): Promise<DashboardKpis> => {
  const [{ count: activeClientsCount }] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(clients)
    .where(and(eq(clients.organizationId, organizationId), eq(clients.status, 'active')))
    .execute();

  const [{ count: publishedOffersCount }] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(offers)
    .where(and(eq(offers.organizationId, organizationId), eq(offers.isPublished, true)))
    .execute();

  const [{ totalRevenue }] = await db
    .select({
      totalRevenue: sql<number>`
        coalesce(
          sum(
            (offer_items.quantity::numeric) * (offer_items.unit_price::numeric)
          ),
          0
        )
      `,
    })
    .from(offers)
    .leftJoin(offerVersions, eq(offerVersions.id, offers.currentVersionId))
    .leftJoin(offerItems, eq(offerItems.offerVersionId, offerVersions.id))
    .where(eq(offers.organizationId, organizationId))
    .execute();

  const dueDateThreshold = addDays(new Date(), 7);

  const [{ count: tasksDueSoonCount }] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(tasks)
    .where(
      and(
        eq(tasks.organizationId, organizationId),
        not(eq(tasks.status, 'done')),
        sql`tasks.due_date IS NOT NULL`,
        sql`tasks.due_date <= ${dueDateThreshold.toISOString()}`,
      ),
    )
    .execute();

  return {
    activeClients: Number(activeClientsCount ?? 0),
    publishedOffers: Number(publishedOffersCount ?? 0),
    estimatedRevenue: Number(totalRevenue ?? 0),
    tasksDueSoon: Number(tasksDueSoonCount ?? 0),
  };
};

export const getActivityFeed = async (
  organizationId: string,
  limit = 20,
): Promise<ActivityFeedItem[]> => {
  const results = await db
    .select({
      id: activityLog.id,
      action: activityLog.action,
      entityType: activityLog.entityType,
      entityId: activityLog.entityId,
      metadata: activityLog.metadata,
      createdAt: activityLog.createdAt,
      actorId: profiles.id,
      actorFullName: profiles.fullName,
      actorEmail: profiles.email,
    })
    .from(activityLog)
    .leftJoin(profiles, eq(profiles.id, activityLog.actorProfileId))
    .where(eq(activityLog.organizationId, organizationId))
    .orderBy(desc(activityLog.createdAt))
    .limit(limit)
    .execute();

  return results.map((row) => ({
    id: row.id,
    action: row.action,
    entityType: row.entityType,
    entityId: row.entityId,
    metadata: row.metadata ?? {},
    createdAt: row.createdAt,
    actor: {
      id: row.actorId ?? 'unknown',
      fullName: row.actorFullName,
      email: row.actorEmail ?? 'unknown',
    },
  }));
};

export const getRevenueByMonth = async (
  organizationId: string,
  months = 6,
): Promise<RevenueByMonth[]> => {
  const rows = await db
    .select({
      month: sql<string>`to_char(date_trunc('month', offers.created_at), 'YYYY-MM')`,
      total: sql<number>`
        coalesce(
          sum(
            (offer_items.quantity::numeric) * (offer_items.unit_price::numeric)
          ),
          0
        )
      `,
      monthDate: sql<Date>`date_trunc('month', offers.created_at)`,
    })
    .from(offers)
    .leftJoin(offerVersions, eq(offerVersions.id, offers.currentVersionId))
    .leftJoin(offerItems, eq(offerItems.offerVersionId, offerVersions.id))
    .where(and(eq(offers.organizationId, organizationId), eq(offers.isPublished, true)))
    .groupBy(sql`date_trunc('month', offers.created_at)`)
    .orderBy(desc(sql`date_trunc('month', offers.created_at)`))
    .limit(months)
    .execute();

  return rows
    .map((row) => ({
      month: row.month,
      total: Number(row.total ?? 0),
      monthDate: row.monthDate,
    }))
    .sort((a, b) => a.monthDate.getTime() - b.monthDate.getTime())
    .map(({ month, total }) => ({ month, total }));
};

