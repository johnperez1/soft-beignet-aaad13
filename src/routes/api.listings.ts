import { createAPIFileRoute } from "@tanstack/react-router/api";
import { db } from "../../db/index.js";
import { marketListings } from "../../db/schema.js";
import { gt } from "drizzle-orm";

export const APIRoute = createAPIFileRoute("/api/listings")({
  GET: async () => {
    const now = new Date();
    const listings = await db
      .select()
      .from(marketListings)
      .where(gt(marketListings.expiresAt, now));
    return Response.json(listings);
  },

  POST: async ({ request }) => {
    const body = await request.json();
    const { sellerId, sellerName, itemName, quantity, priceBerries } = body;

    if (!sellerId || !sellerName || !itemName || !quantity || !priceBerries) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const expiresAt = new Date(Date.now() + 86400000);
    const [listing] = await db
      .insert(marketListings)
      .values({ sellerId, sellerName, itemName, quantity, priceBerries, expiresAt })
      .returning();

    return Response.json(listing, { status: 201 });
  },
});
