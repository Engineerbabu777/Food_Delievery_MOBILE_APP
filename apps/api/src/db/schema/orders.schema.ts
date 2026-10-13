import { numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { pgEnum } from 'drizzle-orm/pg-core';
import { users } from './user.schema';
import { resturants } from './resturants.schema';
import { MenuItems } from './menu.schema';

export const orderStatusEnum = pgEnum('order_status', [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'READY',
  'PICKED_UP',
  'DELIVERED',
  'CANCELLED',
]);

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  resturantId: uuid('resturant_id')
    .notNull()
    .references(() => resturants.id, { onDelete: 'cascade' }),
  status: orderStatusEnum('status').default('PENDING'),
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  deliveryAddress: text('delivery_address').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  menuItemId: uuid('menu_item_id')
    .notNull()
    .references(() => MenuItems.id, { onDelete: 'cascade' }),
  quantity: numeric('quantity').notNull(),
  unitPrice: numeric('price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
