import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { goalsApi, type CreateGoalPayload } from "../lib/api";
import { queryKeys } from "../lib/queryKeys";

export interface Goal {
  id: string;
  user_id: string;
  community_id?: string;
  title: string;
  description?: string;
  category?: string;
  privacy: "private" | "community" | "public";
  status: "active" | "paused" | "completed" | "archived";
  target_date: string;
  start_date: string;
  progress_pct: number;
  tags: string[];
  task_count?: number;
  completed_task_count?: number;
  created_at: string;
  updated_at: string;
}

export const useGoals = (filters?: Record<string, string>) =>
  useQuery<Goal[]>({
    queryKey: [...queryKeys.goals.all, filters],
    queryFn: () => goalsApi.list(filters),
  });

export const useGoalById = (id: string) =>
  useQuery<Goal>({
    queryKey: queryKeys.goals.byId(id),
    queryFn: () => goalsApi.getById(id),
    enabled: !!id,
  });

export const useGoalTimeline = (goalId: string) =>
  useQuery({
    queryKey: queryKeys.goals.timeline(goalId),
    queryFn: () => goalsApi.getTimeline(goalId),
    enabled: !!goalId,
  });

export const useCreateGoalMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGoalPayload) => goalsApi.create(data),
    onSuccess: (newGoal) => {
      qc.setQueryData(queryKeys.goals.all, (old: Goal[] = []) => [
        newGoal,
        ...old,
      ]);
      qc.invalidateQueries({ queryKey: queryKeys.goals.all });
      toast.success("Goal created! 🎯");
    },
    onError: () => toast.error("Failed to create goal"),
  });
};

export const useUpdateGoalMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateGoalPayload>;
    }) => goalsApi.update(id, data),
    onSuccess: (updated) => {
      qc.setQueryData(queryKeys.goals.byId(updated.id), updated);
      qc.invalidateQueries({ queryKey: queryKeys.goals.all });
      toast.success("Goal updated!");
    },
    onError: () => toast.error("Failed to update goal"),
  });
};

export const useDeleteGoalMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => goalsApi.delete(id),
    onSuccess: (_data, id) => {
      qc.setQueryData(queryKeys.goals.all, (old: Goal[] = []) =>
        old.filter((g) => g.id !== id),
      );
      toast.success("Goal deleted");
    },
    onError: () => toast.error("Failed to delete goal"),
  });
};
