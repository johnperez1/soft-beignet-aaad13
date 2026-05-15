# OG PUNKz: Pioneer Fields

A browser-based barter economy MMO where players explore a 2D world, gather resources, trade with AI-powered NPCs, and participate in a persistent marketplace backed by a real database.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start (React 19 + Vite 7) |
| Routing | TanStack Router v1 (file-based) |
| Styling | Tailwind CSS 4 |
| Database | Netlify Database (Postgres + Drizzle ORM) |
| Language | TypeScript 5 (strict mode) |
| Deployment | Netlify |

## Features

- **Canvas game engine** — 2000×2000 world with smooth camera scrolling
- **Resource gathering** — Click berries and seeds to collect them
- **AI traders** — Five roaming NPC traders you can barter with
- **Persistent marketplace** — List and buy items stored in Postgres (survives refreshes and across users)
- **Player persistence** — Your character, resources, and reputation saved in localStorage
- **Keyboard controls** — WASD or arrow keys to move

## Running Locally

```bash
npm install
npm run dev
```

Requires Node 18+. The Netlify Database connection is provisioned automatically via the Netlify CLI.
