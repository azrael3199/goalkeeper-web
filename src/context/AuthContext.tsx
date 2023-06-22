'use client';

import React, { ReactElement, createContext, useState } from 'react';
import { User } from 'firebase/auth';

export interface IAuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface IAuthContextProps {
  authState: IAuthState;
  // eslint-disable-next-line no-unused-vars
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContextProps>({
  authState: { isAuthenticated: false, user: null },
  login: () => Promise.resolve(),
  logout: () => {},
});

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  // eslint-disable-next-line no-unused-vars
  const [authState, setAuthState] = useState<IAuthState>({
    isAuthenticated: false,
    user: null,
  });

  // eslint-disable-next-line no-unused-vars
  const login = async (email: string, password: string) => {
    // TODO: Perform your login logic here
  };

  const logout = () => {
    // TODO: Perform your logout logic here
  };

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
