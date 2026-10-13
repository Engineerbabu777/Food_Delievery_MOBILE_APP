import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { orders } from './orders.schema';
import { users } from './user.schema';
import { resturants } from './resturants.schema';

export const reviewStatusEnum = pgEnum('review_status', [
  'pending',
  'approved',
  'rejected',
]);

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  customerId: uuid('customer_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  resturantId: uuid('resturant_id')
    .notNull()
    .references(() => resturants.id, { onDelete: 'cascade' }),
  resturantRating: integer('resturant_rating').notNull(),
  comment: text('comment').notNull(),
  driverId: uuid('driver_id').references(() => users.id, {
    onDelete: 'cascade',
  }),
  driverRating: integer('driver_rating').notNull(),

  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Review = InferSelectModel<typeof reviews>;
export type NewReview = InferInsertModel<typeof reviews>;
