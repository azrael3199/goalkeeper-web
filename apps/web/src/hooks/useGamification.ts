import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { storeApi, gamificationApi } from "../lib/api";
import { queryKeys } from "../lib/queryKeys";

export interface StoreItem {
  id: string;
  name: string;
  description?: string;
  category: "title" | "avatar" | "background" | "card_theme" | "goal_badge";
  rarity: "common" | "rare" | "epic" | "legendary";
  coin_cost: number;
  asset_url?: string;
  is_limited: boolean;
  stock?: number;
  is_owned?: boolean;
}

export interface InventoryItem extends StoreItem {
  is_equipped: boolean;
  acquired_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: string;
  unlocked: boolean;
  unlocked_at?: string;
  progress?: number;
  max_progress?: number;
}

export const useStoreItems = (category?: string, rarity?: string) =>
  useQuery<StoreItem[]>({
    queryKey: queryKeys.store.items(category, rarity),
    queryFn: () => storeApi.items(category, rarity),
  });

export const useInventory = () =>
  useQuery<InventoryItem[]>({
    queryKey: queryKeys.store.inventory,
    queryFn: storeApi.inventory,
  });

export const usePurchaseItemMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => storeApi.purchase(itemId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.user.me });
      qc.invalidateQueries({ queryKey: queryKeys.store.inventory });
      toast.success("Item purchased! 🛍️");
    },
    onError: () => toast.error("Purchase failed — check your coin balance"),
  });
};

export const useAchievements = () =>
  useQuery<Achievement[]>({
    queryKey: queryKeys.gamification.achievements,
    queryFn: gamificationApi.achievements,
  });

export const useGlobalLeaderboard = () =>
  useQuery({
    queryKey: queryKeys.gamification.leaderboard,
    queryFn: gamificationApi.leaderboard,
  });
