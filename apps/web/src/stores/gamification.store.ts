import { create } from "zustand";

interface GamificationSnapshot {
  xp: number;
  coins: number;
  level: number;
  streak: number;
}

interface GamificationStore {
  xp: number;
  coins: number;
  level: number;
  streak: number;
  pendingXP: number;
  pendingCoins: number;
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  clearPending: () => void;
  syncFromServer: (snapshot: GamificationSnapshot) => void;
}

export const useGamificationStore = create<GamificationStore>((set) => ({
  xp: 0,
  coins: 0,
  level: 1,
  streak: 0,
  pendingXP: 0,
  pendingCoins: 0,

  addXP: (amount) =>
    set((s) => ({
      xp: s.xp + amount,
      pendingXP: s.pendingXP + amount,
    })),

  addCoins: (amount) =>
    set((s) => ({
      coins: s.coins + amount,
      pendingCoins: s.pendingCoins + amount,
    })),

  clearPending: () => set({ pendingXP: 0, pendingCoins: 0 }),

  syncFromServer: (snap) =>
    set({
      xp: snap.xp,
      coins: snap.coins,
      level: snap.level,
      streak: snap.streak,
    }),
}));
