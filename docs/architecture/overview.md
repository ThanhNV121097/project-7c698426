# Architecture Overview

Project: `hello-word-8`
Shape: fullstack — frontend, backend, PostgreSQL.

## 1. Goal

Deliver one public page that shows stored text `Hello Word` centered on plain white screen. Text must come from PostgreSQL through backend API, not from frontend constants.

## 2. Stack

| Part | Choice | Version / convention | Why |
|---|---|---|---|
| Frontend | Next.js App Router | Next.js 15, TypeScript, Tailwind v3 | Default UI stack, SSR-capable, matches committed container contract. |
| Backend | Go HTTP server | Go 1.22+ | Small binary, stdlib HTTP, simple service boundary. |
| Database | PostgreSQL | 16 in local compose | Required by SRS because greeting row persists. |
| Runtime | Docker Compose | root `docker-compose.yml` | One command boots DB, backend, frontend. |
| CI | Existing `.github/workflows/ci.yml` | build, vet, test, lint, token checks | Workflow is repository-owned and read-only to agents. |

## 3. Repository layout

```text
code/
  backend/
    cmd/api/main.go              # backend entrypoint and HTTP routes
    internal/migrations/          # embedded SQL migration runner
    migrations/                   # timestamped .up.sql/.down.sql files
    go.mod / go.sum
    .env.example
    Dockerfile
  frontend/
    app/layout.tsx                # App Router root layout
    app/page.tsx                  # composition root; stories add components here
    app/globals.css               # frozen shared tokens and base styles
    package.json / package-lock.json
    next.config.js
    tailwind.config.ts
    postcss.config.js
    tsconfig.json
    .env.example
    Dockerfile
docs/
  architecture/
    overview.md
    erd.md
    services.md
  home/SRS.md
```

## 4. Runtime data flow

1. Browser opens frontend.
2. Frontend page calls backend `GET /v1/greeting` through `NEXT_PUBLIC_API_URL`.
3. Backend reads PostgreSQL row from `greetings`.
4. Backend returns JSON payload.
5. Frontend renders returned text centered.

No auth, sessions, cookies, uploads, background jobs, or admin flows.

## 5. Backend boundary

Backend owns:

- reading `DATABASE_URL` from environment at startup;
- applying all pending SQL migrations before serving traffic;
- checking DB with `SELECT 1` for `/healthz`;
- exposing versioned API paths under `/v1/...`;
- returning one shared JSON error envelope.

Backend does not own HTML rendering or client visual state.

## 6. Frontend boundary

Frontend owns:

- App Router shell and route composition;
- fetching greeting API response;
- rendering default and error states from SRS;
- using only tokens defined in `app/globals.css` and traceable to `design/design-system.md`.

`app/page.tsx` stays Server Component composition root. Components using browser APIs or event handlers must start with literal first line `"use client"`.

## 7. Persistence

PostgreSQL stores one row in `greetings`. ERD details live in `docs/architecture/erd.md`. Migrations live under `code/backend/migrations/` and run on every backend boot. Re-running migrations is no-op because applied filenames are tracked in `schema_migrations`.

## 8. Environment variables

### Backend — `code/backend/.env.example`

| Key | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | yes | PostgreSQL connection string injected by runtime. |
| `PORT` | yes | HTTP listen port; falls back to `APP_PORT`, then `8080`. |
| `APP_PORT` | no | Legacy fallback port name. |

### Frontend — `code/frontend/.env.example`

| Key | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | yes | Browser-visible backend base URL. |

### Root compose — `.env.example`

| Key | Required | Purpose |
|---|---|---|
| `POSTGRES_USER` | local | Local DB user. |
| `POSTGRES_PASSWORD` | local | Local DB password. |
| `POSTGRES_DB` | local | Local DB name. |
| `BACKEND_PORT` | no | Host port for backend. |
| `FRONTEND_PORT` | no | Host port for frontend. |
| `NEXT_PUBLIC_API_URL` | no | Browser API URL for local frontend build. |

No secrets are committed. `.env` files stay ignored.

## 9. Naming conventions

| Thing | Convention |
|---|---|
| Go packages | short lowercase names; one main package under `cmd/api`. |
| API paths | `/v1/{resource}` without `/api` prefix. |
| JSON fields | lower camelCase. |
| SQL tables | plural snake_case. |
| SQL columns | snake_case. |
| React components | `export default function ComponentName()`. |
| Frontend files | App Router routes under `app/`; story components under `components/`. |
| CSS tokens | custom properties from design system only; no fallbacks. |

## 10. Error handling

Backend returns:

```json
{
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

External messages stay generic. Internal logs may include operational detail, never secrets.

Frontend shows generic error state when backend, database, or greeting row fails. No stale hardcoded greeting fallback.

## 11. Security

- No authentication needed; endpoint is public read-only.
- No user input exists in current scope.
- SQL uses parameterized queries once dynamic input exists; current read query has no user parameters.
- Database URL never logged.
- Health check proves migrations and database connectivity before service is healthy.

## 12. Observability

Use Go standard logger for startup, migration, and fatal server errors. No external telemetry in scaffold; add only when product has operational need.

## 13. Run locally

```bash
cp .env.example .env
docker compose up --build
```

Default URLs:

- Frontend: `http://localhost:3000`
- Backend health: `http://localhost:8080/healthz`
- Greeting API: `http://localhost:8080/v1/greeting`

## 14. Direct checks

Backend:

```bash
cd code/backend
go build ./...
go vet ./...
go test ./...
```

Frontend:

```bash
cd code/frontend
npm ci
npm run lint
npm run build
npm test --if-present
```

## 15. Decisions

| Decision | Rejected alternative | Tradeoff |
|---|---|---|
| Fullstack shape | Static page with hardcoded text | Static is simpler but violates SRS storage/API proof. |
| Self-migrating backend | Separate migration command | Separate command is cleaner for large systems but runtime creates empty DB and has no migration step. |
| Go stdlib HTTP mux | Add router dependency | Router adds no value for two endpoints. |
| PostgreSQL migration table | Rerun all SQL every boot | Tracking filenames avoids duplicate insert/table errors. |
| Next.js App Router | Plain static HTML | App Router matches project convention and build pipeline. |
| Tailwind installed but visual baseline in CSS tokens | Tailwind-only utility values | Tokens are CI-checkable against design system. |
| Public read-only API | Auth gate | Auth adds scope and contradicts public SRS actor. |
| Generic error envelope | Per-endpoint ad hoc errors | Single envelope avoids reviewer-invented contracts. |

## 16. Risks and constraints

| Risk | Mitigation |
|---|---|
| Missing seed row causes blank page | Migration inserts required `Hello Word` row. |
| Compose service name drift | Backend uses `postgres` host only in compose-provided `DATABASE_URL`. |
| Token drift from design system | CI compares `globals.css` token names to `design/design-system.md`. |
| Frontend start failure | `package.json` includes required `start` script. |
| Embed path mistake | Migration embed lives in `internal/migrations` with relative path to SQL files avoided by reading from disk at runtime. |

## 17. Out of scope

- Editing greeting text.
- Multiple greetings.
- Authentication.
- Analytics.
- Animation.
- Admin UI.
