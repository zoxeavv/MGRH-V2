import { pgTable, uuid, text, timestamp, jsonb, boolean, pgEnum, integer, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['owner', 'member']);
export const clientStatusEnum = pgEnum('client_status', ['active', 'inactive', 'archived']);
export const offerStatusEnum = pgEnum('offer_status', ['draft', 'sent', 'accepted', 'rejected', 'expired']);

// Organizations
export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Users (Supabase auth users, linked via auth.uid)
export const users = pgTable('users', {
  id: uuid('id').primaryKey(), // Maps to auth.users.id
  email: text('email').notNull(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Organization Members (many-to-many)
export const organizationMembers = pgTable('organization_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: userRoleEnum('role').notNull().default('member'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Clients
export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  company: text('company'),
  status: clientStatusEnum('status').notNull().default('active'),
  tags: jsonb('tags').$type<string[]>().default([]),
  notes: jsonb('notes').$type<Array<{ id: string; content: string; createdAt: string; userId: string }>>().default([]),
  files: jsonb('files').$type<Array<{ id: string; name: string; url: string; uploadedAt: string }>>().default([]),
  ownerId: uuid('owner_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Templates
export const templates = pgTable('templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  content: text('content').notNull(), // Markdown content
  sections: jsonb('sections').$type<Array<{ id: string; title: string; content: string; order: number }>>().default([]),
  isDefault: boolean('is_default').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdById: uuid('created_by_id').references(() => users.id),
});

// Offers
export const offers = pgTable('offers', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  clientId: uuid('client_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),
  templateId: uuid('template_id').references(() => templates.id),
  title: text('title').notNull(),
  status: offerStatusEnum('status').notNull().default('draft'),
  items: jsonb('items').$type<Array<{ id: string; name: string; description: string; quantity: number; unitPrice: number }>>().default([]),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).default('0'),
  taxRate: decimal('tax_rate', { precision: 5, scale: 2 }).default('0'),
  total: decimal('total', { precision: 10, scale: 2 }).default('0'),
  validUntil: timestamp('valid_until'),
  sentAt: timestamp('sent_at'),
  acceptedAt: timestamp('accepted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdById: uuid('created_by_id').references(() => users.id),
});

// Relations
export const organizationsRelations = relations(organizations, ({ many }) => ({
  members: many(organizationMembers),
  clients: many(clients),
  templates: many(templates),
  offers: many(offers),
}));

export const usersRelations = relations(users, ({ many }) => ({
  organizationMemberships: many(organizationMembers),
  ownedClients: many(clients),
  createdTemplates: many(templates),
  createdOffers: many(offers),
}));

export const organizationMembersRelations = relations(organizationMembers, ({ one }) => ({
  organization: one(organizations, {
    fields: [organizationMembers.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [organizationMembers.userId],
    references: [users.id],
  }),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [clients.organizationId],
    references: [organizations.id],
  }),
  owner: one(users, {
    fields: [clients.ownerId],
    references: [users.id],
  }),
  offers: many(offers),
}));

export const templatesRelations = relations(templates, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [templates.organizationId],
    references: [organizations.id],
  }),
  createdBy: one(users, {
    fields: [templates.createdById],
    references: [users.id],
  }),
  offers: many(offers),
}));

export const offersRelations = relations(offers, ({ one }) => ({
  organization: one(organizations, {
    fields: [offers.organizationId],
    references: [organizations.id],
  }),
  client: one(clients, {
    fields: [offers.clientId],
    references: [clients.id],
  }),
  template: one(templates, {
    fields: [offers.templateId],
    references: [templates.id],
  }),
  createdBy: one(users, {
    fields: [offers.createdById],
    references: [users.id],
  }),
}));
