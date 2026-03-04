# GoalKeeper — Cursor Agent Build Prompt
### Full-Stack PWA: React Frontend + Go Backend
### Environments: Local · Dev · Production

---

## PREAMBLE — READ THIS BEFORE ANYTHING ELSE

You are a senior full-stack engineer being asked to build **GoalKeeper** end-to-end from scratch: a mobile-first Progressive Web Application that gamifies personal goal and task management with cooperative community accountability mechanics.

You have access to two source-of-truth documents:
- **GoalKeeper PRD v1.0** — product requirements, user stories, functional specs
- **GoalKeeper LLD v1.0** — complete frontend and backend implementation blueprints

**You must treat both documents as binding contracts.** Do not deviate from the architecture, naming conventions, data models, API contracts, or event system design defined in them unless you have surfaced an unresolvable technical conflict and received explicit instruction to adapt.

---

## PHASE 0 — REQUIRED DECISIONS (ASK BEFORE WRITING A SINGLE LINE OF CODE)

Before you create any files, directories, configs, or code, you must ask the user the following questions **in a single, clearly numbered list**. Do not proceed until all answers are received. Group them clearly.

---

### BLOCK A — Infrastructure & Hosting (Critical Path)

**A1. Auth Provider**
Which auth provider should be used?
- (a) Supabase Auth — includes DB hosting, storage, and auth in one platform, simplest setup
- (b) Clerk — superior DX for auth UI, webhooks, and session management; requires separate DB
- (c) Custom JWT with Golang — full control, most complex to build and maintain

**A2. Primary Database Hosting**
Where should PostgreSQL be hosted?
- (a) Supabase (managed Postgres + built-in RLS tooling + storage) — recommended for MVP
- (b) Railway (managed Postgres, simpler pricing)
- (c) Neon (serverless Postgres, great for dev/prod parity)
- (d) AWS RDS / GCP Cloud SQL (production-grade, higher ops overhead)

**A3. File / Media Storage**
Where should proof photos and user media be stored?
- (a) Supabase Storage (if using Supabase for DB — zero extra config)
- (b) Cloudflare R2 (S3-compatible, no egress fees — recommended if not on Supabase)
- (c) AWS S3

**A4. Backend Deployment Target**
Where should the Go microservices be deployed?
- (a) Railway (simplest, good for MVP and dev — single config file per service)
- (b) Render (similar to Railway, generous free tier)
- (c) Fly.io (edge-native, great latency, slightly more config)
- (d) GCP Cloud Run (serverless containers, scales to zero, production-grade)
- (e) AWS ECS + Fargate (most mature, highest ops overhead)

**A5. Frontend Deployment**
Where should the React PWA be deployed?
- (a) Vercel (zero-config, excellent PWA support, preview deployments per PR)
- (b) Cloudflare Pages (fastest global CDN, great PWA support)
- (c) Netlify

**A6. Redis**
Which Redis provider should be used?
- (a) Upstash (serverless Redis, free tier, HTTP API — recommended for MVP)
- (b) Railway Redis add-on
- (c) AWS ElastiCache / GCP Memorystore (production-grade, higher cost)

**A7. NATS / Event Bus**
Which async messaging system should be used?
- (a) NATS JetStream (as specified in LLD — self-hosted on Railway/Fly, recommended)
- (b) Managed NATS via Synadia NGS (hosted, paid)
- (c) Google Pub/Sub (managed, if deploying on GCP)
- (d) Skip for MVP — implement async flows as synchronous calls initially, add NATS in Phase 2

---

### BLOCK B — Product Decisions (Affects Code Structure)

**B1. Monorepo Tooling**
- (a) Turborepo (recommended — caching, parallel builds, Go + TS workspaces)
- (b) Nx
- (c) Plain pnpm workspaces (no orchestration layer)

**B2. Go Service Architecture for MVP**
The LLD specifies 10 microservices. For MVP, should these be:
- (a) True separate services from day one (separate repos-in-monorepo, separate deployments) — production-correct but complex to wire initially
- (b) A single Go monolith with the same internal package structure as the LLD services, split into real microservices in Phase 2 — faster to ship, easier to refactor with clean boundaries already drawn
- (c) 3 grouped services: core-svc (users+goals+tasks), community-svc, gamification-svc — middle ground

**B3. Monetisation (affects store and reward logic)**
- (a) Fully free at launch — no paywalls, all features open
- (b) Freemium — solo mode free, community features require a paid plan
- (c) Free app + cosmetic store only (coins only, no real money)
Answer (c) is the LLD default. Confirm or change.

**B4. Solo XP Penalty**
The LLD defaults solo mode XP to 60% of community rates. Confirm or adjust:
- (a) Keep 60% default
- (b) Different percentage: ____%
- (c) No penalty — solo and community earn equal XP (reduces community incentive)

**B5. Buddy XP Ratio Default**
The LLD defaults buddy verification reward to 30% of task XP. Confirm or adjust:
- (a) Keep 30% default
- (b) Different percentage: ____%

**B6. Proof Media Retention**
How long should uploaded proof photos/files be retained in storage?
- (a) 90 days
- (b) 180 days
- (c) 1 year
- (d) Indefinitely (highest storage cost)

**B7. Community Max Member Cap Default**
- (a) 500 members (LLD default)
- (b) 100 members
- (c) Unlimited (not recommended — degrades leaderboard quality)

---

### BLOCK C — Development Workflow

**C1. Local development orchestration**
- (a) Docker Compose for all services including DB, Redis, NATS (full local stack, recommended)
- (b) Only DB and Redis in Docker; Go services run natively with `go run`
- (c) Devcontainer (VS Code / Cursor devcontainer.json)

**C2. Environment count**
- (a) Two environments: local + production (simplest)
- (b) Three environments: local + dev/staging + production (recommended for a team)

**C3. CI/CD**
- (a) GitHub Actions (recommended, free for public repos)
- (b) GitLab CI
- (c) No CI/CD for now — set up manually

**C4. Domain name**
What is the base domain for the app?
- Enter your domain (e.g., `goalkeeper.app`) or type `tbd` to use platform-generated URLs for now.

---

**WAIT FOR ALL ANSWERS BEFORE PROCEEDING.**
Once you have answers to all A, B, and C questions, confirm them back to the user in a structured summary and ask for a final "go ahead" before creating any files.

---

## PHASE 1 — PROJECT SCAFFOLD

Once decisions are confirmed, execute the following in strict order. Do not skip steps. Confirm completion of each phase before starting the next.

### 1.1 Monorepo Initialisation

```
goalkeeper/
├── apps/
│   └── web/                  # React PWA
├── services/
│   └── [service-name]/       # Go services (per B2 decision)
├── packages/
│   ├── api-types/            # Generated TypeScript types
│   └── ui/                   # Shared React component library
├── infra/
│   ├── docker/               # Dockerfiles per service
│   ├── compose/              # docker-compose files per environment
│   ├── k8s/                  # Kubernetes manifests (prod)
│   └── migrations/           # Flyway SQL migrations
├── tools/
│   └── openapi-gen/          # OpenAPI → types codegen
├── .env.example              # All env vars documented, no secrets
├── .env.local.example
├── .env.dev.example
├── .env.prod.example
└── turbo.json / pnpm-workspace.yaml
```

**Rules:**
- Every environment must have its own `.env.[env]` file. Never commit secrets.
- `.env.example` files must document every variable with a description comment.
- Use `direnv` or `dotenv` conventions — document which tool to use in README.

---

### 1.2 Environment Variable Manifest

Create and populate all `.env.*.example` files before writing any service code. Every service must read config exclusively from environment variables — no hardcoded values anywhere in the codebase.

Required variables to define across environments:

**Database**
```
DATABASE_URL=postgresql://user:pass@host:5432/goalkeeper
DATABASE_POOL_MAX=20
DATABASE_POOL_MIN=2
```

**Redis**
```
REDIS_URL=redis://localhost:6379
REDIS_TLS=false          # true in prod
```

**NATS**
```
NATS_URL=nats://localhost:4222
NATS_STREAM_NAME=GOALKEEPER
```

**Auth**
```
AUTH_PROVIDER=supabase|clerk        # from A1 decision
AUTH_JWKS_URL=https://.../.well-known/jwks.json
AUTH_AUDIENCE=goalkeeper-api
AUTH_ISSUER=https://...
AUTH_WEBHOOK_SECRET=...
```

**Storage**
```
STORAGE_PROVIDER=supabase|r2|s3
STORAGE_BUCKET_PROOFS=gk-proofs
STORAGE_BUCKET_AVATARS=gk-avatars
STORAGE_CDN_BASE_URL=https://...
# For R2/S3:
STORAGE_ACCESS_KEY_ID=...
STORAGE_SECRET_ACCESS_KEY=...
STORAGE_ENDPOINT=...
STORAGE_REGION=...
```

**Firebase (Push Notifications)**
```
FIREBASE_PROJECT_ID=...
FIREBASE_SERVICE_ACCOUNT_JSON=...   # base64 encoded
```

**Services (internal gRPC endpoints)**
```
USERS_GRPC_ADDR=users-svc:9000
GOALS_GRPC_ADDR=goals-svc:9000
TASKS_GRPC_ADDR=tasks-svc:9000
COMMUNITY_GRPC_ADDR=community-svc:9000
GAMIFICATION_GRPC_ADDR=gamification-svc:9000
VERIFICATION_GRPC_ADDR=verification-svc:9000
```

**Frontend**
```
VITE_API_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_VAPID_KEY=...
VITE_APP_ENV=local|dev|prod
```

**App Config**
```
PORT=8080
LOG_LEVEL=debug|info|warn|error
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
SOLO_XP_RATIO=0.60
BUDDY_XP_RATIO=0.30
BUDDY_ROTATION_DAYS=14
VERIFICATION_WINDOW_HRS=24
PROOF_RETENTION_DAYS=90
MAX_COMMUNITY_MEMBERS=500
```

---

### 1.3 Docker Compose (Local)

Create `infra/compose/docker-compose.local.yml`:

**Must include:**
- `postgres:16-alpine` — with init scripts mounting `infra/migrations/`
- `redis:7-alpine`
- NATS with JetStream enabled (`-js` flag)
- All Go services (built from Dockerfiles)
- React frontend dev server (Vite with hot reload)
- `adminer` or `pgweb` for local DB browsing
- Jaeger all-in-one for local tracing
- Prometheus + Grafana for local metrics

**Health checks required on every service.**
**Named volumes for Postgres and Redis data persistence across restarts.**

Create `infra/compose/docker-compose.dev.yml` (overrides for dev/staging cloud env — services point to managed cloud DB/Redis/NATS, only app services run in containers).

---

### 1.4 Database Migrations

Use Flyway (or golang-migrate — choose one, document it). All migrations live in `infra/migrations/`.

**Migration naming convention:** `V{version}__{description}.sql`
Example: `V001__create_users.sql`, `V002__create_goals.sql`

**Create migrations in this order** (respects FK dependencies):
1. `users`
2. `communities`
3. `community_members`
4. `goal_library`
5. `goals`
6. `tasks`
7. `task_instances` (partitioned by month — create initial 6 monthly partitions)
8. `buddy_assignments`
9. `proof_submissions`
10. `xp_ledger` (partitioned — create initial 12 monthly partitions)
11. `store_items`
12. `user_inventory`
13. `tags`
14. `fcm_tokens`
15. `notifications`

**After each table, create its indexes.** After all tables, apply RLS policies as specified in LLD Section 12.2.

Include a `V999__seed_dev_data.sql` with realistic seed data for local and dev environments only — never run in prod. Seed data must include:
- 5 test users with varying levels/XP
- 3 goals (mix of private and community)
- 10 tasks (mix of one-time and recurring)
- 2 communities
- 1 fully paired buddy assignment
- 5 store items across rarity tiers
- 10 open goal library entries

---

## PHASE 2 — BACKEND IMPLEMENTATION

### 2.1 Go Shared Packages First

Build `pkg/` packages **before** any service, in this order. Each package must be fully tested before the next is started.

**Order:**
1. `pkg/errcode` — domain error registry, HTTP status mapping, RFC 7807 response builder
2. `pkg/logger` — zerolog wrapper, request-scoped field injection
3. `pkg/validator` — go-validator v10 wrapper, custom rules (`future` date, etc.)
4. `pkg/db` — pgxpool factory, transaction helper, RLS context setter (`SET LOCAL app.user_id`)
5. `pkg/cache` — go-redis v9 client factory, typed helpers for ZSET, hash, string, pipeline
6. `pkg/auth` — JWKS fetcher + RS256 verifier, revocation checker, claims type
7. `pkg/nats` — JetStream client factory, typed publisher, consumer helper, dead-letter handler
8. `pkg/tracer` — OpenTelemetry setup, OTLP exporter, span helpers
9. `pkg/pagination` — opaque cursor encoder/decoder (base64 JSON `{id, created_at}`)
10. `pkg/storage` — provider-agnostic interface + implementations for Supabase/R2/S3

**For each package:** write the interface first, then the implementation, then unit tests. Aim for 85%+ coverage on pkg packages.

---

### 2.2 Service Implementation Order

Build services in dependency order — never build a consumer before its dependency:

```
1. users-service         (no external service deps)
2. goals-service         (depends on users)
3. tasks-service         (depends on goals, users)
4. gamification-service  (event consumer — depends on tasks events)
5. verification-service  (depends on tasks, community)
6. community-service     (depends on users, goals, gamification events)
7. store-service         (depends on users)
8. notification-service  (event consumer — depends on all services' events)
9. search-service        (depends on goals, communities)
10. analytics-service    (event consumer — depends on all)
```

### 2.3 Per-Service Implementation Rules

For **every** service, implement in this strict internal order:

```
1. domain/          — types, errors, constants (no imports from other internal packages)
2. repository/      — SQL queries, Redis ops (testable with testcontainers)
3. service/         — business logic (no DB/Redis imports — only repository interfaces)
4. handler/         — HTTP + gRPC handlers (no business logic, only parse → call service → respond)
5. events/          — NATS publishers and consumers
6. middleware/      — auth, logging, metrics, rate limiting, recovery
7. cmd/server/      — wire everything, start servers
```

**Never** put business logic in handlers. **Never** put SQL in service layer. Enforce this strictly.

---

### 2.4 Critical Backend Implementation Details

#### tasks-service: Recurrence Engine
- Implement `RecurrenceRule` struct with JSON serialisation exactly as in LLD Section 6.1
- Expander job must be idempotent — use `ON CONFLICT DO NOTHING` on task_instance insert
- Support: daily, weekly (by day), monthly (by date), custom cron
- Always expand 90 days ahead from `last_expanded_at`
- Run expander on service start (catch-up) then every 24h via ticker

#### tasks-service: State Machine
- Implement as explicit transition table — no ad-hoc status mutations in handler code
- Every invalid transition must return `errcode.ErrInvalidTransition` with the current state in the error detail
- Every valid transition must publish the corresponding NATS event

#### community-service: Buddy Assignment
- Implement both round-robin and smart (level + timezone scoring) strategies behind a feature flag (`SMART_MATCH_ENABLED=true|false`)
- Waiting queue must be a PostgreSQL table (`buddy_waiting_queue`) — not in-memory
- Rotation job must be idempotent — safe to run multiple times

#### gamification-service: XP Engine
- All XP awards go through `xp_ledger` first — `users.total_xp` is a derived cache, updated via trigger or explicit update
- Level formula: `level = max(1, floor((-1 + sqrt(1 + 8*totalXP/250)) / 2))`
- Streak logic: compare `last_active_date` to yesterday UTC; increment or reset
- All XP operations must be atomic — use DB transactions

#### verification-service: Proof Upload
- Validate file type (image/jpeg, image/png, image/webp only) and size (max 5MB pre-upload)
- Generate pre-signed upload URL — never accept binary in the API body for large files
- Store only CDN URLs in `proof_submissions.media_urls` — never raw storage bucket paths

---

### 2.5 Background Jobs

Implement all jobs from LLD Section 15. Each job must:
- Be registered in the service's `cmd/server/main.go` with a configurable interval (env var)
- Log start, completion, and item count processed per run
- Be individually disableable via env var (`JOB_RECURRENCE_EXPANDER_ENABLED=true`)
- Never panic — recover all errors and log them

**Job implementations:**
```
tasks-svc:
  - task-reminder-dispatcher    TASK_REMINDER_INTERVAL=5m
  - recurrence-expander         RECURRENCE_EXPANDER_INTERVAL=24h
  - task-window-opener          TASK_WINDOW_OPENER_INTERVAL=2m
  - task-missed-checker         TASK_MISSED_CHECKER_INTERVAL=5m

verification-svc:
  - proof-auto-approver         PROOF_AUTO_APPROVER_INTERVAL=15m

community-svc:
  - buddy-rotation-processor    BUDDY_ROTATION_INTERVAL=1h
  - leaderboard-monthly-close   (cron: 0 0 1 * *)

gamification-svc:
  - streak-daily-reset          (cron: 5 0 * * *)

analytics-svc:
  - analytics-aggregator        ANALYTICS_AGGREGATOR_INTERVAL=1h

search-svc:
  - search-indexer              SEARCH_INDEXER_INTERVAL=30m

verification-svc:
  - proof-media-gc              (cron: 0 3 * * 0)
```

---

### 2.6 API Standards

Every API endpoint must:
- Return errors in RFC 7807 format: `{ "type": "...", "title": "...", "status": 400, "detail": "...", "instance": "/v1/..." }`
- Include `X-Request-ID` header in every response (generated if not provided)
- Include `X-RateLimit-Remaining` header
- Validate all inputs before passing to service layer
- Use cursor-based pagination for all list endpoints — never offset pagination
- Set `Cache-Control` headers appropriately on GET responses
- Return `ETag` on resource GETs; support `If-None-Match` for conditional requests

---

## PHASE 3 — FRONTEND IMPLEMENTATION

### 3.1 Project Setup

```bash
cd apps/web
pnpm create vite . --template react-ts
```

Install all packages from LLD Section 2.1 with exact version pins. Generate `pnpm-lock.yaml` and commit it.

Configure:
- `tsconfig.json` — strict mode, path aliases (`@/` → `src/`)
- `tailwind.config.ts` — custom GoalKeeper design tokens (colours, spacing, animation)
- `vite.config.ts` — PWA plugin (Workbox), path aliases, env var prefix `VITE_`
- `vite-plugin-pwa` — manifest, Service Worker, offline fallback page
- ESLint + Prettier with strict rules
- Vitest config

---

### 3.2 Design Token System

Define GoalKeeper's visual identity in Tailwind config as CSS custom properties. Do not hardcode colours anywhere in components.

```
Primary:    #1A3C6E  (deep navy)
Accent:     #2D9CDB  (sky blue)
Success:    #27AE60  (emerald)
Warning:    #F2994A  (amber)
Danger:     #EB5757  (coral red)
Purple:     #8B5CF6  (level/gamification)
Dark BG:    #0F172A  (dark mode background)
Card BG:    #1E293B  (dark mode card)
```

All semantic tokens must work in both light and dark mode via `dark:` variants.

---

### 3.3 Implementation Order (Frontend)

Build in this order — each layer depends on the previous:

```
1. Design System (packages/ui)
   - GKButton, GKCard, GKAvatar, GKBadge, GKXPBar, GKCoinCounter,
     GKProgressRing, GKStreak, GKTagChip, GKTaskCard (base),
     GKGoalCard (base), GKModal, GKBottomSheet, GKToast

2. Auth flow
   - AuthLayout, Login screen, Register screen, AuthCallback
   - AuthStore (Zustand), token refresh logic, route guards

3. API client layer
   - Axios instance + interceptors
   - All resource modules (goals, tasks, community, gamification, store, proofs, notifications)
   - React Query config + key factory

4. AppShell + navigation
   - Bottom navigation bar (mobile), sidebar (desktop)
   - Top bar with XP bar, coins, notifications
   - UIStore, theme switching

5. Dashboard screen (SCR-02)

6. Goal screens (SCR-03: list, detail, create, edit)

7. Task Configuration (SCR-04: form modal)

8. Calendar View (SCR-05: week/day/month + drag-and-drop)

9. Community screens (SCR-06, SCR-07: hub, detail, admin)

10. Buddy Panel (SCR-08)

11. Proof flow (SCR-09: submission, SCR-10: review)

12. Leaderboard (SCR-11)

13. Reward Store (SCR-12)

14. User Profile (SCR-13)

15. Goal Library (SCR-14)

16. Notification Center (SCR-15)

17. Settings (SCR-16)

18. Gamification overlays (XP toast, level-up celebration, streak animation)

19. Analytics Dashboard (SCR-17) — Phase 4

20. PWA: Service Worker, offline page, install prompt, push notification registration
```

---

### 3.4 Critical Frontend Implementation Details

#### PWA Manifest
```json
{
  "name": "GoalKeeper",
  "short_name": "GoalKeeper",
  "description": "Turn your goals into a co-op adventure",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#1A3C6E",
  "background_color": "#0F172A",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```

#### Service Worker Strategies (Workbox)
Implement exactly as specified in LLD Section 2.7:
- App shell: `CacheFirst`
- API GETs: `NetworkFirst` with 5s timeout, fallback to cache
- Static assets: `CacheFirst` with 30-day expiry
- Media: `StaleWhileRevalidate`
- Mutations offline: Background Sync queue to IndexedDB

#### Drag-and-Drop Calendar
- Use `dnd-kit` with `react-big-calendar` as the grid
- Drop zones must be time slots (30-min granularity)
- On drop of a recurring task, always show the `RescheduleModal` with three options: "This occurrence only", "This and all future", "All occurrences"
- Conflicts (time overlap with another task) must highlight in real-time during drag
- Changes must be optimistically applied to React Query cache and rolled back on API error

#### Gamification Animations
- XP gain: slide-up toast with animated number increment (framer-motion)
- Level up: full-screen overlay with particle burst (use `canvas-confetti` or framer-motion keyframes — your choice)
- Streak milestone: flame icon pulse + count animation
- Task completion: checkmark animation on the task card (scale + colour transition)
- Coin earn: coin icon spin + counter increment

#### Form Validation
- All forms use `react-hook-form` + `zod` schema validation
- Validation errors appear inline, below the relevant field — never in a toast for field errors
- Zod schemas must mirror backend validation rules exactly
- Submit buttons show loading spinner and are disabled during submission

---

### 3.5 Offline Behaviour

Define and implement these offline states clearly in the UI:

| State | User-Visible Behaviour |
|---|---|
| No internet on load | Serve cached app shell + show "You're offline" banner |
| Internet lost mid-session | Show persistent "Offline" indicator in top bar |
| Task completed offline | Accept the action, queue to IndexedDB, show "Will sync when online" |
| Proof submitted offline | Queue upload, show pending state on task card |
| Regained connection | Auto-flush queue, show "Synced" confirmation, refresh stale queries |

---

## PHASE 4 — OBSERVABILITY SETUP

### 4.1 Local

Add to `docker-compose.local.yml`:
- **Jaeger** (all-in-one image) on port 16686 — for traces
- **Prometheus** scraping all service `/metrics` endpoints
- **Grafana** with pre-built dashboards for:
  - API latency (p50, p95, p99 per service and endpoint)
  - NATS event processing lag per consumer
  - DB connection pool utilisation
  - Active users / task completions (business metrics)

### 4.2 Every Go Service Must Expose

- `GET /health` — liveness check (always 200 if process is running)
- `GET /ready` — readiness check (checks DB, Redis, NATS connectivity; 503 if any failing)
- `GET /metrics` — Prometheus metrics endpoint (not authenticated)

### 4.3 Structured Logging

Every log line must be valid JSON. Every request log must include:
`service`, `trace_id`, `span_id`, `user_id` (if authed), `method`, `path`, `status`, `latency_ms`, `timestamp`

---

## PHASE 5 — TESTING

### 5.1 Backend Testing Requirements

Before marking any service complete, the following tests must exist and pass:

- **Unit tests** for all `service/` layer functions (mock repository interfaces)
- **Repository tests** using `testcontainers-go` with a real Postgres instance (not mocks)
- **Handler tests** using `net/http/httptest` covering: success, validation errors, auth errors, not-found
- **State machine tests** for all task transitions in `tasks-service`
- **XP calculation tests** for all multiplier combinations in `gamification-service`
- **Buddy assignment tests** for both round-robin and smart strategies

### 5.2 Frontend Testing Requirements

- **Hook tests** with Vitest + MSW for mocked API: `useGoals`, `useCalendar`, `useTasks`
- **Component tests** for all `GK*` design system components (render + interaction)
- **Form validation tests** for `GoalForm`, `TaskForm`, `CommunityForm`
- **Offline queue tests** for `useOfflineQueue` hook
- **E2E tests** (Playwright) for:
  - Register → create goal → add task → complete task flow
  - Join community → get buddy assigned → submit proof → buddy verifies flow
  - Purchase store item flow

### 5.3 Test Coverage Gates

CI must fail if coverage drops below:
- Go service layer: 80%
- Go repository layer: 70%
- Frontend hooks: 75%
- Frontend components: 60%

---

## PHASE 6 — CI/CD PIPELINES

### 6.1 GitHub Actions Workflows

Create the following workflow files:

**`.github/workflows/ci.yml`** (triggers on every PR and push to `main`):
```yaml
# Jobs (run in parallel where possible):
# 1. frontend-checks: lint (ESLint), typecheck (tsc --noEmit), test (vitest), build
# 2. go-checks: golangci-lint, gosec, go vet, go test ./...
# 3. migration-check: validate SQL migrations with flyway validate (dry run)
# 4. docker-build: build all service Docker images (don't push)
```

**`.github/workflows/deploy-dev.yml`** (triggers on push to `main`):
```yaml
# 1. Run all CI checks
# 2. Build and push Docker images tagged with git SHA
# 3. Run database migrations against dev DB
# 4. Deploy services to dev environment (kubectl apply or platform CLI)
# 5. Run smoke tests (curl /health and /ready on each service)
# 6. Deploy frontend to Vercel/Cloudflare dev environment
```

**`.github/workflows/deploy-prod.yml`** (triggers on git tag `v*.*.*`):
```yaml
# 1. Run all CI checks
# 2. Require manual approval (GitHub environment protection rule)
# 3. Build and push Docker images tagged with git tag
# 4. Run database migrations against prod DB
# 5. Deploy services with rolling update (never stop all pods at once)
# 6. Run smoke tests
# 7. Deploy frontend to prod
# 8. Create GitHub release with changelog
```

---

## PHASE 7 — README AND DOCUMENTATION

Before declaring the project complete, create the following documentation:

### `README.md` (root)
Must include:
- Project overview (one paragraph)
- Architecture diagram (ASCII or Mermaid)
- Prerequisites (exact versions: Node, Go, Docker, pnpm)
- Quick start for local dev (5 commands max to have the full stack running)
- Environment variable setup instructions
- How to run tests
- How to run migrations
- Contributing guide

### `docs/` directory
- `docs/api.md` — link to OpenAPI spec + how to generate types
- `docs/architecture.md` — system architecture description + service map
- `docs/deployment.md` — step-by-step deployment guide for dev and prod
- `docs/decisions.md` — Architecture Decision Records (ADRs) for key choices made

---

## IMPLEMENTATION RULES — APPLY AT ALL TIMES

These rules apply to every file you write throughout the entire build. Do not violate them.

### Code Quality
- No `any` type in TypeScript — ever. Use `unknown` and narrow.
- No `interface{}` in Go without justification — use typed structs.
- No commented-out code committed. Use `// TODO:` with a ticket reference if needed.
- No hardcoded strings for error messages — use constants.
- No direct `os.Getenv` calls outside of `cmd/` or config packages — use a typed config struct.
- No `fmt.Println` in Go services — use the structured logger.
- No `console.log` in production frontend code — use a logger utility.

### Security
- Never log sensitive data: passwords, tokens, card numbers, proof media URLs.
- All user-generated content displayed in the frontend must be sanitised (DOMPurify for rich text).
- All file uploads must be type-checked (magic bytes, not just extension) on the backend.
- JWT validation must check `exp`, `iss`, `aud` — never skip any claim.
- Database queries must use parameterised statements — never string concatenation.

### Performance
- Every Postgres query must use an index. If you write a query that would do a sequential scan on a table > 1000 rows, add an index.
- Never `SELECT *` — always name columns explicitly.
- Never perform N+1 queries — use JOINs or batch fetches.
- All API list endpoints must support cursor pagination — never load unbounded result sets.
- Frontend bundle: use dynamic `import()` for route-level code splitting. Every route should be lazy-loaded.

### Consistency
- Follow the exact naming conventions from the LLD: table names, column names, Go struct fields, TypeScript interfaces, API endpoint paths, NATS subject names, React Query key shapes.
- All timestamps stored as `TIMESTAMPTZ` (UTC) in Postgres. All timestamps returned as ISO 8601 in API responses.
- UUIDs used for all primary keys — never auto-increment integers.
- API responses always use `camelCase` JSON keys. Database columns always use `snake_case`.

### Git Discipline
- Commit after completing each meaningful unit of work (one service, one screen, one migration).
- Commit messages: `type(scope): description` — e.g., `feat(tasks-svc): implement recurrence expander job`
- Never commit directly to `main` — use feature branches and PRs (or squash commits if working solo).

---

## COMPLETION CHECKLIST

Do not declare the project done until every item is checked:

**Infrastructure**
- [ ] All three environment configs working (local, dev, prod)
- [ ] Docker Compose local stack starts with a single `docker compose up`
- [ ] All migrations run cleanly from zero
- [ ] Seed data loads in local and dev
- [ ] Health and readiness endpoints return 200 on all services

**Backend**
- [ ] All 10 services (or grouped equivalent) running and reachable
- [ ] All NATS events flowing (verify with NATS dashboard)
- [ ] All background jobs registered and firing
- [ ] RLS policies verified (attempt cross-user data access and confirm 0 rows returned)
- [ ] Rate limiting enforced (verify with curl loop)
- [ ] JWT validation rejecting expired/tampered tokens

**Frontend**
- [ ] PWA installable on iOS Safari and Android Chrome
- [ ] Lighthouse score > 85 on Performance, PWA, Accessibility
- [ ] Offline mode functional (task completion queued and synced)
- [ ] All 18 screens implemented and navigable
- [ ] Dark mode working throughout
- [ ] Drag-and-drop calendar functional with recurring task modal
- [ ] Push notifications working (test on real device)

**Testing**
- [ ] All Go services passing tests with coverage gates
- [ ] All frontend tests passing
- [ ] E2E tests passing in CI

**CI/CD**
- [ ] PR checks pass on every push
- [ ] Dev deploy triggers automatically on merge to main
- [ ] Prod deploy requires manual approval

---

## FINAL NOTE TO CURSOR AGENT

You are building a production-grade application, not a prototype. Every decision you make autonomously (architecture, library choice, implementation pattern) must be documented in a code comment or in `docs/decisions.md`. When you are uncertain between two approaches, pick the one that is more conservative, more testable, and more consistent with the existing patterns in the LLD. If you encounter a genuine conflict between the PRD and LLD, surface it to the user before resolving it.

Build this the right way, once.