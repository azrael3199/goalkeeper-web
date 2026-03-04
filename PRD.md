# GoalKeeper

### Product Requirements Document & Technical Analysis

###### Turning Everyday Tasks into an Epic Co-op Adventure

Version (^) 1.0 — Initial Release
Status Draft — Awaiting Stakeholder Review
Document Date (^) February 2025
Document Owner Product Team
Audience Engineering, Design, Product, Investors
Classification Confidential / Internal
Abstract
GoalKeeper is a Progressive Web Application that transforms the mundane experience of
managing personal goals and daily tasks into an immersive, cooperative gaming journey. By
combining structured goal management with social accountability mechanics, gamification loops,
and a rich reward economy, GoalKeeper aims to be the productivity companion people actually
want to use. This document defines the full product vision, user stories, functional and non-
functional requirements, system architecture, API surface, data models, and the phased delivery
roadmap.

## 1. Executive Summary

GoalKeeper bridges the gap between productivity tooling and social gaming. Current goal-
tracking applications are either too rigid and clinical (e.g., task managers) or too gamified
without substance (habit streaks). GoalKeeper offers a hybrid: a seriously powerful goal and
task management engine wrapped in a cooperative, community-driven gaming layer.

#### 1.1 The Problem

- 68% of people abandon their personal goals within the first month due to lack of
  accountability and motivation (source: psychological research on habit formation).
- Existing productivity apps lack the social glue required to sustain long-term behavioural
  change.
- No current solution offers true cooperative accountability with a verifiable, fair XP and
  reward economy.

#### 1.2 The Solution

- Long-horizon Goals broken into granular, scheduled Tasks — both one-time and
  recurring.
- Community-first accountability: buddy assignment, round-robin check-ins, and proof-of-
  completion verification.
- A fair XP economy where task completion and peer verification are both rewarded at
  configurable rates.
- A cosmetic reward store (titles, avatars, backgrounds) that makes progress feel tangible.
- A Solo mode for private goals, with reduced but meaningful rewards to encourage
  community participation.

#### 1.3 Target Audience

```
Primary Users Individuals aged 18-40 with personal improvement goals (fitness,
learning, finance, wellness).
Secondary Users Community managers, coaches, and team leads who want group
accountability tools.
```

Tertiary Users (^) Enterprises and wellness programs seeking white-label or API-
integrated accountability solutions.

#### 1.4 Key Differentiators

- Cooperative XP system: buddies earn verifier points — alignment of incentives.
- Proof-of-completion: media-backed, human-verified task checking.
- Open Goal Library: community-sourced, curated goal and task templates.

- Calendar drag-and-drop scheduling integrated with task cards.
- AI-ready architecture for future intelligent insights and adaptive goal coaching.

## 2. Product Vision & Goals

#### 2.1 Vision Statement

##### "Make personal achievement a shared adventure. GoalKeeper turns solo

##### ambition into community-powered momentum."

#### 2.2 Product Goals

G- (^01) Provide a best-in-class goal and task management UX on mobile-first PWA.
G- 02 Deliver a community system with buddy accountability, leaderboards, and XP fairness.
G- 03 Build a scalable backend (Golang) that supports millions of users and future AI
integrations.
G- 04 Launch a reward economy that drives engagement without pay-to-win mechanics.
G- (^05) Ship a configurable, API-first backend suitable for enterprise and third-party integrations.
G- 06 Achieve an app store rating of 4.5+ within 6 months of launch.

#### 2.3 Success Metrics

```
Metric Description Target (6mo) Target (12mo)
MAU Monthly Active Users 25,000 150,
DAU/MAU Daily engagement ratio 35% 45%
Community Rate Users joining a community 60% 72%
Goal Completion Goals completed vs. created 28% 40%
Buddy Verification Rate Tasks verified on time 75% 85%
Store Purchases Coin spends per active user/month 2.5 4.
Retention (D30) 30 - day retention rate 40% 52%
```

## 3. User Personas

```
Persona A — The Determined Solo
Profile: Priya, 29, Software Engineer. Introverted, self-motivated, has specific private goals (weight
loss, language learning).
Needs: Full private mode, granular scheduling, progress analytics, calendar view.
Pain Points: Existing apps are too social or require sharing data. Wants rewards but values privacy.
```

```
Persona B — The Community Champion
Profile: Marcus, 34, Marketing Manager. Highly social, coaches a fitness group, thrives on shared
wins.
Needs: Community creation, goal templates, leaderboards, buddy management, proof verification.
Pain Points: Current group chats lack structure. Needs accountability without administrative burden.
```

```
Persona C — The Goal Seeker
Profile: Ananya, 22, University Student. Not sure where to start with personal development.
Needs: Goal library, community onboarding, clear task cards, gamification to stay engaged.
Pain Points: Analysis paralysis, quitting when motivation dips. Needs social reinforcement.
```

```
Persona D — The Community Admin
Profile: Jordan, 41, Wellness Coach. Runs accountability programs professionally.
Needs: Admin controls, configurable XP rates, multiple community goals, buddy rotation control.
Pain Points: No tool combines accountability + gamification + professional control level.
```

## 4. Functional Requirements

#### 4.1 Goal Management

###### FR-GM-01: Goal Creation

- A user can create a Goal with: Name, Description, Category, Target Date/Quarter,
  Privacy Level (Private / Community), Status (Active / Paused / Completed / Archived).
- Goals may have tags (user-defined or community-defined) for filtering.
- Goals can be created from scratch OR imported from the Open Goal Library OR
  adopted from a community's goal set.

###### FR-GM-02: Goal Structure

- Each Goal is a container for one or more Tasks.
- Goals display a progress ring calculated from completed task occurrences vs. total
  scheduled task occurrences within the goal's timeline.
- Goals support multiple milestones as optional sub-markers within the timeline.

###### FR-GM-03: Goal Library

- A browsable, searchable Open Goal Library of curated community-contributed goal
  templates.
- Library entries include: Goal name, description, suggested task list, difficulty rating,
  estimated duration, tags, and adoption count.
- Any user can fork a library goal to their own dashboard and customize it.
- Community admins can maintain a private community goal library visible to community
  members only.

#### 4.2 Task Management

###### FR-TM-01: Task Configuration

- A Task belongs to exactly one Goal but can be pinned to multiple calendar views.
- Task attributes: Name, Description, Goal (parent), Type (One-time | Recurring), Tags,
  Priority, XP Value, Coin Value, Proof Required (Yes/No), Proof Type (Photo | Text | Link
  | Any).
- Recurring tasks define their recurrence rule: Daily, Weekly (select days), Monthly (select
  dates), Custom (cron-like input for power users).
- Each task instance can be scheduled to a specific time window (start time + optional
  duration).
- Tasks can be marked as Optional (still earns partial XP) or Mandatory (failure affects
  buddy XP).

###### FR-TM-02: Task States

```
Scheduled Task is planned for a future date/time.
```

```
Pending Task window is active and awaiting completion.
```

Completed (Unverified) (^) User marked done; awaiting buddy verification if required.
Completed (Verified) Buddy confirmed completion. XP and coins distributed.
Skipped (^) User explicitly skipped. No XP. Buddy notified.
Missed Window elapsed without action. Streak broken.
Failed (Rejected) Buddy rejected proof. No XP. Appeal available.

###### FR-TM-03: Task Tags

- Tags are user-defined strings (e.g., 'morning', 'fitness', 'deep-work').
- Community-level tags are available to all community members and managed by admins.
- Tags are color-coded and filterable on dashboard, calendar, and leaderboard views.

#### 4.3 Scheduling & Calendar View

###### FR-CAL-01: Calendar Interface

- A full Calendar screen (month / week / day views) displaying Task cards plotted by their
  scheduled date/time.
- Task cards on the calendar are color-coded by Goal, Priority, or Status (user-selectable
  preference).
- Drag-and-drop rescheduling: dragging a task card to a new date/time slot reschedules it.
  Recurring instances ask the user if they want to reschedule just this occurrence or all
  future occurrences.
- Time conflicts are highlighted in real-time during drag.
- Mini-map view: a condensed dot-per-task view when zoomed out to monthly.

###### FR-CAL-02: Scheduling Rules

- Goal timelines render as a Gantt-style bar across the calendar header row.
- The system warns when a task is scheduled outside its parent goal's timeline.
- Community-shared goals display community member aggregated task progress on the
  calendar (anonymized or attributed, per privacy settings).

#### 4.4 Gamification System

###### FR-GAM-01: XP Economy

```
Task Completion (Solo) Base XP defined on task config. Multiplied by streak bonus.
```

```
Task Completion
(Community, Verified)
```

```
Base XP x 1.0 (full). Streak bonus applies.
```

```
Buddy Verification (correct,
on-time)
```

```
Configurable percentage of task XP (default: 30%). Admin can set
10 - 50%.
Buddy Rejection (false
positive caught)
```

```
Small bonus XP to reporting user on appeal win.
```

```
Goal Completion Bonus Flat XP bonus + coin bonus when all goal tasks are finished.
Streak Multipliers 3 - day: 1.1x | 7-day: 1.25x | 14-day: 1.5x | 30-day: 2.0x.
```

```
Community Rank Bonus Monthly leaderboard rank 1-3 earns bonus coins (not XP).
```

###### FR-GAM-02: Level System

- XP accumulates globally per user across all goals.
- Level thresholds follow an exponential curve (L1: 0-500 XP, L2: 500-1500 XP, L3: 1500-
  3500 XP, etc.).
- Each level-up triggers an in-app celebration animation and coin reward.
- User's level is displayed on their profile, leaderboard entry, and buddy panel.

###### FR-GAM-03: Coins & Reward Store

- Coins are earned alongside XP (configurable coin-per-XP ratio, default 1:1).
- Coins are spent in the Reward Store for cosmetic items: Titles, Avatars, Profile
  Backgrounds, Task Card Themes, Goal Badge Overlays.
- Solo users earn 60% of normal coin rewards (configurable platform-level default).
- Reward Store items are categorized by rarity: Common, Rare, Epic, Legendary.
- Limited-edition seasonal items rotate quarterly.
- No paid currency. No pay-to-win. All store items are cosmetic only.

#### 4.5 Community System

###### FR-COM-01: Community Creation & Structure

- Any user can create a Community with: Name, Description, Avatar, Privacy (Open /
  Invite-only / Private), Max Member Cap, Community Goals (one or more), Tags.
- Communities support multiple concurrent Goals. Members can participate in any or all
  community goals.
- Community Roles: Admin, Moderator, Member.

###### FR-COM-02: Buddy System

- When a user joins a community goal, they are assigned a buddy from the pool of active
  participants.

- Buddy assignment algorithm: round-robin by default, with smart pairing (similar level,
  similar timezone) as a premium option.
- Buddy rotation: admin configures the rotation interval (weekly, bi-weekly, monthly, or
  fixed).
- A user may have one buddy per community goal simultaneously.
- Buddy pairs are visible to each other on their dashboard in the Buddy Panel.

###### FR-COM-03: Proof & Verification

- When a task has Proof Required enabled, the completing user must upload proof at task
  completion (photo, text note, URL, or any type as configured).
- Proof submission triggers a push notification to the assigned buddy.
- Buddy has a configurable time window (default 24 hrs, configurable 6-72 hrs) to Approve
  or Reject with a comment.
- If buddy fails to verify in time, the system auto-approves and logs the missed verification
  (repeated misses reduce buddy's verification score).
- An appeal system allows users to escalate rejections to a community moderator.

###### FR-COM-04: Leaderboard

- Each community has a Leaderboard ranked by XP earned within that community's
  context (not global XP).
- Leaderboard time windows: All Time / This Month / This Week.
- Leaderboard displays: Rank, Username, Avatar, Level, Community XP, Goal Completion
  %, Streak.
- Top 3 at month-end receive a bonus coin award and an optional community badge.

#### 4.6 Notifications & Reminders

- Push notifications (via Web Push API / FCM): task reminders, buddy requests, proof
  submission requests, verification expiry warnings, level-up celebrations.
- In-app notification center with read/unread states.
- User-configurable notification preferences per notification type.
- Daily digest email option (configurable frequency).

#### 4.7 Solo Mode

- All goal and task management features available in solo mode.
- No buddy assignment, no proof verification, no community leaderboard.
- XP and coins earned at reduced rate (platform-configurable, default: 60% of community
  rates).
- Solo users can still access the Open Goal Library.
- Private goals are fully invisible to all other users, including community members.

## 5. UX & Design Requirements

#### 5.1 Design Philosophy

- Mobile-first: designed for 375px-430px viewport as the canonical experience, gracefully
  scaling to tablet and desktop.
- Dark/Light mode support (system-default + manual toggle).
- Micro-animations on key interactions: task completion, level-up, coin earn, streak
  milestones.
- Accessibility: WCAG 2.1 AA compliant. Minimum contrast ratios, screen reader support,
  focus management.
- Game-inspired visual language without sacrificing clarity: subtle textures, XP bars,
  badge systems, particle effects on celebration moments.

#### 5.2 Screen Inventory

```
Screen ID Screen Name Priority Purpose
SCR- 01 Onboarding / Welcome P0 User understands value, signs up, sets first
goal.
SCR- 02 Dashboard / Home P0 Today's tasks, active goals, buddy status at a
glance.
SCR- 03 Goal Detail View P0 All tasks under a goal, progress ring, timeline.
SCR- 04 Task Configuration Modal P0 Create/edit a task with full scheduling options.
SCR- 05 Calendar View P0 All tasks across goals in a drag-and-drop
calendar.
SCR- 06 Community Hub P0 Discover, join, or manage communities.
SCR- 07 Community Detail P0 Community goals, leaderboard, buddy panel,
members.
SCR- 08 Buddy Panel P1 Buddy's progress, send encouragement, verify
proofs.
SCR- 09 Proof Submission P0 Submit proof of task completion with
media/text.
SCR- 10 Proof Review P0 Buddy reviews proof and approves/rejects.
SCR- 11 Leaderboard P1 Community-ranked XP standings with filters.
SCR- 12 Reward Store P1 Browse and purchase cosmetic items with
coins.
SCR- 13 User Profile P1 Stats, badges, level, equipped cosmetics.
SCR- 14 Goal Library P2 Browse and adopt curated community goals.
SCR- 15 Notifications Center P1 Unified notification feed.
SCR- 16 Settings P1 Account, notifications, privacy, theme.
```

```
SCR- 17 Analytics Dashboard P2 Progress charts, completion trends, streak
history.
SCR- 18 Community Admin Panel P1 Manage members, goals, buddy rules, XP
config.
```

#### 5.3 Dashboard (SCR-02) — Detailed Spec

- Top bar: XP bar (current level progress), coin count, notification bell.
- Today's Tasks strip: horizontally scrollable task cards sorted by time. Cards show: task
  name, parent goal color, time, status chip, proof indicator.
- Active Goals grid: compact cards with progress ring, goal name, next task, days
  remaining.
- Buddy Panel snapshot: buddy avatar, their today completion %, next verification due.
- Streak widget: current streak count, record streak, flame icon animation on active streak.
- Community Quick Links: first 3 communities with unread badge counts.

#### 5.4 Calendar View (SCR-05) — Detailed Spec

- Default: weekly view with time-grid (30-min slots from 6:00 AM to midnight).
- Task cards on calendar: color = parent goal color. Height = proportional to task duration
  if set.
- Drag handle on task card. On drag-start, potential drop zones highlight.
- On drop: if one-time task, reschedule directly. If recurring: modal asks 'Move this
  occurrence only / Move all future / Move all'.
- Day column header shows: date, day of week, total task count, completion percentage
  dot indicator.
- Goal timeline bar rendered at the very top of the calendar spanning its start-to-end
  dates.
- Month view: mini task dots below date, clicking date expands a day popover.

#### 5.5 Task Configuration (SCR-04) — Detailed Spec

- Form fields: Task Name, Description (rich text), Parent Goal (searchable select), Type
  toggle (One-Time / Recurring).
- Recurring options: Frequency dropdown, Day picker (weekly), Date picker (monthly),
  Custom cron (advanced toggle).
- Time scheduling: Start Time picker, Duration (optional), Reminder offset.
- Tags: multi-select chip input with autocomplete from user/community tag pool.
- Proof settings: toggle Proof Required, select Proof Type.
- XP value: editable with min/max guard (community admins can lock this).
- Mandatory toggle: if on, skip/miss affects buddy's standing.
- Preview: live calendar preview showing when recurrences will fall.

## 6. Technical Architecture

#### 6.1 Technology Stack

```
Layer Technology Rationale Version
Target
Frontend React + Vite (PWA) Component ecosystem, PWA
support, fast HMR
```

```
React 19+
```

```
State Management Zustand + React Query Lightweight global state + server
state caching
```

```
Latest stable
```

```
Styling Tailwind CSS + shadcn/ui Utility-first, consistent design
system
```

```
Tailwind v
```

```
Mobile PWA Workbox + Web App
Manifest
```

```
Offline support, install prompts,
push notifications
```

```
Latest
```

```
Backend Go (Golang) High concurrency, low latency,
cloud-native
```

```
Go 1.22+
```

```
API Layer REST + GraphQL (hybrid) REST for CRUD, GraphQL for
complex queries
```

```
gqlgen
```

```
Auth Supabase Auth / Clerk OAuth2, JWT, social login, MFA
support
```

```
Latest
```

```
Primary DB PostgreSQL (via
Supabase)
```

```
ACID, relational, RLS for multi-
tenancy
```

```
PG 16
```

```
Cache Redis (Upstash
serverless)
```

```
Session cache, leaderboard sorted
sets, rate limiting
```

```
Redis 7+
```

```
File Storage Supabase Storage / S3 Proof media uploads, avatars,
backgrounds
```

```
Cloudflare
R
Push Notifications Firebase Cloud
Messaging
```

```
Web push, background sync FCM v1 API
```

```
Search PostgreSQL FTS /
Typesense
```

```
Goal library search, community
discovery
```

```
Typesense
0.25+
```

```
Email Resend / SendGrid Transactional email, digests Latest
Infra (MVP) Railway / Render Simple Go deployment, managed
Postgres
```

```
Managed
```

```
Infra (Scale) GCP / AWS ECS + RDS Autoscaling, global CDN, managed
services
```

```
Kubernetes
```

```
CI/CD GitHub Actions Automated test, lint, deploy
pipelines
```

```
Latest
```

```
Monitoring OpenTelemetry + Grafana Distributed tracing, metrics, alerting OTel 1.x
```

#### 6.2 System Architecture Overview

GoalKeeper follows a layered, modular architecture optimized for horizontal scalability. The
frontend is a React PWA served via a CDN edge network. The backend is a stateless Go
service fleet behind a load balancer, communicating with a PostgreSQL primary (with read
replicas) and a Redis cluster. All media is stored in object storage with CDN delivery.

```
Architecture Layers (Top to Bottom)
```

1. Client Layer: React PWA (CDN-delivered, installable, offline-capable via Service Worker)
2. API Gateway: Nginx / Cloudflare Workers (rate limiting, auth validation, routing, DDoS protection)
3. Application Layer: Go microservices (Goals, Tasks, Users, Community, Gamification, Notifications,
   Store, Analytics)
4. Data Layer: PostgreSQL (primary + read replicas) | Redis (cache + leaderboard) | Object Storage
   (proof media)
5. Event Bus: NATS / Cloud Pub/Sub for async notifications, XP distribution, buddy alerts
6. AI Module (Future): Standalone inference service (Python/FastAPI) consuming data via internal
   gRPC API

#### 6.3 Go Service Modules

users-service (^) Registration, auth integration, profile, settings, cosmetic inventory
management.
goals-service (^) CRUD for goals, library management, progress calculation, milestone
tracking.
tasks-service Task CRUD, recurrence engine, scheduling rules, state machine
management.
community-service Community CRUD, membership, roles, buddy assignment algorithm,
rotation scheduler.
gamification-service XP engine, coin engine, level calculation, streak tracking, reward
distribution.
verification-service Proof submission, buddy notification, verification workflow, appeal
handling.
store-service Item catalog, inventory management, purchase transactions, coin
deduction.
notification-service Push notification dispatch, email, in-app notification feed, digest
scheduling.
search-service Goal library indexing, community discovery, user search (Typesense
integration).
analytics-service (^) Progress aggregation, trend computation, heatmap data preparation for AI
feed.

#### 6.4 Key Database Schema

users

id UUID PK | email TEXT UNIQUE | display_name TEXT | avatar_url TEXT | level INT
DEFAULT 1 | total_xp BIGINT DEFAULT 0 | coins BIGINT DEFAULT 0 | streak_current INT
| streak_best INT | solo_mode BOOL | created_at TIMESTAMPTZ | updated_at
TIMESTAMPTZ

goals

id UUID PK | user_id UUID FK(users) | community_id UUID FK(communities) NULLABLE |
title TEXT | description TEXT | category TEXT | privacy ENUM(private,community,public) |
status ENUM(active,paused,completed,archived) | target_date DATE | library_ref UUID
NULLABLE | created_at | updated_at

tasks

id UUID PK | goal_id UUID FK(goals) | user_id UUID FK(users) | title TEXT | type
ENUM(one_time,recurring) | recurrence_rule JSONB | scheduled_at TIMESTAMPTZ |
duration_minutes INT | status
ENUM(scheduled,pending,completed_unverified,completed_verified,skipped,missed,failed)
| xp_value INT | coin_value INT | is_mandatory BOOL | proof_required BOOL | proof_type
ENUM(photo,text,link,any) | tags TEXT[] | priority ENUM(low,medium,high) | created_at |
updated_at

communities

id UUID PK | name TEXT | description TEXT | avatar_url TEXT | privacy
ENUM(open,invite_only,private) | max_members INT | buddy_rotation_days INT |
buddy_xp_ratio DECIMAL(4,2) DEFAULT 0.30 | coin_solo_ratio DECIMAL(4,2) DEFAULT
0.60 | created_by UUID FK(users) | created_at | updated_at

buddy_assignments

id UUID PK | community_id UUID FK(communities) | goal_id UUID FK(goals) | user_id
UUID FK(users) | buddy_id UUID FK(users) | rotation_start TIMESTAMPTZ | rotation_end
TIMESTAMPTZ | verification_score DECIMAL(5,2) DEFAULT 100.0 | created_at

proof_submissions

id UUID PK | task_id UUID FK(tasks) | submitter_id UUID FK(users) | buddy_id UUID
FK(users) | media_url TEXT[] | note TEXT | status
ENUM(pending,approved,rejected,auto_approved,appealed) | buddy_comment TEXT |
submitted_at TIMESTAMPTZ | reviewed_at TIMESTAMPTZ | expires_at TIMESTAMPTZ

xp_ledger (partitioned by created_at monthly)

id UUID PK | user_id UUID FK(users) | amount INT | type
ENUM(task_completion,buddy_verification,level_bonus,goal_completion,streak_bonus,community_rank)
| ref_id UUID | community_id UUID NULLABLE | created_at TIMESTAMPTZ

store_items

id UUID PK | name TEXT | description TEXT | category
ENUM(title,avatar,background,card_theme,goal_badge) | rarity
ENUM(common,rare,epic,legendary) | coin_cost INT | asset_url TEXT | is_limited BOOL |
available_from TIMESTAMPTZ | available_until TIMESTAMPTZ

## 7. API Design

#### 7.1 REST API Conventions

```
Base URL https://api.goalkeeper.app/v
Auth Bearer JWT (Authorization header). RS256 signed.
```

```
Content-Type application/json
```

Pagination (^) Cursor-based (?cursor=<token>&limit=<n>)
Errors RFC 7807 Problem Details: { code, message, details }
Rate Limiting 100 req/min per user (Redis token bucket)
Versioning URL path versioning /v1, /v

#### 7.2 Key API Endpoints

```
Method Endpoint Description Auth Required
POST /auth/register User registration No
POST /auth/login Login, returns JWT + refresh token No
GET /users/me Get current user profile Yes
PATCH /users/me Update profile / settings Yes
```

```
GET /goals List user goals (filters: status, tag,
date)
```

```
Yes
```

```
POST /goals Create a new goal Yes
```

```
GET /goals/:id Get goal detail + associated tasks Yes
PATCH /goals/:id Update goal attributes Yes
DELETE /goals/:id Archive or delete goal Yes
GET /goals/library Browse open goal library
(paginated)
```

```
Optional
```

```
POST /goals/library/:id/adopt Fork library goal to user dashboard Yes
GET /tasks List tasks (filter by goal, date,
status, tag)
```

```
Yes
```

```
POST /tasks Create task under a goal Yes
PATCH /tasks/:id Update task configuration Yes
```

```
POST /tasks/:id/complete Mark task complete + attach proof Yes
PATCH /tasks/:id/reschedule Reschedule task occurrence(s) Yes
GET /communities Discover / list communities Optional
POST /communities Create a community Yes
```

POST /communities/:id/join Join a community Yes

GET /communities/:id/leaderboard Get community leaderboard Yes

GET /communities/:id/buddy Get current buddy assignment Yes

GET /proofs/pending List proof submissions awaiting
review

```
Yes
```

POST /proofs/:id/review Approve or reject proof with
comment

```
Yes
```

GET /gamification/me XP, level, coins, streak summary Yes

GET /store/items List store items (filter by category,
rarity)

```
Yes
```

POST /store/purchase/:itemId Purchase store item with coins Yes

GET /notifications List user notifications (paginated,
cursor)

```
Yes
```

PATCH /notifications/:id/read Mark notification as read Yes

GET /calendar Task instances within a date range
(?from=&to=)

```
Yes
```

## 8. User Stories & Acceptance Criteria

#### 8.1 Story Epics

```
Epic ID Epic Name Priority Story Range
EP- 01 Authentication & Onboarding P0 US-01 to US- 05
EP- 02 Goal Lifecycle Management P0 US-06 to US- 14
EP- 03 Task Scheduling & Calendar P0 US-15 to US- 24
EP- 04 Community & Buddy System P0 US-25 to US- 38
EP- 05 Proof & Verification P0 US-39 to US- 46
EP- 06 Gamification & Rewards P1 US-47 to US- 57
EP- 07 Notifications & Reminders P1 US-58 to US- 63
```

```
EP- 08 Goal Library P2 US-64 to US- 69
EP- 09 Analytics & Progress P2 US-70 to US- 76
EP- 10 Admin & Community Management P1 US-77 to US- 85
```

#### 8.2 Representative User Stories

```
US-06 | Epic EP-02: Goal Lifecycle | Priority: P
Story: As a user, I want to create a Goal with a name, description, end date, and privacy level so that
I can define what I am working toward.
Acceptance Criteria:
```

1. Form validates name (required, max 120 chars), description (optional, max 1000 chars), target
   date (must be future), privacy (required).
2. On submit, goal appears in user's dashboard within 1 second.
3. Goal progress ring displays at 0% on creation.
4. Private goal is not visible to any other user or community member.

```
US-28 | Epic EP-04: Community & Buddy | Priority: P
Story: As a community member, I want to be assigned a buddy automatically when I join a
community goal so that I have an accountability partner.
Acceptance Criteria:
```

1. On joining a community goal, system assigns a buddy within 5 seconds.
2. Both user and buddy receive a push notification with each other's profile card.
3. Buddy Panel on dashboard shows buddy's name, avatar, level, today's task status.
4. If no eligible buddy is available, user is placed in a queue and notified when assigned.

US-47 | Epic EP-06: Gamification | Priority: P1

Story: As a user, I want to earn XP and coins when I complete a verified task so that I feel rewarded
for my progress.

Acceptance Criteria:

1. On verification approval, XP and coins are credited within 3 seconds.
2. XP bar on dashboard visually animates to the new value.
3. Buddy simultaneously receives their configured percentage of XP with a notification.
4. Solo task earns 60% of base XP/coins (configurable platform default).
5. Streak multiplier is applied correctly before final XP is awarded and shown in the reward toast.

US-39 | Epic EP-05: Proof & Verification | Priority: P0

Story: As a buddy, I want to receive a notification and review my partner's proof submission so that I
can verify their task completion accurately.

Acceptance Criteria:

1. Buddy receives push notification within 30 seconds of proof submission.
2. Proof review screen shows media/text, task name, submission time, and remaining review
   window.
3. Buddy can Approve (XP distributed) or Reject (with mandatory comment, no XP, appeal option
   shown to submitter).
4. If no action taken within the configured window, proof auto-approves and buddy's verification
   score decrements.

## 9. Non-Functional Requirements

#### 9.1 Performance

```
NFR-P01 API p95 response time < 300ms for all CRUD endpoints under normal load.
NFR-P02 Leaderboard reads < 100ms (Redis sorted set / ZSET).
```

```
NFR-P03 Calendar query for 30-day range returns within 500ms for up to 500 task instances.
```

NFR-P04 (^) Frontend Lighthouse Performance score > 85 on mobile.
NFR-P05 PWA initial load (First Contentful Paint) < 2.5s on 4G mobile.
NFR-P06 Media proof uploads: client-side compression before upload, max 5MB post-
compression.

#### 9.2 Scalability

```
NFR-S01 Backend must support 100,000 concurrent users with horizontal pod scaling
(Kubernetes HPA).
```

```
NFR-S02 Database design must support 10M+ users without schema changes (UUID PKs,
partitioned xp_ledger and task_instances tables).
```

```
NFR-S03 Leaderboard service scales to 10,000 community members using Redis ZSET
natively.
NFR-S04 Notification service decoupled via event bus to prevent cascading failures on core
task operations.
```

#### 9.3 Security

```
NFR-SEC01 All API endpoints authenticated via JWT (RS256). Tokens expire in 1 hour; refresh
tokens valid for 30 days.
NFR-SEC02 Row-level security (RLS) enforced at Postgres level. Users cannot access other
users' private data.
NFR-SEC03 Media upload URLs are pre-signed with 5-minute expiry. Stored media accessed via
signed CDN URLs only.
NFR-SEC04 OWASP Top 10 compliance. SAST scans in CI pipeline (Gosec for Go, ESLint
Security for React).
NFR-SEC05 Rate limiting: 100 req/min per authenticated user; 20 req/min for anonymous
endpoints.
```

NFR-SEC06 (^) GDPR compliance: right to erasure, data export endpoint, consent management for
analytics.
NFR-SEC07 All data encrypted in transit (TLS 1.3) and at rest (AES-256).

#### 9.4 Reliability & Availability

```
NFR-R01 Target SLA: 99.5% uptime (MVP) scaling to 99.9% post-Series A infrastructure
upgrade.
```

NFR-R02 (^) Graceful degradation: if notification service is down, core task completion continues
unaffected.
NFR-R03 Buddy verification auto-approval fallback fires if verification service is unreachable for

> 1 hour.
> NFR-R04 Database failover: Postgres read replica promotes to primary within 60 seconds.
> NFR-R05 (^) PWA offline mode: task completion queued locally (IndexedDB) and synced on
> reconnect.

## 10. Phased Delivery Roadmap

#### Phase 0 — Foundation (Weeks 1-4)

```
Infrastructure, Auth, Core Data Models
Goals: Set up monorepo, CI/CD pipeline, Go service scaffolding, PostgreSQL schema migrations,
React PWA shell, Auth integration, user profile service.
Deliverables: Deployable Go API skeleton, React app with working auth flow, database migrations,
dev environment documentation.
Definition of Done: A new developer can clone, install, and run the full stack locally in < 30 minutes.
```

#### Phase 1 — Core MVP (Weeks 5-12)

```
Goals, Tasks, Calendar, Solo Mode
Goals: Full goal CRUD, task CRUD with recurrence engine, calendar view with drag-and-drop
rescheduling, solo gamification (XP/coins/levels/streaks), dashboard, push notification reminders.
Deliverables: Functional app for solo users. Internal alpha. First user testing round with 20
participants.
Success Gate: DAU/MAU ratio > 25% among alpha testers. Task completion rate > 40% among
alpha cohort.
```

#### Phase 2 — Community & Accountability (Weeks 13-20)

```
Community Hub, Buddy System, Proof & Verification, Leaderboards
Goals: Community creation and joining flows, buddy assignment algorithm (round-robin + smart),
proof submission and verification workflow, leaderboard (Redis ZSET), community admin panel,
configurable XP/coin ratios.
Deliverables: Closed beta with 5-10 real communities. Load testing to 1,000 CCU. Bug bash week.
Success Gate: Buddy verification rate > 70%. No critical P0 bugs in core accountability flow.
```

#### Phase 3 — Reward Economy & Store (Weeks 21-26)

```
Reward Store, Cosmetics, Goal Library
Goals: Reward store with item catalog, coin transactions, inventory system, first cosmetic item set
(10 avatars, 5 backgrounds, 20 titles, 3 card themes), Open Goal Library seeded with 50 curated
goals, tag system.
Deliverables: Public beta launch. PWA installability live on iOS and Android. Marketing site live.
Success Gate: 1,000 registered users in first 2 weeks. Store purchase rate > 20% of active users.
```

#### Phase 4 — Analytics & AI Foundation (Weeks 27-36)

```
Analytics Dashboard, AI Integration Points
Goals: User analytics dashboard (progress charts, completion heatmaps, streak history, goal
trajectory), data pipeline to analytics-service, AI module API contract defined, initial AI feature: smart
task scheduling suggestion based on historical patterns.
Deliverables: v1.0 GA release. Investor demo build. AI module proof-of-concept with backtesting
report.
```

#### Phase 5 — Scale & Enterprise (Post-Launch)

```
Enterprise Tier, API Monetization, Advanced AI
Goals: White-label community tier for enterprises, enterprise SSO (SAML), public API key access for
third-party integrations, advanced AI goal coaching (personalized task suggestions, risk-of-quit
prediction, adaptive difficulty), global cross-community leaderboards.
```

## 11. AI Module — Future Scope

#### 11.1 Architecture Approach

The AI module is designed as a standalone microservice (Python / FastAPI preferred for ML
ecosystem compatibility) that consumes data from the analytics-service via an internal gRPC or
REST API. This separation ensures AI model updates do not require frontend or core backend
deploys, and allows the inference service to scale independently.

#### 11.2 Planned AI Capabilities

```
Feature Description Data Required Timeline
Smart Scheduling Suggest optimal task times
based on historical completion
patterns.
```

```
Task timestamps,
completion rate by time-of-
day
```

```
Phase 4
```

```
Goal Risk Prediction Alert user when goal trajectory
suggests missing the target
date.
```

```
Task completion velocity,
goal timeline
```

```
Phase 4
```

```
Adaptive XP Tuning Recommend XP value
adjustments based on difficulty
signals.
```

```
Completion rate, time
taken, skip rate per task
```

```
Phase 5
```

```
AI Buddy Matching Intelligent buddy pairing based
on complementary behavioral
profiles.
```

```
User behavioral graph,
completion history
```

```
Phase 5
```

```
Natural Language
Goal Input
```

```
Users describe goals in plain
language; AI structures into
Goal + Tasks.
```

```
LLM inference (Claude
API / GPT-4o)
```

```
Phase 5
```

```
Progress Coaching Personalized weekly insight
messages based on behavioral
patterns.
```

```
Full user event history,
goal progress
```

```
Phase 5
```

#### 11.3 Data Privacy for AI

- All AI training uses anonymized, aggregated data only. No personal identifiers in model
  training sets.
- User opt-out available for behavioral data collection used for AI personalization features.
- On-device inference explored for scheduling suggestions (TensorFlow.js) to minimize
  data transmission.
- AI feature set clearly labeled in UI. Users can see what data is used for each AI feature.

## 12. Risks & Mitigations

```
Risk Impact Likelihood Mitigation Strategy
Buddy ghosting / non-
verification
```

```
High — breaks
core
accountability
loop
```

```
High Auto-approve fallback, verification score
penalties, buddy swap option, escalation
to moderator.
```

```
XP gaming / fake proof
submissions
```

```
High — economy
integrity
```

```
Medium Community moderation tools, report
system, machine-based proof scan in
Phase 4.
Low community
adoption at launch
```

```
High —
community
features worthless
without users
```

```
Medium Strong solo mode, seeded communities
by team, influencer / community manager
partner program.
```

```
Backend performance
at scale
```

```
High — user
experience
degradation
```

```
Medium Load testing Phase 2, Redis caching,
read replicas, autoscaling configuration.
```

```
PWA push notification
limitations (iOS)
```

```
Medium —
engagement gap
on iOS users
```

```
High Monitor Apple PWA Push API, fallback to
email and in-app notification for iOS
users.
Goal Library content
quality
```

```
Medium — poor
templates
damage trust
```

```
Medium Editorial curation team, community
upvote/report system, quality scoring
algorithm.
Scope creep delaying
MVP
```

```
High — missed
market window
```

```
Medium Strict phase-gating, MoSCoW
prioritization each sprint, weekly scope
review with PM.
GDPR compliance
gaps
```

```
High — regulatory
risk in EU
```

```
Low Legal review before Phase 3 public
launch, Data Protection Impact
Assessment (DPIA).
```

## 13. Open Questions & Decisions Required

```
OQ- 01 Monetization model: Freemium (what is behind paywall?) vs. pure
free with enterprise tier? Decision required before Phase 3.
```

OQ- (^02) Buddy XP default ratio: 30% community default — should admin cap
range be 10%-50% or wider? Requires economy review.
OQ- 03 PWA vs. native app: Should we invest in React Native for Phase 5 or
remain PWA-only?
OQ- 04 Proof storage retention: How long are proof media files retained? 90
days? 1 year? Directly impacts storage cost projections.
OQ- 05 Community size limits: Is 500 members per community the right cap?
Affects buddy pool quality and leaderboard competitiveness.

```
OQ- 06 Open Goal Library governance: Who curates? Community vote vs.
editorial team vs. AI scoring?
```

OQ- (^07) Seasonal cosmetics pricing: What coin costs prevent inflation while
keeping items desirable?
OQ- (^08) GDPR data residency: Do we need EU-region infrastructure at
launch for EU users?

## 14. Glossary

```
Goal A long-term objective with a defined timeline, composed of one or
more Tasks.
```

```
Task A specific, schedulable unit of work that contributes to completing a
Goal.
```

```
Buddy A community-assigned accountability partner who verifies task
completion proof.
```

```
XP (Experience Points) Points earned for completing tasks and verifying buddy tasks. Drive
level progression.
```

```
Coins In-app currency earned alongside XP, spent in the Reward Store for
cosmetics.
Proof Evidence (photo, text, link) submitted by a user to confirm task
completion.
Verification The act of a buddy reviewing and approving or rejecting submitted
proof.
```

Streak (^) Consecutive days with at least one verified task completion. Drives
XP multipliers.
Open Goal Library A public repository of curated, community-contributed Goal + Task
templates.
Round Robin (^) A buddy rotation method that cycles through community members in
sequence.
PWA Progressive Web Application — a web app installable on
mobile/desktop with native-like features.
RLS Row-Level Security — PostgreSQL feature restricting data access at
the database level.
HPA Horizontal Pod Autoscaler — Kubernetes mechanism for auto-
scaling service replicas.
ZSET Redis Sorted Set — data structure used for real-time leaderboard
ranking by score.
Recurrence Rule A JSON-encoded ruleset defining when a recurring task repeats
(days, frequency, cron).

Verification Score A per-buddy metric tracking timeliness and accuracy of their
verification actions.

```
Document End — GoalKeeper PRD v1.0 | All rights reserved. Internal and Confidential.
```
