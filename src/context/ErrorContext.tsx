'use client';

import ErrorPopup from '@root/components/ErrorPopup';
import React, { createContext, useState } from 'react';

type IErrorContextProps = {
  showError: (errorMessage: string | null) => void;
  hideError: () => void;
};

export const ErrorContext = createContext<IErrorContextProps>({
  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  showError: (errorMessage: string | null) => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  hideError: () => {},
});

export const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
  const [error, setError] = useState<string | null>(null);

  const showError = (errorMessage: string | null) => {
    setError(errorMessage);
  };

  const hideError = () => {
    setError(null);
  };

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <ErrorContext.Provider value={{ showError, hideError }}>
      {children}
      {error && <ErrorPopup message={error} reset={hideError} />}
    </ErrorContext.Provider>
  );
};
