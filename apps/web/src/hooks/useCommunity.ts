import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  communityApi,
  buddyApi,
  type CreateCommunityPayload,
} from "../lib/api";
import { queryKeys } from "../lib/queryKeys";

export interface Community {
  id: string;
  name: string;
  description?: string;
  avatar_url?: string;
  privacy: "open" | "invite_only" | "private";
  member_count: number;
  active_goal_count: number;
  buddy_rotation_days: number;
  is_member: boolean;
  role?: "admin" | "moderator" | "member";
  created_by: string;
  created_at: string;
}

export interface Buddy {
  id: string;
  buddy_id: string;
  buddy_name: string;
  buddy_avatar?: string;
  buddy_level: number;
  goal_id: string;
  goal_title: string;
  community_id: string;
  rotation_end: string;
  verification_score: number;
  pending_proofs: number;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  display_name: string;
  avatar_url?: string;
  level: number;
  total_xp: number;
  is_you?: boolean;
}

export const useCommunities = () =>
  useQuery<Community[]>({
    queryKey: queryKeys.community.all,
    queryFn: communityApi.list,
  });

export const useCommunityById = (id: string) =>
  useQuery<Community>({
    queryKey: queryKeys.community.byId(id),
    queryFn: () => communityApi.getById(id),
    enabled: !!id,
  });

export const useCommunityLeaderboard = (id: string, window = "all") =>
  useQuery<LeaderboardEntry[]>({
    queryKey: queryKeys.community.leaderboard(id, window),
    queryFn: () => communityApi.leaderboard(id, window),
    enabled: !!id,
  });

export const useCommunityFeed = (id?: string) =>
  useQuery({
    queryKey: id ? queryKeys.community.feed(id) : ["community", "global-feed"],
    queryFn: () => communityApi.feed(id),
  });

export const useCreateCommunityMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCommunityPayload) => communityApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.community.all });
      toast.success("Community created! 🏆");
    },
    onError: () => toast.error("Failed to create community"),
  });
};

export const useJoinCommunityMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => communityApi.join(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.community.all });
      toast.success("Joined community! 🎉");
    },
    onError: () => toast.error("Failed to join community"),
  });
};

// Buddy
export const useBuddy = () =>
  useQuery<Buddy | null>({
    queryKey: queryKeys.buddy.current,
    queryFn: buddyApi.getCurrent,
  });
