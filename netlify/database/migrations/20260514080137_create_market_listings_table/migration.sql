CREATE TABLE "market_listings" (
	"id" serial PRIMARY KEY,
	"seller_id" text NOT NULL,
	"seller_name" text NOT NULL,
	"item_name" text NOT NULL,
	"quantity" integer NOT NULL,
	"price_berries" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp NOT NULL
);
