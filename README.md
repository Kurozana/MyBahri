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

The code is split into a **portable core** (`@core`, zero web/DOM dependencies —
shareable with the future React Native app) and the **web app** (everything else).

```
src/
  core/                 PORTABLE — no web/DOM deps; lifts into packages/core for mobile
    api/
      client.ts         fetch wrapper; base URL injected via configureApi() (backend-agnostic)
      portal.ts         typed data service (getTodos, addTodo, ...)
      types.ts          API data contracts (DTOs)
    hooks/useApi.ts     data-fetching hook (React-only; RN uses React too)
    content/home.ts     static content; icons referenced by string iconKey
    theme/occasions.ts  occasion theme definitions + active-by-date logic

  main.tsx              bootstrap: configureApi() + start MSW in dev
  App.tsx               providers (Occasion, Toast) + router (lazy routes)
  config/nav.ts         single nav list: sidebar + routes + hover-prefetch
  pages/                route pages (HomePage real; StubPage placeholder)
  components/
    layout/             persistent shell: Header, Sidebar, Footer, Layout
    home/               front-page dashboard cards
    ui/                 primitives (Card, Badge, Skeleton, Toast, ThemeToggle, OccasionSwitcher)
  hooks/
    useTheme.ts         light/dark (applies .dark class, persisted)
    useOccasion.tsx     applies occasion overrides as CSS variables
  lib/
    icons.tsx           maps content iconKey -> lucide icons (web-specific)
    cn.ts
  mocks/                MSW handlers (dev-only mock API)
```

## Backend-agnostic data layer

All data access goes through `@core/api`. The base URL is injected once in
`main.tsx` via `configureApi(import.meta.env.VITE_API_BASE_URL ?? '/api')`, so
core carries no build-tool coupling. To point at a real backend (Mendix, Node/
Nest, or a GCP endpoint), set `VITE_API_BASE_URL` and add a proxy in
`vite.config.ts` — no service or component changes. `src/mocks/` can then go.

## Theming

Two independent layers, both driven by CSS variables (defined in `index.css`):

- **Light / dark** — a `.dark` class on `<html>` flips the semantic tokens
  (`surface`, `content`, `line`, …). Toggle in the header, persisted.
- **Occasions** — seasonal skins (National Day, Founding Day, Coffee Day) that
  override a few brand variables at runtime *on top of* the base theme, so they
  never touch the main theme and cost ~nothing (no rebuild, no re-render). They
  auto-activate by date (`getActiveOccasion`) and can be picked manually via the
  header switcher. Definitions live in `@core/theme/occasions.ts` (portable).

## Web + mobile

Anything non-visual (types, API, hooks, content, theme definitions) lives in
`@core` with no DOM/Tailwind dependency, so React Native can reuse it. Only the
UI layer (`components/`, `pages/`, CSS, icon map) is web-specific. When the
mobile app starts, `src/core` lifts into a shared `packages/core` workspace.

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
