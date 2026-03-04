import { http, HttpResponse, delay } from "msw";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Simulated latency (ms) — realistic feel
const LAT = 400;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ME = {
  id: "mock-uuid-1234",
  email: "dev@goalkeeper.local",
  display_name: "Dev User",
  avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=goalkeeper",
  level: 7,
  total_xp: 4250,
  coins: 830,
  streak_current: 11,
  streak_best: 42,
  solo_mode: false,
  timezone_offset: 330, // IST
  created_at: "2026-01-01T00:00:00Z",
  updated_at: new Date().toISOString(),
};

const GOALS = [
  {
    id: "goal-1",
    user_id: ME.id,
    title: "Learn Golang & Microservices",
    description:
      "Master Go, build production microservices, understand distributed systems concepts.",
    category: "learning",
    privacy: "public",
    status: "active",
    target_date: "2026-12-31T00:00:00Z",
    start_date: "2026-01-01T00:00:00Z",
    progress_pct: 42,
    tags: ["golang", "backend", "microservices"],
    task_count: 24,
    completed_task_count: 10,
    community_id: "community-1",
    created_at: "2026-01-01T08:00:00Z",
    updated_at: new Date().toISOString(),
  },
  {
    id: "goal-2",
    user_id: ME.id,
    title: "Run a Full Marathon",
    description: "Complete a full 42.2km marathon under 4 hours by December.",
    category: "fitness",
    privacy: "community",
    status: "active",
    target_date: "2026-11-15T00:00:00Z",
    start_date: "2026-01-15T00:00:00Z",
    progress_pct: 18,
    tags: ["running", "fitness", "marathon"],
    task_count: 48,
    completed_task_count: 9,
    community_id: "community-2",
    created_at: "2026-01-15T08:00:00Z",
    updated_at: new Date().toISOString(),
  },
  {
    id: "goal-3",
    user_id: ME.id,
    title: "Read 24 Books This Year",
    description: "Read 2 books per month across fiction and non-fiction.",
    category: "personal",
    privacy: "private",
    status: "active",
    target_date: "2026-12-31T00:00:00Z",
    start_date: "2026-01-01T00:00:00Z",
    progress_pct: 75,
    tags: ["reading", "learning"],
    task_count: 24,
    completed_task_count: 18,
    created_at: "2026-01-01T08:00:00Z",
    updated_at: new Date().toISOString(),
  },
];

const TASKS = [
  {
    id: "task-1",
    goal_id: "goal-1",
    user_id: ME.id,
    title: "Complete gRPC module in Go course",
    description: "Chapter 12 — gRPC services with protobuf definitions",
    type: "one_time",
    status: "pending",
    priority: "high",
    xp_value: 150,
    coin_value: 15,
    is_mandatory: true,
    proof_required: false,
    scheduled_at: new Date().toISOString(),
    tags: ["grpc", "golang"],
    goal_title: "Learn Golang & Microservices",
    created_at: new Date().toISOString(),
  },
  {
    id: "task-2",
    goal_id: "goal-2",
    user_id: ME.id,
    title: "Morning Run — 8km",
    description: "Steady pace, HR below 160bpm",
    type: "recurring",
    status: "pending",
    priority: "high",
    xp_value: 200,
    coin_value: 20,
    is_mandatory: true,
    proof_required: true,
    proof_type: "photo",
    scheduled_at: new Date().toISOString(),
    tags: ["running", "cardio"],
    goal_title: "Run a Full Marathon",
    created_at: new Date().toISOString(),
  },
  {
    id: "task-3",
    goal_id: "goal-3",
    user_id: ME.id,
    title: 'Read 30 pages of "Atomic Habits"',
    description: "",
    type: "recurring",
    status: "completed_verified",
    priority: "medium",
    xp_value: 50,
    coin_value: 5,
    is_mandatory: false,
    proof_required: false,
    completed_at: new Date(Date.now() - 3_600_000).toISOString(),
    tags: ["reading"],
    goal_title: "Read 24 Books This Year",
    created_at: new Date().toISOString(),
  },
  {
    id: "task-4",
    goal_id: "goal-1",
    user_id: ME.id,
    title: 'Read "Designing Distributed Systems" Ch.3',
    description: "Focus on replication patterns",
    type: "one_time",
    status: "scheduled",
    priority: "medium",
    xp_value: 80,
    coin_value: 8,
    is_mandatory: false,
    proof_required: false,
    scheduled_at: new Date(Date.now() + 86_400_000).toISOString(),
    tags: ["distributed-systems"],
    goal_title: "Learn Golang & Microservices",
    created_at: new Date().toISOString(),
  },
];

const COMMUNITIES = [
  {
    id: "community-1",
    name: "Backend Engineers 2026",
    description:
      "A tight-knit community of developers leveling up their backend engineering skills together.",
    avatar_url:
      "https://api.dicebear.com/7.x/initials/svg?seed=BE&backgroundColor=1A3C6E&textColor=ffffff",
    privacy: "open",
    member_count: 127,
    active_goal_count: 89,
    buddy_rotation_days: 14,
    is_member: true,
    role: "member",
    created_by: ME.id,
    created_at: "2026-01-01T08:00:00Z",
  },
  {
    id: "community-2",
    name: "Runners Anonymous 🏃",
    description: "We run. We suffer together. We celebrate each others PRs.",
    avatar_url:
      "https://api.dicebear.com/7.x/initials/svg?seed=RA&backgroundColor=27AE60&textColor=ffffff",
    privacy: "open",
    member_count: 342,
    active_goal_count: 201,
    buddy_rotation_days: 7,
    is_member: true,
    role: "member",
    created_by: "user-alex",
    created_at: "2025-10-15T08:00:00Z",
  },
  {
    id: "community-3",
    name: "Book Club Elite",
    description:
      "Serious readers sharing recommendations, holding each other accountable.",
    avatar_url:
      "https://api.dicebear.com/7.x/initials/svg?seed=BC&backgroundColor=8B5CF6&textColor=ffffff",
    privacy: "invite_only",
    member_count: 48,
    active_goal_count: 32,
    buddy_rotation_days: 14,
    is_member: false,
    created_by: "user-priya",
    created_at: "2025-12-01T08:00:00Z",
  },
];

const LEADERBOARD = [
  {
    rank: 1,
    user_id: "user-alex",
    display_name: "Alex K.",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    level: 15,
    total_xp: 18_500,
  },
  {
    rank: 2,
    user_id: "user-priya",
    display_name: "Priya M.",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
    level: 12,
    total_xp: 11_200,
  },
  {
    rank: 3,
    user_id: ME.id,
    display_name: ME.display_name,
    avatar_url: ME.avatar_url,
    level: ME.level,
    total_xp: ME.total_xp,
    is_you: true,
  },
  {
    rank: 4,
    user_id: "user-sam",
    display_name: "Sam R.",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=sam",
    level: 6,
    total_xp: 3_800,
  },
  {
    rank: 5,
    user_id: "user-jamie",
    display_name: "Jamie L.",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=jamie",
    level: 5,
    total_xp: 2_900,
  },
];

const BUDDY = {
  id: "assignment-1",
  buddy_id: "user-alex",
  buddy_name: "Alex K.",
  buddy_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
  buddy_level: 15,
  goal_id: "goal-2",
  goal_title: "Run a Full Marathon",
  community_id: "community-2",
  rotation_end: new Date(Date.now() + 5 * 86_400_000).toISOString(),
  verification_score: 97.5,
  pending_proofs: 1,
};

const PENDING_PROOF = {
  id: "proof-1",
  task_instance_id: "task-2",
  task_title: "Morning Run — 8km",
  goal_title: "Run a Full Marathon",
  submitter_id: "user-alex",
  submitter_name: "Alex K.",
  submitter_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
  buddy_id: ME.id,
  media_urls: [
    "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&auto=format&fit=crop",
  ],
  note: "Did 8.3km, felt great! Hit a new pace PR too 🏃",
  status: "pending",
  submitted_at: new Date(Date.now() - 2_400_000).toISOString(),
  expires_at: new Date(Date.now() + 21_600_000).toISOString(),
  xp_reward: 200,
};

const NOTIFICATIONS = [
  {
    id: "notif-1",
    type: "proof.submitted",
    title: "New Proof to Review",
    body: 'Alex K. submitted proof for "Morning Run — 8km". Review it before it expires.',
    action_url: "/proofs/proof-1",
    is_read: false,
    created_at: new Date(Date.now() - 1_800_000).toISOString(),
  },
  {
    id: "notif-2",
    type: "xp.awarded",
    title: "+150 XP Earned!",
    body: 'You completed "Complete gRPC module". Keep the streak going!',
    is_read: false,
    created_at: new Date(Date.now() - 7_200_000).toISOString(),
  },
  {
    id: "notif-3",
    type: "buddy.assigned",
    title: "Meet Your Buddy!",
    body: "You have been matched with Alex K. for your marathon goal. Say hi!",
    action_url: "/buddy",
    is_read: true,
    created_at: new Date(Date.now() - 86_400_000).toISOString(),
  },
  {
    id: "notif-4",
    type: "streak.milestone",
    title: "🔥 10 Day Streak!",
    body: "Amazing! You maintained your streak for 10 days. XP multiplier is now 1.25x.",
    is_read: true,
    created_at: new Date(Date.now() - 2 * 86_400_000).toISOString(),
  },
];

const STORE_ITEMS = [
  {
    id: "item-1",
    name: "Cosmic Trail",
    description: "An ethereal starfield background for your profile.",
    category: "background",
    rarity: "epic",
    coin_cost: 800,
    asset_url:
      "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&auto=format",
    is_limited: false,
  },
  {
    id: "item-2",
    name: "Streak Master",
    description: "Title earned by those who never miss a day.",
    category: "title",
    rarity: "rare",
    coin_cost: 500,
    is_limited: false,
    asset_url: null,
  },
  {
    id: "item-3",
    name: "Golden Goal Badge",
    description: "Limited edition badge for early adopters.",
    category: "goal_badge",
    rarity: "legendary",
    coin_cost: 2000,
    is_limited: true,
    stock: 5,
    asset_url: null,
  },
  {
    id: "item-4",
    name: "Streak Freeze",
    description: "Protect your streak for one missed day.",
    category: "goal_badge",
    rarity: "common",
    coin_cost: 100,
    is_limited: false,
    asset_url: null,
  },
  {
    id: "item-5",
    name: "Blueprint Theme",
    description: "Clean, engineering-inspired card theme.",
    category: "card_theme",
    rarity: "rare",
    coin_cost: 600,
    is_limited: false,
    asset_url: null,
  },
  {
    id: "item-6",
    name: "Summit Avatar Frame",
    description: "A mountain peak frame for top performers.",
    category: "avatar",
    rarity: "epic",
    coin_cost: 750,
    is_limited: false,
    asset_url: null,
  },
];

const ACHIEVEMENTS = [
  {
    id: "achv-1",
    name: "First Steps",
    description: "Create your first goal",
    icon: "🎯",
    unlocked: true,
    unlocked_at: "2026-01-01T10:00:00Z",
  },
  {
    id: "achv-2",
    name: "On A Roll",
    description: "Complete 7 tasks in a row",
    icon: "🔥",
    unlocked: true,
    unlocked_at: "2026-01-08T08:00:00Z",
  },
  {
    id: "achv-3",
    name: "Buddy Up",
    description: "Get matched with your first accountability buddy",
    icon: "🤝",
    unlocked: true,
    unlocked_at: "2026-01-10T09:00:00Z",
  },
  {
    id: "achv-4",
    name: "Proof Collector",
    description: "Submit 10 proof photos",
    icon: "📸",
    unlocked: false,
    progress: 6,
    max_progress: 10,
  },
  {
    id: "achv-5",
    name: "Community Pillar",
    description: "Join 3 communities",
    icon: "🏛️",
    unlocked: false,
    progress: 2,
    max_progress: 3,
  },
  {
    id: "achv-6",
    name: "Century Run",
    description: "Accumulate 100 completed tasks",
    icon: "💯",
    unlocked: false,
    progress: 28,
    max_progress: 100,
  },
  {
    id: "achv-7",
    name: "Marathon Finisher",
    description: "Complete a goal that runs for 6+ months",
    icon: "🏅",
    unlocked: false,
    progress: 0,
    max_progress: 1,
  },
];

const LIBRARY = [
  {
    id: "lib-1",
    title: "Couch to 5K",
    description:
      "A beginner-friendly 8-week running plan to go from zero to 5km.",
    category: "fitness",
    difficulty: "beginner",
    estimated_days: 56,
    adoption_count: 4320,
    tags: ["running", "fitness", "beginner"],
    is_curated: true,
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "lib-2",
    title: "Learn a New Language in 90 Days",
    description:
      "Structured daily study sessions to reach conversational fluency.",
    category: "learning",
    difficulty: "intermediate",
    estimated_days: 90,
    adoption_count: 2180,
    tags: ["language", "learning", "daily"],
    is_curated: true,
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "lib-3",
    title: "Daily Meditation Practice",
    description: "Build a consistent mindfulness habit with guided sessions.",
    category: "health",
    difficulty: "beginner",
    estimated_days: 30,
    adoption_count: 8900,
    tags: ["meditation", "wellness", "mindfulness"],
    is_curated: true,
    created_at: "2025-01-01T00:00:00Z",
  },
];

// ─── Handlers ─────────────────────────────────────────────────────────────────

export const handlers = [
  // ── USERS ──────────────────────────────────────────────────────────────────
  http.get(`${API_URL}/v1/users/me`, async () => {
    await delay(LAT);
    return HttpResponse.json(ME);
  }),

  http.patch(`${API_URL}/v1/users/me`, async ({ request }) => {
    await delay(LAT);
    const updates = (await request.json()) as any;
    return HttpResponse.json({
      ...ME,
      ...updates,
      updated_at: new Date().toISOString(),
    });
  }),

  // ── GOALS ──────────────────────────────────────────────────────────────────
  http.get(`${API_URL}/v1/goals`, async () => {
    await delay(LAT);
    return HttpResponse.json(GOALS);
  }),

  http.post(`${API_URL}/v1/goals`, async ({ request }) => {
    await delay(LAT);
    const data = (await request.json()) as any;
    const newGoal = {
      id: `goal-${Date.now()}`,
      user_id: ME.id,
      status: "active",
      progress_pct: 0,
      task_count: 0,
      completed_task_count: 0,
      tags: [],
      start_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data,
    };
    return HttpResponse.json(newGoal, { status: 201 });
  }),

  http.get(`${API_URL}/v1/goals/:id`, async ({ params }) => {
    await delay(LAT);
    const goal = GOALS.find((g) => g.id === params.id) || GOALS[0];
    return HttpResponse.json({ ...goal, id: params.id });
  }),

  http.patch(`${API_URL}/v1/goals/:id`, async ({ params, request }) => {
    await delay(LAT);
    const updates = (await request.json()) as any;
    const goal = GOALS.find((g) => g.id === params.id) || GOALS[0];
    return HttpResponse.json({
      ...goal,
      ...updates,
      updated_at: new Date().toISOString(),
    });
  }),

  http.delete(`${API_URL}/v1/goals/:id`, async () => {
    await delay(LAT);
    return HttpResponse.json({ success: true });
  }),

  http.get(`${API_URL}/v1/goals/:id/timeline`, async () => {
    await delay(LAT);
    return HttpResponse.json([
      {
        id: "te-1",
        event_type: "TASK_COMPLETED",
        description: 'Completed "Morning Run 5km"',
        xp_earned: 150,
        created_at: new Date(Date.now() - 3_600_000).toISOString(),
      },
      {
        id: "te-2",
        event_type: "PROOF_VERIFIED",
        description: "Alex verified your gRPC module proof.",
        xp_earned: 200,
        created_at: new Date(Date.now() - 86_400_000).toISOString(),
      },
      {
        id: "te-3",
        event_type: "MILESTONE_REACHED",
        description: "Hit 40% completion milestone!",
        xp_earned: 500,
        created_at: new Date(Date.now() - 5 * 86_400_000).toISOString(),
      },
      {
        id: "te-4",
        event_type: "GOAL_CREATED",
        description: "Goal created 🎉",
        xp_earned: 50,
        created_at: "2026-01-01T08:00:00Z",
      },
    ]);
  }),

  // ── TASKS ──────────────────────────────────────────────────────────────────
  http.get(`${API_URL}/v1/tasks`, async ({ request }) => {
    await delay(LAT);
    const url = new URL(request.url);
    const goalId = url.searchParams.get("goal_id");
    const tasks = goalId ? TASKS.filter((t) => t.goal_id === goalId) : TASKS;
    return HttpResponse.json(tasks);
  }),

  http.get(`${API_URL}/v1/tasks/calendar`, async () => {
    await delay(LAT);
    return HttpResponse.json(TASKS.filter((t) => t.scheduled_at));
  }),

  http.post(`${API_URL}/v1/tasks`, async ({ request }) => {
    await delay(LAT);
    const data = (await request.json()) as any;
    return HttpResponse.json(
      {
        id: `task-${Date.now()}`,
        user_id: ME.id,
        status: "pending",
        tags: [],
        created_at: new Date().toISOString(),
        ...data,
        goal_title: GOALS.find((g) => g.id === data.goal_id)?.title,
      },
      { status: 201 },
    );
  }),

  http.patch(`${API_URL}/v1/tasks/:id`, async ({ params, request }) => {
    await delay(LAT);
    const updates = (await request.json()) as any;
    const task = TASKS.find((t) => t.id === params.id) || TASKS[0];
    return HttpResponse.json({ ...task, ...updates });
  }),

  http.post(`${API_URL}/v1/tasks/:id/complete`, async ({ params }) => {
    await delay(LAT);
    const task = TASKS.find((t) => t.id === params.id);
    const proofRequired = task?.proof_required;
    return HttpResponse.json({
      success: true,
      new_status: proofRequired ? "completed_unverified" : "completed_verified",
      xp_earned: proofRequired ? 0 : task?.xp_value || 100,
      proof_required: proofRequired,
    });
  }),

  http.post(`${API_URL}/v1/tasks/:id/skip`, async () => {
    await delay(LAT);
    return HttpResponse.json({ success: true, new_status: "skipped" });
  }),

  // ── COMMUNITY ──────────────────────────────────────────────────────────────
  http.get(`${API_URL}/v1/communities`, async () => {
    await delay(LAT);
    return HttpResponse.json(COMMUNITIES);
  }),

  http.get(`${API_URL}/v1/communities/feed`, async () => {
    await delay(LAT);
    return HttpResponse.json([
      {
        id: "feed-1",
        user_id: "user-alex",
        user_name: "Alex K.",
        user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
        user_level: 15,
        event_type: "TASK_COMPLETED",
        description:
          "Smashed a 10km run at 5:20/km pace. New personal best! 💪",
        goal_title: "Run a Full Marathon",
        xp_earned: 200,
        likes: 8,
        liked_by_me: false,
        created_at: new Date(Date.now() - 1_200_000).toISOString(),
      },
      {
        id: "feed-2",
        user_id: "user-priya",
        user_name: "Priya M.",
        user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
        user_level: 12,
        event_type: "GOAL_MILESTONE",
        description:
          'Reached 50% on my "Learn Spanish" goal. Conversational next! 🇪🇸',
        goal_title: "Learn Spanish in 90 Days",
        xp_earned: 500,
        likes: 23,
        liked_by_me: true,
        created_at: new Date(Date.now() - 3 * 3_600_000).toISOString(),
      },
      {
        id: "feed-3",
        user_id: ME.id,
        user_name: ME.display_name,
        user_avatar: ME.avatar_url,
        user_level: ME.level,
        event_type: "PROOF_VERIFIED",
        description:
          "gRPC module proof verified by buddy — officially backend brained 🧠",
        goal_title: "Learn Golang & Microservices",
        xp_earned: 150,
        likes: 5,
        liked_by_me: false,
        created_at: new Date(Date.now() - 86_400_000).toISOString(),
      },
    ]);
  }),

  http.post(`${API_URL}/v1/communities`, async ({ request }) => {
    await delay(LAT);
    const data = (await request.json()) as any;
    return HttpResponse.json(
      {
        id: `community-${Date.now()}`,
        member_count: 1,
        active_goal_count: 0,
        is_member: true,
        role: "admin",
        created_by: ME.id,
        created_at: new Date().toISOString(),
        ...data,
      },
      { status: 201 },
    );
  }),

  http.get(`${API_URL}/v1/communities/:id`, async ({ params }) => {
    await delay(LAT);
    const community =
      COMMUNITIES.find((c) => c.id === params.id) || COMMUNITIES[0];
    return HttpResponse.json({ ...community, id: params.id });
  }),

  http.post(`${API_URL}/v1/communities/:id/join`, async () => {
    await delay(LAT);
    return HttpResponse.json({ success: true });
  }),

  http.post(`${API_URL}/v1/communities/:id/leave`, async () => {
    await delay(LAT);
    return HttpResponse.json({ success: true });
  }),

  http.get(`${API_URL}/v1/communities/:id/leaderboard`, async () => {
    await delay(LAT);
    return HttpResponse.json(LEADERBOARD);
  }),

  http.get(`${API_URL}/v1/communities/:id/members`, async () => {
    await delay(LAT);
    return HttpResponse.json([
      {
        user_id: ME.id,
        display_name: ME.display_name,
        avatar_url: ME.avatar_url,
        level: ME.level,
        role: "member",
        joined_at: "2026-01-01T08:00:00Z",
      },
      {
        user_id: "user-alex",
        display_name: "Alex K.",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
        level: 15,
        role: "admin",
        joined_at: "2025-10-15T08:00:00Z",
      },
      {
        user_id: "user-priya",
        display_name: "Priya M.",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
        level: 12,
        role: "member",
        joined_at: "2025-11-01T08:00:00Z",
      },
    ]);
  }),

  http.get(`${API_URL}/v1/communities/:id/feed`, async () => {
    await delay(LAT);
    return HttpResponse.json([]);
  }),

  // ── BUDDY ──────────────────────────────────────────────────────────────────
  http.get(`${API_URL}/v1/buddy`, async () => {
    await delay(LAT);
    return HttpResponse.json(BUDDY);
  }),

  http.post(`${API_URL}/v1/buddy/request`, async () => {
    await delay(LAT);
    return HttpResponse.json({ success: true, buddy: BUDDY });
  }),

  // ── VERIFICATION / PROOFS ──────────────────────────────────────────────────
  http.get(`${API_URL}/v1/proofs/pending`, async () => {
    await delay(LAT);
    return HttpResponse.json([PENDING_PROOF]);
  }),

  http.get(`${API_URL}/v1/proofs/:id`, async ({ params }) => {
    await delay(LAT);
    return HttpResponse.json({ ...PENDING_PROOF, id: params.id });
  }),

  http.post(`${API_URL}/v1/proofs/:id/review`, async ({ request }) => {
    await delay(LAT);
    const { approved } = (await request.json()) as any;
    return HttpResponse.json({
      success: true,
      new_status: approved ? "approved" : "rejected",
    });
  }),

  http.post(`${API_URL}/v1/verification/proof`, async () => {
    await delay(1200);
    return HttpResponse.json(
      { success: true, verification_id: `verif-${Date.now()}` },
      { status: 201 },
    );
  }),

  // ── NOTIFICATIONS ──────────────────────────────────────────────────────────
  http.get(`${API_URL}/v1/notifications`, async () => {
    await delay(LAT);
    return HttpResponse.json(NOTIFICATIONS);
  }),

  http.patch(`${API_URL}/v1/notifications/:id/read`, async () => {
    await delay(200);
    return HttpResponse.json({ success: true });
  }),

  http.patch(`${API_URL}/v1/notifications/read-all`, async () => {
    await delay(200);
    return HttpResponse.json({ success: true });
  }),

  // ── STORE ──────────────────────────────────────────────────────────────────
  http.get(`${API_URL}/v1/store/items`, async ({ request }) => {
    await delay(LAT);
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const rarity = url.searchParams.get("rarity");
    let items = STORE_ITEMS;
    if (category) items = items.filter((i) => i.category === category);
    if (rarity) items = items.filter((i) => i.rarity === rarity);
    return HttpResponse.json(items);
  }),

  http.post(`${API_URL}/v1/store/purchase/:id`, async ({ params }) => {
    await delay(LAT);
    const item = STORE_ITEMS.find((i) => i.id === params.id);
    if (!item)
      return HttpResponse.json({ error: "Item not found" }, { status: 404 });
    if (item.coin_cost > ME.coins) {
      return HttpResponse.json(
        { error: "Insufficient coins" },
        { status: 402 },
      );
    }
    return HttpResponse.json({
      success: true,
      remaining_coins: ME.coins - item.coin_cost,
      item,
    });
  }),

  http.get(`${API_URL}/v1/store/inventory`, async () => {
    await delay(LAT);
    return HttpResponse.json([
      {
        ...STORE_ITEMS[3],
        is_owned: true,
        is_equipped: false,
        acquired_at: new Date(Date.now() - 7 * 86_400_000).toISOString(),
      },
    ]);
  }),

  // ── GAMIFICATION ──────────────────────────────────────────────────────────
  http.get(`${API_URL}/v1/gamification/leaderboard`, async () => {
    await delay(LAT);
    return HttpResponse.json(LEADERBOARD);
  }),

  http.get(`${API_URL}/v1/gamification/achievements`, async () => {
    await delay(LAT);
    return HttpResponse.json(ACHIEVEMENTS);
  }),

  // ── GOAL LIBRARY ───────────────────────────────────────────────────────────
  http.get(`${API_URL}/v1/goals/library`, async () => {
    await delay(LAT);
    return HttpResponse.json(LIBRARY);
  }),

  http.post(`${API_URL}/v1/goals/library/:id/adopt`, async ({ params }) => {
    await delay(LAT + 200);
    const lib = LIBRARY.find((l) => l.id === params.id) || LIBRARY[0];
    return HttpResponse.json(
      {
        id: `goal-${Date.now()}`,
        user_id: ME.id,
        title: lib.title,
        description: lib.description,
        category: lib.category,
        privacy: "private",
        status: "active",
        progress_pct: 0,
        target_date: new Date(
          Date.now() + lib.estimated_days * 86_400_000,
        ).toISOString(),
        start_date: new Date().toISOString(),
        tags: lib.tags,
        created_at: new Date().toISOString(),
      },
      { status: 201 },
    );
  }),

  // ── Internal / webhooks (bypass) ───────────────────────────────────────────
  http.post(`${API_URL}/internal/webhooks/auth`, async () => {
    return HttpResponse.json({ success: true });
  }),
];
