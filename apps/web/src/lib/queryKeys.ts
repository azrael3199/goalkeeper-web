// Centralised, type-safe React Query key factory — matches LLD spec
export const queryKeys = {
  user: {
    me: ["user", "me"] as const,
  },
  goals: {
    all: ["goals"] as const,
    byId: (id: string) => ["goals", id] as const,
    timeline: (id: string) => ["goals", id, "timeline"] as const,
  },
  tasks: {
    all: ["tasks"] as const,
    byGoal: (goalId: string) => ["tasks", "goal", goalId] as const,
    calendar: (from: string, to: string) =>
      ["tasks", "calendar", from, to] as const,
    byId: (id: string) => ["tasks", id] as const,
  },
  community: {
    all: ["communities"] as const,
    byId: (id: string) => ["communities", id] as const,
    leaderboard: (id: string, window: string) =>
      ["communities", id, "lb", window] as const,
    members: (id: string) => ["communities", id, "members"] as const,
    feed: (id: string) => ["communities", id, "feed"] as const,
  },
  buddy: {
    current: ["buddy", "current"] as const,
  },
  proofs: {
    pending: ["proofs", "pending"] as const,
    byId: (id: string) => ["proofs", id] as const,
  },
  notifications: {
    feed: ["notifications", "feed"] as const,
    count: ["notifications", "count"] as const,
  },
  gamification: {
    me: ["gamification", "me"] as const,
    leaderboard: ["gamification", "leaderboard"] as const,
    achievements: ["gamification", "achievements"] as const,
  },
  store: {
    items: (category?: string, rarity?: string) =>
      ["store", "items", category, rarity] as const,
    inventory: ["store", "inventory"] as const,
  },
  library: {
    all: ["library"] as const,
  },
} as const;
