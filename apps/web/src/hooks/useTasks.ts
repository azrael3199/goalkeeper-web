import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { tasksApi, type CreateTaskPayload } from "../lib/api";
import { queryKeys } from "../lib/queryKeys";
import { useGamificationStore } from "../stores/gamification.store";

export type TaskStatus =
  | "scheduled"
  | "pending"
  | "completed_verified"
  | "completed_unverified"
  | "skipped"
  | "missed"
  | "failed";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  goal_id: string;
  user_id: string;
  title: string;
  description?: string;
  type: "one_time" | "recurring";
  status: TaskStatus;
  priority: TaskPriority;
  xp_value: number;
  coin_value: number;
  is_mandatory: boolean;
  proof_required: boolean;
  proof_type?: "photo" | "text" | "link" | "any";
  scheduled_at?: string;
  duration_mins?: number;
  completed_at?: string;
  tags: string[];
  goal_title?: string;
  created_at: string;
}

export const useTasks = (filters?: { goal_id?: string; status?: string }) =>
  useQuery<Task[]>({
    queryKey: filters?.goal_id
      ? queryKeys.tasks.byGoal(filters.goal_id)
      : queryKeys.tasks.all,
    queryFn: () => tasksApi.list(filters),
  });

export const useCalendarTasks = (from: string, to: string) =>
  useQuery<Task[]>({
    queryKey: queryKeys.tasks.calendar(from, to),
    queryFn: () => tasksApi.calendar(from, to),
    enabled: !!(from && to),
  });

export const useCreateTaskMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTaskPayload) => tasksApi.create(data),
    onSuccess: (newTask) => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks.all });
      if (newTask.goal_id) {
        qc.invalidateQueries({
          queryKey: queryKeys.tasks.byGoal(newTask.goal_id),
        });
      }
      toast.success("Task added! ✅");
    },
    onError: () => toast.error("Failed to create task"),
  });
};

export const useCompleteTaskMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      note,
    }: {
      id: string;
      note?: string;
      xp_value?: number;
      coin_value?: number;
    }) => tasksApi.complete(id, note),
    // Optimistic update — immediate UI feedback
    onMutate: async ({ id }) => {
      await qc.cancelQueries({ queryKey: queryKeys.tasks.all });
      const snapshot = qc.getQueryData<Task[]>(queryKeys.tasks.all);
      qc.setQueryData(queryKeys.tasks.all, (old: Task[] = []) =>
        old.map((t) =>
          t.id === id
            ? { ...t, status: "completed_verified" as TaskStatus }
            : t,
        ),
      );
      return { snapshot };
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks.all });
      qc.invalidateQueries({ queryKey: queryKeys.goals.all });
      qc.invalidateQueries({ queryKey: queryKeys.user.me });
      // Fire XP animation overlay via Zustand store
      const { addXP, addCoins } = useGamificationStore.getState();
      if (vars.xp_value) addXP(vars.xp_value);
      if (vars.coin_value) addCoins(vars.coin_value);
    },
    onError: (_err, _vars, ctx) => {
      // Roll back optimistic update
      if (ctx?.snapshot) qc.setQueryData(queryKeys.tasks.all, ctx.snapshot);
      // Error toast is handled globally by Axios interceptor — no duplicate toast here
    },
  });
};

export const useSkipTaskMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      tasksApi.skip(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks.all });
      toast.info("Task skipped");
    },
    onError: () => toast.error("Failed to skip task"),
  });
};
