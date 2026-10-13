import {
  boolean,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { resturants } from './resturants.schema';

export const menuCategories = pgTable('menu_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => resturants.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const MenuItems = pgTable('menu_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => menuCategories.id, { onDelete: 'cascade' }),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => resturants.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: text('image_url'),
  isAvailable: boolean('is_available').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type MenuCategory = typeof menuCategories.$inferSelect;
export type NewMenuCategory = typeof menuCategories.$inferInsert;
export type MenuItem = typeof MenuItems.$inferSelect;
export type NewMenuItem = typeof MenuItems.$inferInsert;
