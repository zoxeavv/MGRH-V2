import {
  pgEnum,
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  boolean,
  integer,
  decimal,
  check,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel, relations } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export const orgRoleEnum = pgEnum('org_role', ['owner', 'admin', 'user']);

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

export const taskStatusEnum = pgEnum('task_status', ['todo', 'in_progress', 'done']);

export const offerActionEnum = pgEnum('activity_action', [
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

export const organizations = pgTable(
  'organizations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    logoUrl: text('logo_url'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => sql`now()`),
  },
  (table) => ({
    slugIdx: uniqueIndex('organizations_slug_idx').on(table.slug),
  }),
);

export const profiles = pgTable(
  'profiles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    email: text('email').notNull(),
    fullName: text('full_name'),
    avatarUrl: text('avatar_url'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => sql`now()`),
  },
  (table) => ({
    userIdx: uniqueIndex('profiles_user_idx').on(table.userId),
    emailIdx: uniqueIndex('profiles_email_idx').on(table.email),
  }),
);

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
    role: orgRoleEnum('role').default('user').notNull(),
    status: membershipStatusEnum('status').default('pending').notNull(),
    invitedEmail: text('invited_email'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => sql`now()`),
  },
  (table) => ({
    organizationProfileIdx: uniqueIndex('memberships_org_profile_idx').on(
      table.organizationId,
      table.profileId,
    ),
    organizationStatusIdx: index('memberships_org_status_idx').on(
      table.organizationId,
      table.status,
    ),
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
    status: clientStatusEnum('status').default('lead').notNull(),
    contacts: jsonb('contacts').$type<Array<Record<string, unknown>>>().default(sql`'[]'::jsonb`).notNull(),
    tags: jsonb('tags').$type<Array<string>>().default(sql`'[]'::jsonb`).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => sql`now()`),
  },
  (table) => ({
    organizationStatusIdx: index('clients_org_status_idx').on(table.organizationId, table.status),
    organizationNameIdx: index('clients_org_name_idx').on(table.organizationId, table.name),
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
    title: text('title').notNull(),
    summary: text('summary'),
    isPublished: boolean('is_published').default(false).notNull(),
    currentVersionId: uuid('current_version_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => sql`now()`),
  },
  (table) => ({
    organizationPublishedIdx: index('offers_org_published_idx').on(
      table.organizationId,
      table.isPublished,
    ),
    organizationClientIdx: index('offers_org_client_idx').on(table.organizationId, table.clientId),
    currentVersionIdx: index('offers_current_version_idx').on(table.currentVersionId),
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
    offerVersionUniqueIdx: uniqueIndex('offer_versions_offer_version_number_idx').on(
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
  unitPrice: decimal('unit_price', { precision: 12, scale: 2 }).notNull().default('0'),
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
    category: text('category'),
    content: text('content').notNull(),
    isDraft: boolean('is_draft').default(true).notNull(),
    previewImageUrl: text('preview_image_url'),
    metadata: jsonb('metadata')
      .$type<{ tags?: string[] }>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => sql`now()`),
  },
  (table) => ({
    organizationDraftIdx: index('templates_org_draft_idx').on(table.organizationId, table.isDraft),
    organizationCategoryIdx: index('templates_org_category_idx').on(
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
      .notNull()
      .$onUpdate(() => sql`now()`),
  },
  (table) => ({
    organizationCreatedIdx: index('notes_org_created_idx').on(table.organizationId, table.createdAt),
    onlyOneTargetCheck: check(
      'notes_target_check',
      sql`
        (CASE WHEN ${table.clientId} IS NULL THEN 0 ELSE 1 END) +
        (CASE WHEN ${table.offerId} IS NULL THEN 0 ELSE 1 END) = 1
      `,
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
    status: taskStatusEnum('status').default('todo').notNull(),
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
      .notNull()
      .$onUpdate(() => sql`now()`),
  },
  (table) => ({
    organizationStatusIdx: index('tasks_org_status_idx').on(table.organizationId, table.status),
    dueDateIdx: index('tasks_org_due_date_idx').on(table.organizationId, table.dueDate),
    onlyOneTargetCheck: check(
      'tasks_target_check',
      sql`
        (CASE WHEN ${table.clientId} IS NULL THEN 0 ELSE 1 END) +
        (CASE WHEN ${table.offerId} IS NULL THEN 0 ELSE 1 END) = 1
      `,
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
    action: offerActionEnum('action').notNull(),
    entityType: activityEntityEnum('entity_type').notNull(),
    entityId: uuid('entity_id').notNull(),
    metadata: jsonb('metadata')
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    organizationCreatedIdx: index('activity_log_org_created_idx').on(
      table.organizationId,
      table.createdAt,
    ),
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
  createdClients: many(clients, { relationName: 'clientCreator' }),
  createdOffers: many(offers, { relationName: 'offerCreator' }),
  createdOfferVersions: many(offerVersions, { relationName: 'offerVersionCreator' }),
  createdTemplates: many(templates, { relationName: 'templateCreator' }),
  authoredNotes: many(notes, { relationName: 'noteAuthor' }),
  authoredTasks: many(tasks, { relationName: 'taskAuthor' }),
  assignedTasks: many(tasks, { relationName: 'taskAssignee' }),
  activity: many(activityLog, { relationName: 'activityActor' }),
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
    relationName: 'clientCreator',
  }),
  offers: many(offers),
  notes: many(notes),
  tasks: many(tasks),
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
    relationName: 'offerCreator',
  }),
  currentVersion: one(offerVersions, {
    fields: [offers.currentVersionId],
    references: [offerVersions.id],
  }),
  versions: many(offerVersions),
  tasks: many(tasks),
  notes: many(notes),
}));

export const offerVersionsRelations = relations(offerVersions, ({ one, many }) => ({
  offer: one(offers, {
    fields: [offerVersions.offerId],
    references: [offers.id],
  }),
  createdBy: one(profiles, {
    fields: [offerVersions.createdByProfileId],
    references: [profiles.id],
    relationName: 'offerVersionCreator',
  }),
  items: many(offerItems),
}));

export const offerItemsRelations = relations(offerItems, ({ one }) => ({
  version: one(offerVersions, {
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
    relationName: 'templateCreator',
  }),
  assets: many(templateAssets),
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
    relationName: 'noteAuthor',
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
    relationName: 'taskAuthor',
  }),
  assignee: one(profiles, {
    fields: [tasks.assigneeProfileId],
    references: [profiles.id],
    relationName: 'taskAssignee',
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
    relationName: 'activityActor',
  }),
}));

export type Organization = InferSelectModel<typeof organizations>;
export type OrganizationInsert = InferInsertModel<typeof organizations>;
export type Profile = InferSelectModel<typeof profiles>;
export type ProfileInsert = InferInsertModel<typeof profiles>;
export type Membership = InferSelectModel<typeof memberships>;
export type MembershipInsert = InferInsertModel<typeof memberships>;
export type Client = InferSelectModel<typeof clients>;
export type ClientInsert = InferInsertModel<typeof clients>;
export type Offer = InferSelectModel<typeof offers>;
export type OfferInsert = InferInsertModel<typeof offers>;
export type OfferVersion = InferSelectModel<typeof offerVersions>;
export type OfferVersionInsert = InferInsertModel<typeof offerVersions>;
export type OfferItem = InferSelectModel<typeof offerItems>;
export type OfferItemInsert = InferInsertModel<typeof offerItems>;
export type Template = InferSelectModel<typeof templates>;
export type TemplateInsert = InferInsertModel<typeof templates>;
export type TemplateAsset = InferSelectModel<typeof templateAssets>;
export type TemplateAssetInsert = InferInsertModel<typeof templateAssets>;
export type Note = InferSelectModel<typeof notes>;
export type NoteInsert = InferInsertModel<typeof notes>;
export type Task = InferSelectModel<typeof tasks>;
export type TaskInsert = InferInsertModel<typeof tasks>;
export type ActivityLog = InferSelectModel<typeof activityLog>;
export type ActivityLogInsert = InferInsertModel<typeof activityLog>;
