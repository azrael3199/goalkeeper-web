'use client';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from '@root/i18n';
import { queryClient } from '@root/lib/services/apis/config';
import apolloClient from '@root/lib/services/graphql/config';
import store from '@root/lib/redux/store';
import { Toaster } from '@root/components/ui/toaster';
import LoadingOverlay from '@root/components/LoadingOverlay';
import { AppProvider } from './AppProvider';
import ThemeProvider from './ThemeProvider';

const Providers = ({ children }: { children: React.ReactNode }) => (
  <AppProvider>
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <ApolloProvider client={apolloClient}>
            <Provider store={store}>{children}</Provider>
            <Toaster />
            <LoadingOverlay />
          </ApolloProvider>
        </QueryClientProvider>
      </I18nextProvider>
    </ThemeProvider>
  </AppProvider>
);

export default Providers;
