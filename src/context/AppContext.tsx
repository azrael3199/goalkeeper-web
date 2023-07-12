'use client';

import { createContext, useState } from 'react';

type IAppContextProps = {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
};

export const AppContext = createContext<IAppContextProps>({
  isLoading: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setLoading: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <AppContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </AppContext.Provider>
  );
}
