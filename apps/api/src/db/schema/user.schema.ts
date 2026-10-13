/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { pgEnum, uuid } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { text } from 'drizzle-orm/pg-core';
import { boolean } from 'drizzle-orm/pg-core';
import { timestamp } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', [
  'CUSTOMER',
  'DRIVER',
  'RESTAURANT',
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password_hash').notNull(),
  role: userRoleEnum('role').notNull(),
  isOnline: boolean('is_online').default(false),
  pushToken: text('push_token'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
