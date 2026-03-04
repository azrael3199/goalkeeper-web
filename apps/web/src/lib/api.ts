import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const isMocking = import.meta.env.VITE_USE_MSW === "true";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// ── Error formatter ────────────────────────────────────────────────────────
export function formatApiError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    // RFC 7807 Problem Details format
    const data = err.response?.data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    if (err.message) return err.message;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
}

// ── Global response interceptor ────────────────────────────────────────────
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    // Don't toast auth redirects — handled by AuthGuard
    if (status !== 401) {
      toast.error(formatApiError(err));
    }
    return Promise.reject(err);
  },
);

// ── Auth interceptor (non-MSW only) ───────────────────────────────────────
export const setupAxiosInterceptor = (
  getToken: () => Promise<string | null>,
) => {
  if (isMocking) return; // No auth headers needed in MSW mode
  apiClient.interceptors.request.use(
    async (config) => {
      const token = await getToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error),
  );
};

// ── Users ─────────────────────────────────────────────────────────────
export const usersApi = {
  me: () => apiClient.get("/v1/users/me").then((r) => r.data),
  updateMe: (
    data: Partial<{
      display_name: string;
      avatar_url: string;
      solo_mode: boolean;
    }>,
  ) => apiClient.patch("/v1/users/me", data).then((r) => r.data),
};

// ── Goals ─────────────────────────────────────────────────────────────
export const goalsApi = {
  list: (filters?: Record<string, string>) =>
    apiClient.get("/v1/goals", { params: filters }).then((r) => r.data),
  getById: (id: string) => apiClient.get(`/v1/goals/${id}`).then((r) => r.data),
  create: (data: CreateGoalPayload) =>
    apiClient.post("/v1/goals", data).then((r) => r.data),
  update: (id: string, data: Partial<CreateGoalPayload>) =>
    apiClient.patch(`/v1/goals/${id}`, data).then((r) => r.data),
  delete: (id: string) =>
    apiClient.delete(`/v1/goals/${id}`).then((r) => r.data),
  getTimeline: (id: string) =>
    apiClient.get(`/v1/goals/${id}/timeline`).then((r) => r.data),
};

// ── Tasks ─────────────────────────────────────────────────────────────
export const tasksApi = {
  list: (filters?: { goal_id?: string; status?: string }) =>
    apiClient.get("/v1/tasks", { params: filters }).then((r) => r.data),
  calendar: (from: string, to: string) =>
    apiClient
      .get("/v1/tasks/calendar", { params: { from, to } })
      .then((r) => r.data),
  getById: (id: string) => apiClient.get(`/v1/tasks/${id}`).then((r) => r.data),
  create: (data: CreateTaskPayload) =>
    apiClient.post("/v1/tasks", data).then((r) => r.data),
  update: (id: string, data: Partial<CreateTaskPayload>) =>
    apiClient.patch(`/v1/tasks/${id}`, data).then((r) => r.data),
  complete: (id: string, note?: string) =>
    apiClient.post(`/v1/tasks/${id}/complete`, { note }).then((r) => r.data),
  skip: (id: string, reason?: string) =>
    apiClient.post(`/v1/tasks/${id}/skip`, { reason }).then((r) => r.data),
};

// ── Community ─────────────────────────────────────────────────────────
export const communityApi = {
  list: () => apiClient.get("/v1/communities").then((r) => r.data),
  getById: (id: string) =>
    apiClient.get(`/v1/communities/${id}`).then((r) => r.data),
  create: (data: CreateCommunityPayload) =>
    apiClient.post("/v1/communities", data).then((r) => r.data),
  join: (id: string) =>
    apiClient.post(`/v1/communities/${id}/join`).then((r) => r.data),
  leave: (id: string) =>
    apiClient.post(`/v1/communities/${id}/leave`).then((r) => r.data),
  leaderboard: (id: string, window = "all") =>
    apiClient
      .get(`/v1/communities/${id}/leaderboard`, { params: { window } })
      .then((r) => r.data),
  members: (id: string) =>
    apiClient.get(`/v1/communities/${id}/members`).then((r) => r.data),
  feed: (id?: string) =>
    apiClient
      .get(id ? `/v1/communities/${id}/feed` : "/v1/communities/feed")
      .then((r) => r.data),
};

// ── Buddy ─────────────────────────────────────────────────────────────
export const buddyApi = {
  getCurrent: () => apiClient.get("/v1/buddy").then((r) => r.data),
  request: (goalId: string, communityId: string) =>
    apiClient
      .post("/v1/buddy/request", { goal_id: goalId, community_id: communityId })
      .then((r) => r.data),
};

// ── Verification ──────────────────────────────────────────────────────
export const verificationApi = {
  getPending: () => apiClient.get("/v1/proofs/pending").then((r) => r.data),
  getById: (id: string) =>
    apiClient.get(`/v1/proofs/${id}`).then((r) => r.data),
  review: (id: string, approved: boolean, comment?: string) =>
    apiClient
      .post(`/v1/proofs/${id}/review`, { approved, comment })
      .then((r) => r.data),
  submitProof: (formData: FormData) =>
    apiClient
      .post("/v1/verification/proof", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data),
};

// ── Notifications ─────────────────────────────────────────────────────
export const notificationsApi = {
  list: (cursor?: string) =>
    apiClient
      .get("/v1/notifications", { params: { cursor, limit: 20 } })
      .then((r) => r.data),
  markRead: (id: string) =>
    apiClient.patch(`/v1/notifications/${id}/read`).then((r) => r.data),
  markAllRead: () =>
    apiClient.patch("/v1/notifications/read-all").then((r) => r.data),
};

// ── Store ─────────────────────────────────────────────────────────────
export const storeApi = {
  items: (category?: string, rarity?: string) =>
    apiClient
      .get("/v1/store/items", { params: { category, rarity } })
      .then((r) => r.data),
  purchase: (itemId: string) =>
    apiClient.post(`/v1/store/purchase/${itemId}`).then((r) => r.data),
  inventory: () => apiClient.get("/v1/store/inventory").then((r) => r.data),
};

// ── Gamification ──────────────────────────────────────────────────────
export const gamificationApi = {
  leaderboard: () =>
    apiClient.get("/v1/gamification/leaderboard").then((r) => r.data),
  achievements: () =>
    apiClient.get("/v1/gamification/achievements").then((r) => r.data),
};

// ── Library ───────────────────────────────────────────────────────────
export const libraryApi = {
  list: (filters?: Record<string, string>) =>
    apiClient.get("/v1/goals/library", { params: filters }).then((r) => r.data),
  adopt: (id: string) =>
    apiClient.post(`/v1/goals/library/${id}/adopt`).then((r) => r.data),
};

// ── Payload types ──────────────────────────────────────────────────────
export interface CreateGoalPayload {
  title: string;
  description?: string;
  category?: string;
  privacy: "private" | "community" | "public";
  target_date: string;
  start_date?: string;
  tags?: string[];
  community_id?: string;
}

export interface CreateTaskPayload {
  goal_id: string;
  title: string;
  description?: string;
  type: "one_time" | "recurring";
  recurrence_rule?: RecurrenceRule;
  scheduled_at?: string;
  duration_mins?: number;
  priority: "low" | "medium" | "high";
  xp_value?: number;
  coin_value?: number;
  is_mandatory?: boolean;
  proof_required?: boolean;
  proof_type?: "photo" | "text" | "link" | "any";
  verification_window_hrs?: number;
  tags?: string[];
}

export interface RecurrenceRule {
  freq: "daily" | "weekly" | "monthly" | "custom";
  interval?: number;
  byday?: string[];
  bymonthday?: number[];
  until?: string;
  cron?: string;
}

export interface CreateCommunityPayload {
  name: string;
  description?: string;
  privacy: "open" | "invite_only" | "private";
  max_members?: number;
}
