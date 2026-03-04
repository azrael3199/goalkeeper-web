import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usersApi } from "../lib/api";
import { queryKeys } from "../lib/queryKeys";

export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string;
  level: number;
  total_xp: number;
  coins: number;
  streak_current: number;
  streak_best: number;
  solo_mode: boolean;
  timezone_offset: number;
  created_at: string;
  updated_at: string;
}

export const useUserQuery = () =>
  useQuery<User>({
    queryKey: queryKeys.user.me,
    queryFn: usersApi.me,
  });

export const useUpdateUserMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersApi.updateMe,
    onSuccess: (updated) => {
      qc.setQueryData(queryKeys.user.me, updated);
      toast.success("Profile updated!");
    },
    onError: () => toast.error("Failed to update profile"),
  });
};
