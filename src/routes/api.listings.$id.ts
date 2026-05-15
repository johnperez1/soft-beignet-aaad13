import { createAPIFileRoute } from "@tanstack/react-router/api";
import { db } from "../../../db/index.js";
import { marketListings } from "../../../db/schema.js";
import { eq } from "drizzle-orm";

export const APIRoute = createAPIFileRoute("/api/listings/$id")({
  DELETE: async ({ params }) => {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return Response.json({ error: "Invalid listing ID" }, { status: 400 });
    }
    await db.delete(marketListings).where(eq(marketListings.id, id));
    return Response.json({ success: true });
  },
});
