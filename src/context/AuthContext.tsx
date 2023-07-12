'use client';

import React, { ReactElement, createContext, useState } from 'react';
import { IdTokenResult, User } from 'firebase/auth';

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
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  logout: () => {},
});

const dummyUser: User = {
  displayName: "Mike O'Hearn",
  emailVerified: true,
  email: 'mikeyohearn@gmail.com',
  phoneNumber: '+1-202-555-0131',
  refreshToken: 'refresh-token',
  isAnonymous: false,
  metadata: {},
  providerData: [],
  tenantId: null,
  delete(): Promise<void> {
    throw new Error('Function not implemented.');
  },
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  getIdToken(forceRefresh?: boolean | undefined): Promise<string> {
    throw new Error('Function not implemented.');
  },
  getIdTokenResult(
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    forceRefresh?: boolean | undefined
  ): Promise<IdTokenResult> {
    throw new Error('Function not implemented.');
  },
  reload(): Promise<void> {
    throw new Error('Function not implemented.');
  },
  toJSON(): object {
    throw new Error('Function not implemented.');
  },
  photoURL:
    'https://cdn.shopify.com/s/files/1/1957/2713/files/tile-partner-mike-titan-ohearn_150x.png?v=1655998083',
  providerId: 'some-provider-id',
  uid: 'some-uid',
};

export function AuthProvider({
  children,
  isLocalDev = false,
}: {
  children: React.ReactNode;
  isLocalDev?: boolean;
}): ReactElement {
  const [authState, setAuthState] = useState<IAuthState>({
    isAuthenticated: false,
    user: null,
  });

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const login = async (email: string, password: string) => {
    // TODO: Perform your login logic here
    if (isLocalDev) {
      setAuthState({ isAuthenticated: true, user: dummyUser });
    }
  };

  const logout = () => {
    // TODO: Perform your logout logic here
    if (isLocalDev) {
      setAuthState({ isAuthenticated: false, user: null });
    }
  };

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
