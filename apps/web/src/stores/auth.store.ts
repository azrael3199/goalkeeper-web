import { create } from 'zustand';

type User = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string;
};

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  isLoading: false, 
  login: async () => {
    set({ user: { id: 'test-user', email: 'test@example.com', displayName: 'Mock User', avatarUrl: '' }, accessToken: 'mock-token' });
  },
  logout: () => set({ user: null, accessToken: null }),
  refreshToken: async () => {},
}));
