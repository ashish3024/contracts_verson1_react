# Contracts Frontend — Next.js

Next.js 14 (App Router) + TypeScript frontend for the Contracts Management System.

## Tech Stack

- **Next.js 14** (App Router) with TypeScript
- **CSS Modules** for component-scoped styles
- **next/font** for optimized Google Fonts
- **Vitest** + Testing Library for unit tests

## Prerequisites

- Node.js 18+
- Backend running at `http://localhost:8000`

### Running without the backend

If you want to run the frontend while the backend is not available, set the environment variable `NEXT_PUBLIC_USE_MOCKS=1` before starting the dev server. This enables a lightweight path-based mock fallback so the UI can render without errors.

Example:

```bash
NEXT_PUBLIC_USE_MOCKS=1 npm run dev
```

## Setup

```bash
npm install
```

## Running the App

```bash
npm run dev
```

App opens at **http://localhost:3000**.

`next.config.js` rewrites all `/api/*` requests to `http://localhost:8000/api/*` — no CORS config needed on your end.

## Running Tests

```bash
npm test
```

## Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with Navbar + fonts
│   ├── globals.css             # Global styles + CSS variables
│   ├── page.tsx                # Home / Dashboard (server component)
│   ├── DashboardClient.tsx     # Dashboard logic (client component)
│   ├── Dashboard.module.css
│   └── contracts/[id]/
│       ├── page.tsx            # Detail page (server component)
│       ├── ContractDetailClient.tsx
│       └── ContractDetail.module.css
├── components/                 # Shared UI components
│   ├── Navbar.tsx
│   ├── StatusBadge.tsx
│   ├── Pagination.tsx
│   ├── Skeleton.tsx
│   └── __tests__/
├── hooks/
│   ├── useContracts.ts
│   ├── useContract.ts
│   └── useDebounce.ts
├── services/
│   └── api.ts                  # All API calls
└── types/
    └── index.ts

## API Assumptions

Expects the standard Spring Boot Page<T> response shape:

GET /api/contracts → { content, totalElements, totalPages, number, size }
GET /api/contracts/:id → Contract object
GET /api/contracts/:id/history → WorkflowHistory[]

Adjust src/services/api.ts and src/types/index.ts if your backend differs.
```
