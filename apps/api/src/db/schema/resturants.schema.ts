import { text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { boolean, pgTable } from 'drizzle-orm/pg-core';
import { users } from './user.schema';

export const resturants = pgTable('resturants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  isOpen: boolean('is_open').notNull().default(true),
  rating: text('rating').default('0'),
  cuisineType: text('cuisine_type').notNull(),
  address: text('address').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Resturant = typeof resturants.$inferSelect;
export type NewResturant = typeof resturants.$inferInsert;