# REST API–Driven Metrics Dashboard

Frontend Implementation Instructions

---

## 1. Objective

Build a **responsive metrics dashboard** using **React with Next.js** that visualizes
time-series data from REST APIs.

The primary evaluation focus is on:

* API service architecture
* Robust data fetching and state handling
* TypeScript correctness and structure
* Clean, scalable frontend architecture
* Loading, error, and empty states

Visual accuracy is important, but **code quality and architectural decisions are the top priority**.

---

## 2. Technical Requirements

### Required

* **Next.js 14+** (App Router)
* **React 18+**
* **TypeScript** (strict mode)
* **REST APIs** (mocked)
* **Centralized API service layer**
* **Responsive layout**

### Allowed / Recommended

* Axios (preferred) or Fetch
* TanStack Query (React Query)
* Recharts or Chart.js
* Tailwind CSS
* UI utility libraries if needed

### Not Required

* Backend or database
* Authentication / authorization
* Real-time streaming or WebSockets

---

## 3. Architectural Overview

The application follows a **layered architecture**:

1. **API Service Layer**
   Centralized HTTP handling with interceptors and typed contracts.

2. **Data Fetching Layer (Hooks)**
   Server-state management and caching.

3. **UI Components**
   Stateless and reusable where possible.

4. **Mock API Layer**
   Next.js route handlers simulating real REST endpoints.

---

## 4. Project Structure

```txt
src/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx                 # Dashboard page
│  ├─ api/                     # Mock REST APIs
│  │  ├─ datasets/route.ts
│  │  ├─ metrics/route.ts
│  │  └─ annotations/route.ts
│
├─ services/                   # API service layer
│  ├─ api.ts                   # Axios instance + interceptors
│  ├─ datasets.service.ts
│  ├─ metrics.service.ts
│  └─ annotations.service.ts
│
├─ hooks/                      # Data-fetching hooks
│  ├─ useDatasets.ts
│  ├─ useMetrics.ts
│  └─ useAnnotations.ts
│
├─ components/
│  ├─ layout/                  # Header, sidebar
│  ├─ datasets/                # Dataset browser
│  ├─ metrics/                 # Chart & toolbar
│  ├─ annotations/             # Annotation UI
│  └─ common/                  # Loader, error, empty states
│
├─ types/                      # Shared TypeScript models
│  ├─ dataset.ts
│  ├─ metrics.ts
│  └─ annotation.ts
│
├─ utils/
│  ├─ debounce.ts
│  └─ time.ts
```

---

## 5. API Service Layer (Critical)

### Responsibilities

* Central Axios instance
* Base URL and headers
* Request/response interceptors
* Normalized error handling
* Typed request/response models

### Rules

* All HTTP calls **must go through the service layer**
* No direct `fetch` / `axios` usage in components
* Errors must be transformed into **user-friendly messages**

---

## 6. Data Fetching Strategy

* **TanStack Query** is used for server-state management:

  * Datasets
  * Metrics
  * Annotations
* Query keys must be deterministic and parameter-based
* UI-only state (filters, selections) is handled with local state

---

## 7. Features

### 7.1 Dataset Browser (Sidebar)

**Functionality**

* Fetch dataset list
* Debounced search input
* Status filter: `active | inactive | archived`
* Loading skeleton
* Error and empty states

**API**

```
GET /api/datasets?search=<query>&status=<status>
```

---

### 7.2 Metrics Visualization

**Functionality**

* Time range selector:

  * 30 minutes
  * 2 hours
  * 24 hours
  * Custom range
* Multi-select metric picker
* Time-series chart
* Loading and error states

**Metrics**

* REQUESTS
* ERRORS
* P50_LATENCY
* P95_LATENCY
* P99_LATENCY

**API**

```
GET /api/metrics
  ?dataset=<id>
  &from=<timestamp>
  &to=<timestamp>
  &fields=<comma-separated>
```

---

### 7.3 Annotations

**Functionality**

* Create annotation (timestamp + label)
* Delete annotation
* Render chart markers with hover tooltips

**APIs**

```
POST /api/annotations
DELETE /api/annotations/:id
```

---

## 8. Styling & Theming

### Styling

* Tailwind CSS is used for layout and styling
* A **minimal semantic color palette** may be defined for consistency
* No full design system is required

### Theme Support (Bonus)

* Light and dark themes supported using Tailwind `dark` mode
* Theme toggled via UI control
* User preference persisted in `localStorage`
* Theme affects visuals only (no logic or data changes)

---

## 9. Dashboard Header Controls (Clarification)

### 9.1 Theme Toggle

* Light / Dark UI preference
* Implemented via Tailwind dark mode
* No impact on data or business logic

### 9.2 Layout / View Toggle (Optional)

* UI-only enhancement
* May collapse or expand the dataset sidebar
* No persistence required
* No impact on data fetching

### 9.3 “Live” Indicator

* Represents real-time monitoring dashboards conceptually
* Implemented as a **visual indicator only**
* No polling, WebSockets, or real-time updates
* Real-time behavior is intentionally out of scope

---

## 10. UX & States (Mandatory)

* Skeleton loaders for all async data
* Graceful error handling everywhere
* Clear empty states
* Responsive layout (desktop & mobile)
* Error boundaries at layout level

---

## 11. Development Principles

* TypeScript strict mode enabled
* Separation of concerns
* Hooks handle data, components handle rendering
* Readable, maintainable code
* Predictable and explainable data flow

---

## 12. Non-Goals (Out of Scope)

* Authentication / authorization
* Real backend services
* Real-time streaming
* Complex design systems
* Pixel-perfect UI polish

---

## 13. Deliverables

* Public GitHub repository or ZIP archive
* `.gitignore` included
* `README.md` describing:

  * Setup instructions
  * Architectural decisions
  * Tradeoffs and assumptions

---

## 14. Scope Philosophy

The implementation prioritizes:

* Correctness over feature volume
* Clear scope boundaries
* Production-ready structure without over-engineering

Features implying advanced backend or infrastructure are represented visually
only when appropriate.
