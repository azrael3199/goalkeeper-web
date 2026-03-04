import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { notificationsApi } from "../lib/api";
import { queryKeys } from "../lib/queryKeys";

export interface Notification {
  id: string;
  type: string;
  title: string;
  body?: string;
  action_url?: string;
  is_read: boolean;
  created_at: string;
}

export const useNotifications = () =>
  useQuery<Notification[]>({
    queryKey: queryKeys.notifications.feed,
    queryFn: () => notificationsApi.list(),
    refetchInterval: 60_000, // Poll every 60s
  });

export const useUnreadCount = () =>
  useQuery<number>({
    queryKey: queryKeys.notifications.count,
    queryFn: async () => {
      const data = await notificationsApi.list();
      return data.filter((n: Notification) => !n.is_read).length;
    },
    refetchInterval: 60_000,
  });

export const useMarkReadMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onMutate: async (id) => {
      qc.setQueryData(
        queryKeys.notifications.feed,
        (old: Notification[] = []) =>
          old.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.notifications.count });
    },
  });
};

export const useMarkAllReadMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () => {
      qc.setQueryData(
        queryKeys.notifications.feed,
        (old: Notification[] = []) => old.map((n) => ({ ...n, is_read: true })),
      );
      qc.invalidateQueries({ queryKey: queryKeys.notifications.count });
      toast.success("All notifications marked as read");
    },
  });
};
