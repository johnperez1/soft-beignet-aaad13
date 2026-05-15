import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const marketListings = pgTable("market_listings", {
  id: serial().primaryKey(),
  sellerId: text("seller_id").notNull(),
  sellerName: text("seller_name").notNull(),
  itemName: text("item_name").notNull(),
  quantity: integer().notNull(),
  priceBerries: integer("price_berries").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
});
