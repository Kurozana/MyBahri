# MyBahri Web — Intranet Portal (React PoC)

A proof-of-concept rebuild of the MyBahri intranet portal front page in React, as
the first step of migrating the portal off Mendix for the web front-end (with
React Native planned for mobile). Mendix is expected to remain as a backend for
some services.

## Tech stack

- **React 19 + TypeScript** — typed, component-driven UI
- **Vite** — fast dev server & optimized production builds
- **Tailwind CSS v4** — design tokens live in `src/index.css` (`@theme`)
- **React Router v7** — code-split routes (each page is its own lazy chunk)
- **MSW (dev only)** — mock API layer so pages can be built before the Mendix
  backend is wired up. Excluded from production builds.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build into dist/
npm run preview  # serve the production build locally
```

## Project structure

```
src/
  main.tsx            App bootstrap (starts MSW in dev)
  App.tsx             Router configuration (lazy routes)
  config/nav.ts       Single nav list: sidebar + routes + hover-prefetch
  pages/              Route pages (HomePage is the real one; StubPage is a placeholder)
  components/
    layout/           Persistent shell: Header, Sidebar, Footer, Layout
    home/             Front-page dashboard cards
    ui/               Reusable primitives (Card, Badge, Skeleton, ...)
  services/           Typed API client + data contracts (swap mock -> Mendix here)
  hooks/useApi.ts     Small typed data-fetching hook
  mocks/              MSW handlers (dev-only mock API) — remove once real API is live
  data/home.ts        Static front-page content
```

## Connecting a real backend later

Data access is isolated in `src/services/`. To point at a real Mendix backend,
set `VITE_API_BASE_URL` and add a proxy in `vite.config.ts` — no component
changes required. `src/mocks/` can then be deleted.

## Branch strategy

- **`main`** — mirrors the official, approved Figma design from the design team.
  Kept faithful to what design signs off on.
- **`experimental`** — sandbox for improvising, testing new functionality, and
  trying implementations ahead of / independent of the official design.

When the design team ships new pages, update `main`, then merge `main` into
`experimental` to keep the sandbox current.

## Design assets

`Figma Designed Pages/` holds the source design exports (PNG + SVG) used to build
the UI, kept in-repo as the reference source of truth.
