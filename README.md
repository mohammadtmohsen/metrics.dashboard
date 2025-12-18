# Metrics Dashboard

## Project Overview
A Next.js App Router dashboard that consumes REST-style mock APIs to browse datasets, pick metrics, and visualize time-series trends. It couples a centralized API layer with TanStack Query caching, a debounced dataset browser, configurable time ranges, multi-metric Recharts visualization, and inline annotations so the UI mirrors real monitoring workflows while staying front-end only.

## Tech Stack
- Next.js 16 (App Router) with React 19 for routing, layouts, and colocated API routes.
- TypeScript (strict) to keep contracts between services, hooks, and components safe.
- Tailwind CSS 4 for utility-first responsive styling and dark mode support.
- TanStack Query for server-state caching, refetching, and error/loading plumbing.
- Axios for the centralized HTTP client (base URL, headers, interceptors, typed responses).
- Recharts for time-series charting; lucide-react for icons; next-themes for theme toggling.

## Architecture Overview
- `src/app/api` holds the mock backend routes so the frontend and APIs share a domain and deploy together.
- `src/services` is the client-side API layer (axios instance, typed service functions).
- `src/hooks` wraps service calls with TanStack Query for cache keys, retries, and status flags.
- `src/components` contains UI units (datasets, metrics, annotations, layout, common states).
- `src/types` centralizes request/response contracts; `src/providers` configures cross-cutting context.
- API routes live under `app/api` to mirror real REST endpoints without a separate backend, while services stay separate to ensure all network access flows through one typed, interceptable client.

## API Service Layer Design
- Base config: `src/services/api.ts` creates an axios instance with `baseURL: '/api'` and JSON headers.
- Interceptors: request interceptor enforces JSON headers; response interceptor normalizes errors.
- Error handling: `normalizeError` maps Axios errors to user-friendly messages (network, timeout, status) exposed as `NormalizedApiError`.
- Type safety: all calls are fully typed via `src/types/*` and generic axios responses.
- Axios was chosen for first-class interceptor support and concise typed requests/responses.

## Feature Breakdown
### Dataset Browser
- Fetches datasets via `GET /api/datasets?search&status` using `useDatasets`.
- Debounced search (250ms), status filter (all/active/inactive/archived), selectable list.
- Loading skeletons, empty state, and retryable error state are rendered inline.

### Metrics Visualization
- Time range presets (30m, 2h, 24h) plus custom from/to inputs.
- Multi-select metric picker with select-all/deselect-all; defaults to all fields.
- Calls `GET /api/metrics?dataset=<id>&from=<ts>&to=<ts>&fields=<csv>` through `useMetrics`.
- Recharts line chart (`MetricsLineChart`) renders the selected metrics; tooltips and axes format timestamps.
- Loading shows a chart skeleton; errors render a dedicated message; empty ranges show an empty state.

### Annotations
- List fetched via `GET /api/annotations`; create with `POST /api/annotations` (timestamp + text); delete with `DELETE /api/annotations?id=<id>`; queries are invalidated on mutation.
- Annotations render as vertical markers on the chart; current label shows the timestamp (adding hover text for the annotation body would be a next improvement).

## State Management Strategy
- Server state (datasets, metrics, annotations) is handled by TanStack Query with deterministic keys and short retries; default `staleTime` of 60s reduces churn.
- UI state (filters, selected dataset, fields, time range, dialog visibility) stays in local component state to avoid global stores.
- A global store is intentionally avoided to keep scope tight and emphasize server-state caching.

## UX & UI Decisions
- Responsive layout with flex-based columns; dataset browser and annotations collapse when the chart is maximized.
- Skeletons for datasets, metrics, and annotations; empty and error states are explicit.
- Global error boundary at `src/app/error.tsx`; errors logged to console for observability.
- Dark mode via `next-themes` toggle in the header; “Live” badge is a visual cue only.
- Chart focus/maximize toggle hides side panels for a higher-signal view.

## Mock Backend
- Next.js route handlers under `src/app/api` simulate REST endpoints with small artificial delays (500–800ms).
- `/api/datasets` filters by search/status; `/api/metrics` returns deterministic pseudo-random series; `/api/annotations` stores annotations in-memory for the session.
- This replaces a real backend while keeping the client contract RESTful.

## Setup & Run Instructions
1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Open http://localhost:3000 (API endpoints are available at `/api/datasets`, `/api/metrics`, `/api/annotations`).

## Tradeoffs & Non-Goals
- Annotations are in-memory only; they reset on server restart. Persistence was out of scope.
- Delete uses `DELETE /api/annotations?id=<id>` instead of a path param; adapting to `/api/annotations/:id` is straightforward.
- Annotation markers show the timestamp; a hover tooltip with the annotation text is not yet implemented.
- No authentication, streaming, or polling; the “Live” indicator is purely presentational.
- No export/sharing features; focus stayed on the required flows and resilient states.

## Final Notes
The project centers on a clean, layered architecture: typed service layer, query-powered data hooks, and focused UI components with strong loading/error handling. The mock APIs and documentation aim to make expectations clear for reviewers without requiring code diving.
