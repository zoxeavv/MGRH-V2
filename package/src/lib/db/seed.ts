import 'dotenv/config';

import { randomUUID } from 'crypto';

import { drizzle } from 'drizzle-orm/postgres-js';
import { sql as drizzleSql } from 'drizzle-orm';
import postgres from 'postgres';

import {
  activityLog,
  clients,
  memberships,
  notes,
  offerItems,
  offerVersions,
  offers,
  organizations,
  profiles,
  tasks,
  templates,
  templateAssets,
} from './schema';

type Insert<T> = T extends { $inferInsert: infer I } ? I : never;

const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);

const sampleContacts = [
  { name: 'Alice Johnson', email: 'alice@example.com', phone: '+1-202-555-0114' },
  { name: 'Bobby Rivers', email: 'bobby@example.com', phone: '+1-202-555-0140' },
  { name: 'Carrie Shaw', email: 'carrie@example.com' },
  { name: 'Devon Patel', email: 'devon@example.com', phone: '+1-202-555-0184' },
  { name: 'Evelyn King', email: 'evelyn@example.com' },
];

const clientNames = [
  'Acme Analytics',
  'Brightside Studios',
  'Cobalt Ventures',
  'Delta Holdings',
  'Evergreen Retail',
];

const offerTitles = [
  'Growth Marketing Retainer',
  'Product Strategy Sprint',
  'Design System Refresh',
];

const templateCategories = ['Proposals', 'Reports', 'Briefs'];

const templateTitles = [
  'Brand Strategy Proposal',
  'Quarterly Business Review',
  'Product Launch Brief',
  'Sales Outreach Sequence',
  'Implementation Checklist',
  'Post-launch Report',
];

const waitForConnection = async () => {
  const databaseUrl = process.env.SUPABASE_DB_URL;
  if (!databaseUrl) {
    throw new Error('SUPABASE_DB_URL is required to run the seed script');
  }

  const connection = postgres(databaseUrl, {
    max: 1,
    ssl: databaseUrl.includes('supabase.co')
      ? {
          rejectUnauthorized: false,
        }
      : undefined,
  });

  return { connection, db: drizzle(connection) };
};

const resetTables = async (db: ReturnType<typeof drizzle>) => {
  await db.execute(
    drizzleSql`TRUNCATE TABLE
      activity_log,
      tasks,
      notes,
      template_assets,
      templates,
      offer_items,
      offer_versions,
      offers,
      clients,
      memberships,
      profiles,
      organizations
    RESTART IDENTITY CASCADE`,
  );
};

const main = async () => {
  const { db, connection } = await waitForConnection();
  try {
    await resetTables(db);

    const organizationId = randomUUID();
    const profileId = randomUUID();
    const userId = randomUUID();

    const organization = await db
      .insert(organizations)
      .values({
        id: organizationId,
        name: 'Northwind Labs',
        slug: generateSlug('Northwind Labs'),
        logoUrl: 'https://placehold.co/128x128?text=NL',
      })
      .returning()
      .then(([row]) => row);

    const profile = await db
      .insert(profiles)
      .values({
        id: profileId,
        userId,
        email: 'owner@northwindlabs.io',
        fullName: 'Jordan Baker',
        avatarUrl: 'https://placehold.co/96x96?text=JB',
      })
      .returning()
      .then(([row]) => row);

    await db.insert(memberships).values({
      organizationId: organization.id,
      profileId: profile.id,
      role: 'owner',
      status: 'active',
      invitedEmail: profile.email,
    });

    const clientRows: Insert<typeof clients>[] = clientNames.map((name, index) => ({
      id: randomUUID(),
      organizationId: organization.id,
      createdByProfileId: profile.id,
      name,
      description: `${name} is exploring modern SaaS tooling.`,
      status: index < 2 ? 'active' : 'lead',
      contacts: [sampleContacts[index]],
      tags: ['priority', '2025'],
    }));

    await db.insert(clients).values(clientRows);

    const offersToInsert: Insert<typeof offers>[] = offerTitles.map((title, index) => ({
      id: randomUUID(),
      organizationId: organization.id,
      clientId: clientRows[index % clientRows.length].id,
      createdByProfileId: profile.id,
      title,
      summary: `${title} tailored for ${clientRows[index % clientRows.length].name}`,
      isPublished: index === 0,
    }));

    await db.insert(offers).values(offersToInsert);

    for (const offer of offersToInsert) {
      const versionId = randomUUID();
      const versionNumber = 1;
      await db.insert(offerVersions).values({
        id: versionId,
        offerId: offer.id,
        versionNumber,
        title: `${offer.title} v${versionNumber}`,
        summary: offer.summary,
        createdByProfileId: profile.id,
      });

      await db.insert(offerItems).values([
        {
          id: randomUUID(),
          offerVersionId: versionId,
          name: 'Discovery Workshop',
          description: 'Stakeholder interviews and competitive analysis',
          quantity: 3,
          unitPrice: '1500',
        },
        {
          id: randomUUID(),
          offerVersionId: versionId,
          name: 'Implementation Sprint',
          description: 'Cross-functional delivery sprint with design and engineering',
          quantity: 4,
          unitPrice: '2200',
        },
      ]);

      await db
        .update(offers)
        .set({ currentVersionId: versionId })
        .where(offers.id.equals(offer.id));
    }

    const templateRows: Insert<typeof templates>[] = templateTitles.map((title, index) => ({
      id: randomUUID(),
      organizationId: organization.id,
      createdByProfileId: profile.id,
      title,
      category: templateCategories[index % templateCategories.length],
      content: `# ${title}\n\nThis is a starting point for ${title.toLowerCase()}.`,
      isDraft: index % 2 === 0,
      metadata: {
        tags: ['skeleton', 'sample'],
      },
      previewImageUrl: 'https://placehold.co/640x360?text=Template',
    }));

    await db.insert(templates).values(templateRows);

    await db.insert(templateAssets).values(
      templateRows.slice(0, 3).map((template) => ({
        id: randomUUID(),
        templateId: template.id,
        url: `https://placehold.co/800x400?text=${encodeURIComponent(template.title)}`,
        type: 'image',
      })),
    );

    const notesToInsert: Insert<typeof notes>[] = clientRows.slice(0, 3).map((client, index) => ({
      id: randomUUID(),
      organizationId: organization.id,
      clientId: client.id,
      authorProfileId: profile.id,
      content: `Initial discovery call scheduled for ${client.name}. Agenda item ${index + 1}.`,
      offerId: offersToInsert[index].id,
    }));

    await db.insert(notes).values(notesToInsert);

    const tasksToInsert: Insert<typeof tasks>[] = clientRows.slice(0, 3).map((client, index) => ({
      id: randomUUID(),
      organizationId: organization.id,
      clientId: client.id,
      offerId: offersToInsert[index].id,
      title: `Prepare proposal draft for ${client.name}`,
      description: 'Outline project scope, budget, and key milestones.',
      status: index === 0 ? 'in_progress' : 'todo',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * (index + 3)),
      authorProfileId: profile.id,
      assigneeProfileId: profile.id,
    }));

    await db.insert(tasks).values(tasksToInsert);

    const activityRows: Insert<typeof activityLog>[] = [
      {
        id: randomUUID(),
        organizationId: organization.id,
        actorProfileId: profile.id,
        action: 'created',
        entityType: 'organization',
        entityId: organization.id,
        metadata: { name: organization.name },
      },
      ...clientRows.map((client) => ({
        id: randomUUID(),
        organizationId: organization.id,
        actorProfileId: profile.id,
        action: 'created',
        entityType: 'client',
        entityId: client.id,
        metadata: { name: client.name },
      })),
      ...offersToInsert.map((offer) => ({
        id: randomUUID(),
        organizationId: organization.id,
        actorProfileId: profile.id,
        action: offer.isPublished ? 'published' : 'created',
        entityType: 'offer',
        entityId: offer.id,
        metadata: { title: offer.title },
      })),
      ...templateRows.map((template) => ({
        id: randomUUID(),
        organizationId: organization.id,
        actorProfileId: profile.id,
        action: template.isDraft ? 'created' : 'updated',
        entityType: 'template',
        entityId: template.id,
        metadata: { title: template.title },
      })),
    ];

    await db.insert(activityLog).values(activityRows);

    console.log('✅ Seed data inserted successfully.');
    console.log(`Organization slug: ${organization.slug}`);
    console.log(`Owner email: ${profile.email}`);
  } finally {
    await connection.end({ timeout: 5 });
  }
};

main().catch((error) => {
  console.error('❌ Seed script failed.', error);
  process.exitCode = 1;
});
