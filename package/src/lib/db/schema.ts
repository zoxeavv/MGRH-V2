import { pgTable, uuid, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// CRM Users table - separate from Supabase auth.users
// This table stores extended user profile data for the CRM application
export const crmUsers = pgTable(
  'crm_users',
  {
    id: uuid('id').primaryKey(),
    email: text('email').notNull(),
    fullName: text('full_name'),
    avatarUrl: text('avatar_url'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    emailUnique: uniqueIndex('crm_users_email_unique').on(table.email),
  }),
);
