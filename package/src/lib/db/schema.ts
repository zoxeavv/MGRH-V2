import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

// Enums
export const roleEnum = pgEnum("role", ["owner", "member", "viewer"]);
export const clientStatusEnum = pgEnum("client_status", [
  "active",
  "inactive",
  "prospect",
  "archived",
]);
export const offerStatusEnum = pgEnum("offer_status", [
  "draft",
  "sent",
  "accepted",
  "rejected",
  "expired",
]);

// Organizations
export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Users (Supabase auth users, referenced by id)
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Organization members (many-to-many)
export const organizationMembers = pgTable("organization_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: roleEnum("role").notNull().default("member"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Clients
export const clients = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  company: text("company"),
  status: clientStatusEnum("status").notNull().default("prospect"),
  tags: jsonb("tags").$type<string[]>().default([]),
  notes: jsonb("notes").$type<Array<{ id: string; content: string; createdAt: string; userId: string }>>().default([]),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  ownerId: uuid("owner_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Offers
export const offers = pgTable("offers", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  status: offerStatusEnum("status").notNull().default("draft"),
  items: jsonb("items").$type<Array<{ id: string; name: string; quantity: number; price: number }>>().default([]),
  subtotal: text("subtotal").notNull().default("0"),
  tax: text("tax").default("0"),
  total: text("total").notNull().default("0"),
  currency: text("currency").notNull().default("USD"),
  validUntil: timestamp("valid_until"),
  sentAt: timestamp("sent_at"),
  acceptedAt: timestamp("accepted_at"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdById: uuid("created_by_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Templates
export const templates = pgTable("templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  content: text("content").notNull(),
  category: text("category"),
  isPublic: boolean("is_public").notNull().default(false),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdById: uuid("created_by_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Type exports
export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type OrganizationMember = typeof organizationMembers.$inferSelect;
export type NewOrganizationMember = typeof organizationMembers.$inferInsert;
export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
export type Offer = typeof offers.$inferSelect;
export type NewOffer = typeof offers.$inferInsert;
export type Template = typeof templates.$inferSelect;
export type NewTemplate = typeof templates.$inferInsert;
