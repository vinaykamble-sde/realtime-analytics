# FinanceOps Real-Time Analytics (Nx Monorepo)

A real-time payment analytics dashboard built with Next.js + Redux Toolkit + RTK Query on the frontend and NestJS + MongoDB + Socket.io on the backend. It streams live payment events, shows KPIs, and renders interactive charts.

## Table of Contents
- Overview
- Features
- Architecture
- Getting Started
- Running the Apps
- API & Contracts
- Frontend Notes
- Alerting & Performance
- Project Structure
- Testing & Linting
- Troubleshooting
- Future Improvements

## Overview
- **Monorepo:** Nx (integrated)  
- **Frontend:** Next.js 16 (App Router), MUI, Recharts, Redux Toolkit + RTK Query, Socket.io client  
- **Backend:** NestJS 11, Socket.io gateway, MongoDB via Mongoose  
- **Real-time:** WS namespace `/payments`, invalidates RTK Query caches on updates  
- **Shared types:** `@org/shared-types` for API/WS data models  

## Features
- Live metrics grid: total volume, success rate, average amount, top method, peak hour
- Trend chart: day/week/month toggle, CSV export, full-screen view
- Live events feed: auto-scroll with pause, clickable details modal, CSV export
- Alerting: failure spike, volume spike, low success rate → toast notifications
- Responsive, minimal earth-tone UI theme

## Architecture
- **Apps**
  - `web`: Next.js app (app router) consuming REST + WS
  - `api`: NestJS service exposing REST + Socket.io
- **Libs**
  - `shared-types`: common TypeScript interfaces (PaymentEvent, PaymentMetrics, TrendData, etc.)
  - `utils`: client-side helpers (alerts, CSV export)
- **Data flow**
  - REST: `GET /api/analytics/metrics`, `GET /api/analytics/trends?period=day|week|month`
  - WS: namespace `/payments` emits `payment-event` and `metrics-update`
  - Frontend listens to WS → updates event feed + invalidates RTK Query caches → UI refreshes

## Getting Started

### Prerequisites
- Node.js 18+ (recommended 20)
- npm (bundled) or pnpm/yarn if you prefer
- MongoDB running locally (or a reachable MongoDB URI)

### Install
```bash
npm install
```

### Environment
Create `.env` at repo root for the API (Nest):
```
MONGODB_URI=mongodb://localhost:27017/financeops
PORT=3000            # optional, defaults to 3000
```
Frontend currently points to `http://localhost:3000/api` and WS `ws://localhost:3000/payments`. If you run API on another host/port, adjust those in `web/src/store/analytics.api.ts` and `web/src/components/EventsFeed.tsx`.

## Running the Apps

Because both API and Next default to port 3000, run the web app on a different port (e.g., 4200).

From repo root (Nx inferred targets):
```bash
# Start API (Nest + WS on :3000)
npx nx serve api

# In another terminal: start Web (Next dev on :4200)
npx nx dev web --port=4200
```

If Nx inference ever fails, you can fallback to direct Next dev from `web/` (add `dev` script if needed):
```bash
cd web
npx next dev --port 4200
```

Open the UI at `http://localhost:4200`.

## API & Contracts
- **REST**
  - `GET /api/analytics/metrics` → `PaymentMetrics`
  - `GET /api/analytics/trends?period=day|week|month` → `TrendData[]`
- **WebSocket (namespace `/payments`)**
  - Events:
    - `payment-event` → `PaymentEvent`
    - `metrics-update` → `PaymentMetrics`
- **Shared types**: see `shared-types/` for `PaymentEvent`, `PaymentMetrics`, `TrendData`.

## Frontend Notes
- **State**: Redux Toolkit + RTK Query for metrics/trends; WS triggers cache invalidation.
- **UI**: MUI with custom earth-tone theme (`web/src/theme/theme.tsx`), CSS baseline, responsive grid layouts.
- **Charts**: Recharts line chart with period toggle, CSV export, full-screen dialog.
- **Events**: Clickable rows open `EventDetailModal`; pause/resume; CSV export.

## Alerting & Performance
- Alert detectors (`web/src/utils/alerts.ts`):
  - Failure spike (>=20% recent failures)
  - Volume spike (>=1.5x previous volume)
  - Low success rate (<80%)
- Toast notifications via MUI `Snackbar` on the main page.
- Performance:
  - Throttled WS event batching in `EventsFeed`
  - Memoized chart data and metric cards
  - Minimal shadows/borders for a lightweight UI

## Project Structure
```
api/                NestJS service (REST + WS)
web/                Next.js app (App Router)
  src/app/          Layouts/pages
  src/components/   Dashboard UI (MetricsGrid, TrendChart, EventsFeed, EventDetailModal)
  src/store/        Redux + RTK Query
  src/theme/        MUI theme (earth tones)
  src/utils/        CSV export + alert helpers
shared-types/       Shared TypeScript interfaces
utils/              Shared utilities (if extended)
```

## Testing & Linting
```bash
# Lint (Nx inferred target)
npx nx lint web
npx nx lint api

# Unit tests (if/when added)
npx nx test web
npx nx test api
```

## Troubleshooting
- **Port conflicts**: Run web on `--port 4200` (API uses 3000).
- **Mongo connection**: Ensure `MONGODB_URI` points to a running MongoDB.
- **WS issues**: Verify the WS namespace `/payments` is reachable (`ws://localhost:3000/payments`).

## Future Improvements
- Add seed scripts for MongoDB.
- Add scripts in `web/package.json` for `dev/build/start`.
- Add CI (lint/test/build) and Docker Compose for API + Web + MongoDB.
- Expose configurable API/WS base URLs via environment variables for the web app.
- Add CSV/PNG export for charts, plus anomaly highlighting on the chart.