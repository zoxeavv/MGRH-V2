import {
  boolean,
  check,
  index,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

export const membershipRoleEnum = pgEnum('membership_role', ['owner', 'admin', 'user']);
export const membershipStatusEnum = pgEnum('membership_status', ['active', 'pending', 'disabled']);

export const clientStatusEnum = pgEnum('client_status', ['lead', 'active', 'inactive', 'archived']);

export const taskStatusEnum = pgEnum('task_status', ['todo', 'in_progress', 'done']);

export const activityActionEnum = pgEnum('activity_action', [
  'created',
  'updated',
  'deleted',
  'status_changed',
  'published',
  'duplicated',
  'invited',
]);

export const activityEntityEnum = pgEnum('activity_entity', [
  'client',
  'offer',
  'template',
  'membership',
  'organization',
]);

export type ClientContact = {
  name: string;
  email?: string;
  phone?: string;
  title?: string;
};

export type TemplateMetadata = {
  tags?: string[];
};

export const organizations = pgTable(
  'organizations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    slug: varchar('slug', { length: 128 }).notNull(),
    logoUrl: text('logo_url'),
    primaryColor: varchar('primary_color', { length: 32 }),
    secondaryColor: varchar('secondary_color', { length: 32 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    slugIdx: uniqueIndex('organizations_slug_unique').on(table.slug),
    createdAtIdx: index('organizations_created_at_idx').on(table.createdAt),
  }),
);

export const profiles = pgTable(
  'profiles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    email: varchar('email', { length: 256 }).notNull(),
    fullName: varchar('full_name', { length: 256 }),
    avatarUrl: text('avatar_url'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdx: uniqueIndex('profiles_user_id_unique').on(table.userId),
    emailIdx: index('profiles_email_idx').on(table.email),
  }),
);

export const memberships = pgTable(
  'memberships',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    profileId: uuid('profile_id').references(() => profiles.id, { onDelete: 'cascade' }),
    role: membershipRoleEnum('role').notNull().default('user'),
    status: membershipStatusEnum('status').notNull().default('active'),
    invitedEmail: varchar('invited_email', { length: 256 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    orgProfileUnique: uniqueIndex('memberships_org_profile_unique').on(
      table.organizationId,
      table.profileId,
    ),
    orgStatusIdx: index('memberships_org_status_idx').on(table.organizationId, table.status),
    invitedEmailIdx: index('memberships_invited_email_idx').on(table.invitedEmail),
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
    name: varchar('name', { length: 256 }).notNull(),
    description: text('description'),
    status: clientStatusEnum('status').notNull().default('lead'),
    contacts: jsonb('contacts').$type<ClientContact[]>().notNull().default(sql`'[]'::jsonb`),
    tags: jsonb('tags').$type<string[]>().notNull().default(sql`'[]'::jsonb`),
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
      .notNull()
      .references(() => clients.id, { onDelete: 'cascade' }),
    createdByProfileId: uuid('created_by_profile_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'restrict' }),
    title: varchar('title', { length: 256 }).notNull(),
    summary: text('summary'),
    isPublished: boolean('is_published').notNull().default(false),
    currentVersionId: uuid('current_version_id').references(() => offerVersions.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    orgClientIdx: index('offers_org_client_idx').on(table.organizationId, table.clientId),
    orgPublishedIdx: index('offers_org_published_idx').on(table.organizationId, table.isPublished),
  }),
);

export const offerVersions = pgTable(
  'offer_versions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    offerId: uuid('offer_id')
      .notNull()
      .references(() => offers.id, { onDelete: 'cascade' }),
    versionNumber: smallint('version_number').notNull(),
    title: varchar('title', { length: 256 }).notNull(),
    summary: text('summary'),
    createdByProfileId: uuid('created_by_profile_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'restrict' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    offerVersionUnique: uniqueIndex('offer_versions_offer_number_unique').on(
      table.offerId,
      table.versionNumber,
    ),
    createdAtIdx: index('offer_versions_created_at_idx').on(table.createdAt),
  }),
);

export const offerItems = pgTable(
  'offer_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    offerVersionId: uuid('offer_version_id')
      .notNull()
      .references(() => offerVersions.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 256 }).notNull(),
    description: text('description'),
    quantity: numeric('quantity', { precision: 12, scale: 2 }).notNull().default('1'),
    unitPrice: numeric('unit_price', { precision: 12, scale: 2 }).notNull().default('0'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    versionIdx: index('offer_items_version_idx').on(table.offerVersionId),
  }),
);

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
    title: varchar('title', { length: 256 }).notNull(),
    category: varchar('category', { length: 128 }),
    content: text('content').notNull(),
    isDraft: boolean('is_draft').notNull().default(true),
    previewImageUrl: text('preview_image_url'),
    metadata: jsonb('metadata').$type<TemplateMetadata>().notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    orgCategoryIdx: index('templates_org_category_idx').on(table.organizationId, table.category),
    orgDraftIdx: index('templates_org_draft_idx').on(table.organizationId, table.isDraft),
  }),
);

export const templateAssets = pgTable(
  'template_assets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    templateId: uuid('template_id')
      .notNull()
      .references(() => templates.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    type: varchar('type', { length: 128 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    templateIdx: index('template_assets_template_idx').on(table.templateId),
  }),
);

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
    organizationIdx: index('notes_org_idx').on(table.organizationId, table.createdAt),
    clientIdx: index('notes_client_idx').on(table.clientId),
    offerIdx: index('notes_offer_idx').on(table.offerId),
    targetCheck: check(
      'notes_target_check',
      sql`((notes.client_id IS NOT NULL)::int + (notes.offer_id IS NOT NULL)::int) = 1`,
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
    title: varchar('title', { length: 256 }).notNull(),
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
    organizationIdx: index('tasks_org_status_idx').on(table.organizationId, table.status),
    dueDateIdx: index('tasks_due_date_idx').on(table.dueDate),
    assigneeIdx: index('tasks_assignee_idx').on(table.assigneeProfileId),
    targetCheck: check(
      'tasks_target_check',
      sql`((tasks.client_id IS NOT NULL)::int + (tasks.offer_id IS NOT NULL)::int) = 1`,
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
    metadata: jsonb('metadata').$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgCreatedIdx: index('activity_log_org_created_idx').on(table.organizationId, table.createdAt),
    actorIdx: index('activity_log_actor_idx').on(table.actorProfileId),
  }),
);

export const organizationsRelations = relations(organizations, ({ many }) => ({
  memberships: many(memberships),
  clients: many(clients),
  offers: many(offers),
  templates: many(templates),
  notes: many(notes),
  tasks: many(tasks),
  activityLog: many(activityLog),
}));

export const profilesRelations = relations(profiles, ({ many }) => ({
  memberships: many(memberships),
  offersCreated: many(offers),
  offerVersionsCreated: many(offerVersions),
  templatesCreated: many(templates),
  templateAssets: many(templateAssets),
  notesAuthored: many(notes),
  tasksAuthored: many(tasks),
  tasksAssigned: many(tasks),
  activities: many(activityLog),
}));

export const membershipsRelations = relations(memberships, ({ one }) => ({
  organization: one(organizations, {
    fields: [memberships.organizationId],
    references: [organizations.id],
  }),
  profile: one(profiles, {
    fields: [memberships.profileId],
    references: [profiles.id],
  }),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [clients.organizationId],
    references: [organizations.id],
  }),
  createdBy: one(profiles, {
    fields: [clients.createdByProfileId],
    references: [profiles.id],
  }),
  offers: many(offers),
  notes: many(notes),
  tasks: many(tasks),
  activityLog: many(activityLog),
}));

export const offersRelations = relations(offers, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [offers.organizationId],
    references: [organizations.id],
  }),
  client: one(clients, {
    fields: [offers.clientId],
    references: [clients.id],
  }),
  createdBy: one(profiles, {
    fields: [offers.createdByProfileId],
    references: [profiles.id],
  }),
  currentVersion: one(offerVersions, {
    fields: [offers.currentVersionId],
    references: [offerVersions.id],
  }),
  versions: many(offerVersions),
  items: many(offerItems),
  notes: many(notes),
  tasks: many(tasks),
  activityLog: many(activityLog),
}));

export const offerVersionsRelations = relations(offerVersions, ({ one, many }) => ({
  offer: one(offers, {
    fields: [offerVersions.offerId],
    references: [offers.id],
  }),
  createdBy: one(profiles, {
    fields: [offerVersions.createdByProfileId],
    references: [profiles.id],
  }),
  items: many(offerItems),
}));

export const offerItemsRelations = relations(offerItems, ({ one }) => ({
  offerVersion: one(offerVersions, {
    fields: [offerItems.offerVersionId],
    references: [offerVersions.id],
  }),
}));

export const templatesRelations = relations(templates, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [templates.organizationId],
    references: [organizations.id],
  }),
  createdBy: one(profiles, {
    fields: [templates.createdByProfileId],
    references: [profiles.id],
  }),
  assets: many(templateAssets),
  activityLog: many(activityLog),
}));

export const templateAssetsRelations = relations(templateAssets, ({ one }) => ({
  template: one(templates, {
    fields: [templateAssets.templateId],
    references: [templates.id],
  }),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  organization: one(organizations, {
    fields: [notes.organizationId],
    references: [organizations.id],
  }),
  client: one(clients, {
    fields: [notes.clientId],
    references: [clients.id],
  }),
  offer: one(offers, {
    fields: [notes.offerId],
    references: [offers.id],
  }),
  author: one(profiles, {
    fields: [notes.authorProfileId],
    references: [profiles.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  organization: one(organizations, {
    fields: [tasks.organizationId],
    references: [organizations.id],
  }),
  client: one(clients, {
    fields: [tasks.clientId],
    references: [clients.id],
  }),
  offer: one(offers, {
    fields: [tasks.offerId],
    references: [offers.id],
  }),
  author: one(profiles, {
    fields: [tasks.authorProfileId],
    references: [profiles.id],
  }),
  assignee: one(profiles, {
    fields: [tasks.assigneeProfileId],
    references: [profiles.id],
  }),
}));

export const activityLogRelations = relations(activityLog, ({ one }) => ({
  organization: one(organizations, {
    fields: [activityLog.organizationId],
    references: [organizations.id],
  }),
  actor: one(profiles, {
    fields: [activityLog.actorProfileId],
    references: [profiles.id],
  }),
}));

export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

export type Membership = typeof memberships.$inferSelect;
export type NewMembership = typeof memberships.$inferInsert;

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;

export type Offer = typeof offers.$inferSelect;
export type NewOffer = typeof offers.$inferInsert;

export type OfferVersion = typeof offerVersions.$inferSelect;
export type NewOfferVersion = typeof offerVersions.$inferInsert;

export type OfferItem = typeof offerItems.$inferSelect;
export type NewOfferItem = typeof offerItems.$inferInsert;

export type Template = typeof templates.$inferSelect;
export type NewTemplate = typeof templates.$inferInsert;

export type TemplateAsset = typeof templateAssets.$inferSelect;
export type NewTemplateAsset = typeof templateAssets.$inferInsert;

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;

export type Activity = typeof activityLog.$inferSelect;
export type NewActivity = typeof activityLog.$inferInsert;
