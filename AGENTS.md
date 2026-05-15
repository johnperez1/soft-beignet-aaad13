# AGENTS.md

OG PUNKz: Pioneer Fields — a browser-based barter economy MMO. The `/` route is a full-screen canvas game. The marketplace uses a Netlify Database (Postgres) backend via API routes.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start (React 19 + Vite 7) |
| Routing | TanStack Router v1 (file-based) |
| Styling | Tailwind CSS 4 |
| Database | Netlify Database (Postgres via Drizzle ORM beta) |
| Language | TypeScript 5 (strict mode) |
| Deployment | Netlify |

## Directory Structure

```
db/
  schema.ts              — Drizzle ORM table definitions (market_listings table)
  index.ts               — Drizzle client (netlify-db adapter, no connection string)
drizzle.config.ts        — Points drizzle-kit output at netlify/database/migrations/
netlify/database/migrations/  — Auto-applied SQL migrations (never edit applied ones)
src/
  routes/
    index.tsx            — Game page: React wrapper + vanilla JS canvas engine
    api.listings.ts      — GET (active listings) + POST (create listing)
    api.listings.$id.ts  — DELETE (remove listing after purchase)
    __root.tsx           — HTML shell, page title "OG PUNKz: Pioneer Fields"
  styles.css             — Global styles: dark background, overflow:hidden for fullscreen
```

## Architecture Decisions

- **Vanilla JS in a React component**: The game engine is imperative canvas code injected as a `<script>` tag inside a `useEffect`. This avoids fighting React's rendering model for 60fps canvas updates while integrating with TanStack Start routing.
- **Player state in localStorage**: Player position, berries, seeds, and reputation are stored client-side per-browser. The marketplace is the only shared persistent surface.
- **Marketplace in Postgres**: `market_listings` rows have a 24-hour `expires_at`. The GET API filters expired rows. Listings survive page refreshes and are visible across all users.
- **AI traders**: Five NPC players simulate random walks client-side. Barter trades with NPCs complete immediately (no server round-trip) and award reputation.

## Coding Conventions

- TypeScript strict mode, `@/` path alias for `src/`
- API routes use `createAPIFileRoute` from `@tanstack/react-router/api`
- DB imports use `.js` extension (ES module compat): `from "../../db/index.js"`
- Drizzle schema: snake_case column name strings, camelCase JS variable names
- **Never run `drizzle-kit migrate` or DDL directly** — Netlify applies migrations on deploy

## Key Files to Edit

| Task | File |
|------|------|
| Add item types / game mechanics | `src/routes/index.tsx` — GAME_SCRIPT constant |
| Add marketplace columns | `db/schema.ts` then `npx drizzle-kit generate` |
| Add API endpoints | New `src/routes/api.*.ts` files |
| Change game visual styles | `src/routes/index.tsx` — GAME_STYLES constant |
| Change page title / meta | `src/routes/__root.tsx` |

## Development Commands

```bash
npm run dev      # Start dev server (port 3000, Netlify CLI on 8888)
npm run build    # Production build
```
