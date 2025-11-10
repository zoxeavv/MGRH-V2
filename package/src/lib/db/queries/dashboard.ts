import { addDays } from 'date-fns';
import { and, count, desc, eq, isNotNull, sql } from 'drizzle-orm';
import { getDbClient } from '@/lib/db/client';
import {
  activityLog,
  clients,
  offers,
  offerItems,
  offerVersions,
  profiles,
  tasks,
} from '@/lib/db/schema';

export type DashboardKpis = {
  activeClients: number;
  publishedOffers: number;
  estimatedRevenue: number;
  upcomingTasks: number;
};

export type ActivityFeedItem = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
  actor?: {
    fullName: string | null;
    email: string;
    avatarUrl: string | null;
  };
};

export type MonthlyRevenuePoint = {
  period: string;
  total: number;
};

export const getDashboardKpis = async (organizationId: string): Promise<DashboardKpis> => {
  const db = getDbClient();

  const [{ value: activeClients } = { value: 0 }] = await db
    .select({ value: count() })
    .from(clients)
    .where(and(eq(clients.organizationId, organizationId), eq(clients.status, 'active')));

  const [{ value: publishedOffers } = { value: 0 }] = await db
    .select({ value: count() })
    .from(offers)
    .where(and(eq(offers.organizationId, organizationId), eq(offers.isPublished, true)));

  const [{ totalRevenue } = { totalRevenue: '0' }] = await db
    .select({
      totalRevenue: sql<string>`
        coalesce(sum(${offerItems.quantity} * ${offerItems.unitPrice}), '0')
      `,
    })
    .from(offers)
    .leftJoin(offerVersions, eq(offers.currentVersionId, offerVersions.id))
    .leftJoin(offerItems, eq(offerItems.offerVersionId, offerVersions.id))
    .where(and(eq(offers.organizationId, organizationId), isNotNull(offers.currentVersionId)));

  const revenue = Number(totalRevenue ?? 0);

  const sevenDaysOut = addDays(new Date(), 7);

  const [{ value: upcomingTasks } = { value: 0 }] = await db
    .select({ value: count() })
    .from(tasks)
    .where(
      and(
        eq(tasks.organizationId, organizationId),
        isNotNull(tasks.dueDate),
        sql`${tasks.dueDate} <= ${sevenDaysOut.toISOString()}`,
        sql`${tasks.status} != 'done'`,
      ),
    );

  return {
    activeClients,
    publishedOffers,
    estimatedRevenue: Number.isNaN(revenue) ? 0 : revenue,
    upcomingTasks,
  };
};

export const getRecentActivityFeed = async (
  organizationId: string,
  limit = 20,
): Promise<ActivityFeedItem[]> => {
  const db = getDbClient();

  const rows = await db
    .select({
      id: activityLog.id,
      action: activityLog.action,
      entityType: activityLog.entityType,
      entityId: activityLog.entityId,
      metadata: activityLog.metadata,
      createdAt: activityLog.createdAt,
      actorId: activityLog.actorProfileId,
      actorFullName: profiles.fullName,
      actorEmail: profiles.email,
      actorAvatar: profiles.avatarUrl,
    })
    .from(activityLog)
    .leftJoin(profiles, eq(activityLog.actorProfileId, profiles.id))
    .where(eq(activityLog.organizationId, organizationId))
    .orderBy(desc(activityLog.createdAt))
    .limit(limit)
    .execute();

  return rows.map((row) => ({
    id: row.id,
    action: row.action,
    entityType: row.entityType,
    entityId: row.entityId,
    metadata: row.metadata ?? {},
    createdAt: row.createdAt ?? new Date(),
    actor: row.actorEmail
      ? {
          fullName: row.actorFullName,
          email: row.actorEmail,
          avatarUrl: row.actorAvatar,
        }
      : undefined,
  }));
};

export const getMonthlyRevenue = async (
  organizationId: string,
  monthsBack = 6,
): Promise<MonthlyRevenuePoint[]> => {
  const db = getDbClient();

  const rows = await db
    .select({
      period: sql<string>`to_char(date_trunc('month', ${offers.createdAt}), 'YYYY-MM')`,
      total: sql<string>`
        coalesce(sum(${offerItems.quantity} * ${offerItems.unitPrice}), '0')
      `,
    })
    .from(offers)
    .leftJoin(offerVersions, eq(offers.currentVersionId, offerVersions.id))
    .leftJoin(offerItems, eq(offerVersions.id, offerItems.offerVersionId))
    .where(and(eq(offers.organizationId, organizationId), isNotNull(offers.currentVersionId)))
    .groupBy(sql`date_trunc('month', ${offers.createdAt})`)
    .orderBy(sql`date_trunc('month', ${offers.createdAt}) DESC`)
    .limit(monthsBack)
    .execute();

  return rows
    .map((row) => ({
      period: row.period,
      total: Number(row.total ?? 0),
    }))
    .sort((a, b) => a.period.localeCompare(b.period));
};
