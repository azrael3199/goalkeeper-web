'use client';

import { User } from 'firebase/auth';
import { createContext, useState } from 'react';

type IAppContextProps = {
  user: User | null;
  isLoading: boolean;
  redirectRoute: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setRedirectRoute: (route: string | null) => void;
};

export const AppContext = createContext<IAppContextProps>({
  user: null,
  isLoading: false,
  redirectRoute: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUser: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setLoading: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setRedirectRoute: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [redirectRoute, setRedirectRoute] = useState<string | null>(null);

  return (
    <AppContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        user,
        isLoading,
        redirectRoute,
        setUser,
        setLoading,
        setRedirectRoute,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
