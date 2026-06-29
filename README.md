# Kanban Board

A full-featured Kanban board built with React 19, TypeScript, and modern tooling as a front-end test task.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build
npm test           # run unit tests once
npm run test:watch # watch mode
npm run lint       # lint with oxlint
npx playwright test # run E2E tests
```

## Tech choices

| Concern | Tool | Why |
|---|---|---|
| Build | Vite 8 | Instant HMR, native ESM, first-class Tailwind v4 plugin |
| Styling | Tailwind CSS v4 | Utility-first, zero config with `@import "tailwindcss"` |
| Primitives | Radix UI | Headless, accessible, fully controlled |
| Server state | TanStack Query | Declarative fetching, cache, optimistic mutations |
| Client state | Zustand | Minimal boilerplate for UI-only state (modals, filters, toasts) |
| Routing | React Router v7 | De-facto standard, file-based ready |
| Forms | React Hook Form + Zod | Uncontrolled inputs = no re-renders on keystroke; Zod gives type-safe validation |
| Drag-and-drop | @dnd-kit | Actively maintained, accessible, works with Sortable |
| API mock | MSW v2 | Intercepts at network level — real `fetch` calls, swap for real API with zero code changes |
| Unit tests | Vitest + RTL | Same config as Vite, no extra babel; RTL ensures testing user behaviour not internals |
| E2E tests | Playwright | Full browser automation: CRUD, drag-and-drop, filters, keyboard navigation, a11y |
| Dark mode | Tailwind `dark:` + Zustand persist | Class-based toggle, FOUC-free inline script in `index.html`, syncs with system preference |
| CI | GitHub Actions | Two jobs: `unit` (lint + tsc + vitest) and `e2e` (Playwright + browser cache + artifact upload on failure) |

## Architecture

```
src/
├── components/
│   ├── board/      # KanbanBoard, KanbanColumn (memo), TaskCard (memo), FilterBar
│   ├── forms/      # TaskForm (RHF + Zod)
│   ├── layout/     # Header (Live sync badge)
│   ├── ui/         # Button, Input, Select, Dialog, Badge, Avatar, Textarea, Toaster
│   └── ErrorBoundary.tsx
├── hooks/          # useTasks (+ mutations), useLiveSync
├── lib/            # api.ts, constants.ts, utils.ts
├── mocks/          # MSW handlers, in-memory db
├── routes/         # BoardPage (React.lazy)
├── store/          # Zustand UI store, toast store
├── test/           # Vitest + RTL unit tests
└── types/          # Shared TypeScript interfaces
```

**State separation:**
- *Server state* (tasks list) lives entirely in React Query — single source of truth, auto-refetch, optimistic updates on move/delete
- *UI state* (open dialogs, active filters, toasts) lives in Zustand — no server round-trips needed

**Drag-and-drop:**
`@dnd-kit/core` wraps the board; `@dnd-kit/sortable` wraps individual columns. On `dragEnd` an optimistic update patches the local cache immediately while the mocked `POST /api/tasks/:id/move` request completes in the background. If the request fails the cache rolls back.

**Mock backend:**
`src/mocks/db.ts` is a plain in-memory array with full CRUD + reorder logic. MSW intercepts every `/api/*` call with a simulated 300 ms delay. Swapping to a real API means deleting `src/mocks/` and updating `src/lib/api.ts` base URL — no consumer code changes.

**Real-time simulation:**
`useLiveSync` runs a `setInterval` every 15 s that calls `queryClient.invalidateQueries`, causing a background refetch. In production this interval would be replaced with a WebSocket or SSE listener calling the same `invalidateQueries` — zero consumer code changes.

**Error handling:**
`ErrorBoundary` (class component, required by React) wraps `KanbanBoard`. `getDerivedStateFromError` catches render errors and shows a recovery UI; `componentDidCatch` logs to console and is ready for a Sentry hook. The boundary sits below the header so navigation stays usable if the board crashes.

## Trade-offs & what I'd improve

- **Virtualization** — with hundreds of cards per column, `@tanstack/react-virtual` would be added inside `KanbanColumn`
- **Optimistic reorder** — the current optimistic update only patches `columnId`, not the visual order within a column; a full solution would store an explicit `order` field
- **Auth** — no authentication layer; a real app would wrap routes in a `<RequireAuth>` guard and store the JWT in an httpOnly cookie
- **i18n** — `react-i18next` would be added with a `locales/` directory
