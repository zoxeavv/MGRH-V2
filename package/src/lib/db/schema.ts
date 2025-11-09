import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

export const membershipRoleEnum = pgEnum('membership_role', [
  'owner',
  'admin',
  'user',
]);

export const membershipStatusEnum = pgEnum('membership_status', [
  'active',
  'pending',
  'disabled',
]);

export const clientStatusEnum = pgEnum('client_status', [
  'lead',
  'active',
  'inactive',
  'archived',
]);

export const taskStatusEnum = pgEnum('task_status', [
  'todo',
  'in_progress',
  'done',
]);

export const activityEntityEnum = pgEnum('activity_entity', [
  'client',
  'offer',
  'template',
  'membership',
  'organization',
]);

export const activityActionEnum = pgEnum('activity_action', [
  'created',
  'updated',
  'deleted',
  'status_changed',
  'published',
  'duplicated',
  'invited',
]);

export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  logoUrl: text('logo_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (table) => ({
  slugUniqueIdx: uniqueIndex('organizations_slug_unique').on(table.slug),
}));

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  email: text('email').notNull(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (table) => ({
  userUniqueIdx: uniqueIndex('profiles_user_unique').on(table.userId),
  emailUniqueIdx: uniqueIndex('profiles_email_unique').on(table.email),
}));

export const memberships = pgTable(
  'memberships',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    profileId: uuid('profile_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    role: membershipRoleEnum('role').notNull().default('user'),
    status: membershipStatusEnum('status').notNull().default('pending'),
    invitedEmail: text('invited_email'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationProfileUnique: uniqueIndex('memberships_org_profile_unique').on(
      table.organizationId,
      table.profileId,
    ),
    profileIdx: index('memberships_profile_idx').on(table.profileId),
    organizationInvitedEmailUnique: uniqueIndex('memberships_org_invited_email_unique')
      .on(table.organizationId, table.invitedEmail)
      .where(sql`invited_email IS NOT NULL`),
  }),
);

export const clients = pgTable(
  'clients',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    createdByProfileId: uuid('created_by_profile_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'restrict' }),
    name: text('name').notNull(),
    description: text('description'),
    status: clientStatusEnum('status').notNull().default('lead'),
    contacts: jsonb('contacts').$type<
      Array<{
        name: string;
        email: string;
        phone?: string | null;
      }>
    >().notNull(),
    tags: jsonb('tags').$type<string[]>().default(sql`'[]'::jsonb`).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    orgStatusIdx: index('clients_org_status_idx').on(table.organizationId, table.status),
    orgNameIdx: index('clients_org_name_idx').on(table.organizationId, table.name),
  }),
);

export const offers = pgTable(
  'offers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    clientId: uuid('client_id')
      .references(() => clients.id, { onDelete: 'set null' }),
    createdByProfileId: uuid('created_by_profile_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'restrict' }),
    title: text('title').notNull(),
    summary: text('summary'),
    isPublished: boolean('is_published').notNull().default(false),
    currentVersionId: uuid('current_version_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    orgPublishedIdx: index('offers_org_published_idx').on(
      table.organizationId,
      table.isPublished,
    ),
  }),
);

export const offerVersions = pgTable(
  'offer_versions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    offerId: uuid('offer_id')
      .notNull()
      .references(() => offers.id, { onDelete: 'cascade' }),
    versionNumber: integer('version_number').notNull(),
    title: text('title').notNull(),
    summary: text('summary'),
    createdByProfileId: uuid('created_by_profile_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'restrict' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    offerVersionUnique: uniqueIndex('offer_versions_offer_version_unique').on(
      table.offerId,
      table.versionNumber,
    ),
  }),
);

export const offerItems = pgTable('offer_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  offerVersionId: uuid('offer_version_id')
    .notNull()
    .references(() => offerVersions.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  quantity: integer('quantity').notNull().default(1),
  unitPrice: numeric('unit_price', { precision: 12, scale: 2 })
    .notNull()
    .default('0'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const templates = pgTable(
  'templates',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    createdByProfileId: uuid('created_by_profile_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'restrict' }),
    title: text('title').notNull(),
    category: text('category').notNull(),
    content: text('content').notNull(),
    isDraft: boolean('is_draft').notNull().default(true),
    previewImageUrl: text('preview_image_url'),
    metadata: jsonb('metadata')
      .$type<{
        tags?: string[];
      }>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    orgCategoryIdx: index('templates_org_category_idx').on(
      table.organizationId,
      table.category,
    ),
  }),
);

export const templateAssets = pgTable('template_assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  templateId: uuid('template_id')
    .notNull()
    .references(() => templates.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  type: text('type').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const notes = pgTable(
  'notes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    clientId: uuid('client_id').references(() => clients.id, { onDelete: 'cascade' }),
    offerId: uuid('offer_id').references(() => offers.id, { onDelete: 'cascade' }),
    authorProfileId: uuid('author_profile_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'restrict' }),
    content: text('content').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    orgClientIdx: index('notes_org_client_idx').on(table.organizationId, table.clientId),
    orgOfferIdx: index('notes_org_offer_idx').on(table.organizationId, table.offerId),
    targetCheck: check(
      'notes_requires_client_or_offer',
      sql`client_id IS NOT NULL OR offer_id IS NOT NULL`,
    ),
  }),
);

export const tasks = pgTable(
  'tasks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    clientId: uuid('client_id').references(() => clients.id, { onDelete: 'cascade' }),
    offerId: uuid('offer_id').references(() => offers.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    status: taskStatusEnum('status').notNull().default('todo'),
    dueDate: timestamp('due_date', { withTimezone: true }),
    authorProfileId: uuid('author_profile_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'restrict' }),
    assigneeProfileId: uuid('assignee_profile_id').references(() => profiles.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    orgStatusIdx: index('tasks_org_status_idx').on(table.organizationId, table.status),
    targetCheck: check(
      'tasks_requires_client_or_offer',
      sql`client_id IS NOT NULL OR offer_id IS NOT NULL`,
    ),
  }),
);

export const activityLog = pgTable(
  'activity_log',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    actorProfileId: uuid('actor_profile_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'restrict' }),
    action: activityActionEnum('action').notNull(),
    entityType: activityEntityEnum('entity_type').notNull(),
    entityId: uuid('entity_id').notNull(),
    metadata: jsonb('metadata')
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdx: index('activity_log_org_idx').on(table.organizationId),
  }),
);

