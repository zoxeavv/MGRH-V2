import { db } from '../index';
import { clients, offers } from '../schema';
import { eq, and, gte, sql } from 'drizzle-orm';
import { normalizeNumber } from '../../guards';

export interface KPIData {
  newClients: number;
  offersSent: number;
  offersWon: number;
  revenue: number;
}

export async function getKPIs(organizationId: string, days: number = 30): Promise<KPIData> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // New clients (30d)
  const newClientsResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(clients)
    .where(
      and(
        eq(clients.organizationId, organizationId),
        gte(clients.createdAt, startDate)
      )
    );

  const newClients = normalizeNumber(newClientsResult[0]?.count);

  // Offers sent (30d)
  const offersSentResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(offers)
    .where(
      and(
        eq(offers.organizationId, organizationId),
        gte(offers.sentAt, startDate)
      )
    );

  const offersSent = normalizeNumber(offersSentResult[0]?.count);

  // Offers won (30d)
  const offersWonResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(offers)
    .where(
      and(
        eq(offers.organizationId, organizationId),
        eq(offers.status, 'accepted'),
        gte(offers.acceptedAt, startDate)
      )
    );

  const offersWon = normalizeNumber(offersWonResult[0]?.count);

  // Revenue (30d) - sum of accepted offers
  const revenueResult = await db
    .select({ total: sql<number>`coalesce(sum(${offers.total}::numeric), 0)` })
    .from(offers)
    .where(
      and(
        eq(offers.organizationId, organizationId),
        eq(offers.status, 'accepted'),
        gte(offers.acceptedAt, startDate)
      )
    );

  const revenue = normalizeNumber(revenueResult[0]?.total);

  return {
    newClients,
    offersSent,
    offersWon,
    revenue,
  };
}

export interface ActivityEvent {
  id: string;
  type: 'client_created' | 'offer_sent' | 'offer_accepted' | 'offer_rejected';
  description: string;
  date: Date;
}

export async function getActivityTimeline(
  organizationId: string,
  days: number = 30
): Promise<ActivityEvent[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const events: ActivityEvent[] = [];

  // Client created events
  const clientsCreated = await db
    .select()
    .from(clients)
    .where(
      and(
        eq(clients.organizationId, organizationId),
        gte(clients.createdAt, startDate)
      )
    )
    .orderBy(clients.createdAt);

  clientsCreated.forEach((client) => {
    events.push({
      id: `client-${client.id}`,
      type: 'client_created',
      description: `New client: ${client.name}`,
      date: client.createdAt,
    });
  });

  // Offer status changes
  const offersChanged = await db
    .select()
    .from(offers)
    .where(
      and(
        eq(offers.organizationId, organizationId),
        gte(offers.updatedAt, startDate)
      )
    )
    .orderBy(offers.updatedAt);

  offersChanged.forEach((offer) => {
    if (offer.sentAt && offer.sentAt >= startDate) {
      events.push({
        id: `offer-sent-${offer.id}`,
        type: 'offer_sent',
        description: `Offer "${offer.title}" sent`,
        date: offer.sentAt,
      });
    }
    if (offer.acceptedAt && offer.acceptedAt >= startDate) {
      events.push({
        id: `offer-accepted-${offer.id}`,
        type: 'offer_accepted',
        description: `Offer "${offer.title}" accepted`,
        date: offer.acceptedAt,
      });
    }
  });

  // Sort by date descending
  return events.sort((a, b) => b.date.getTime() - a.date.getTime());
}
