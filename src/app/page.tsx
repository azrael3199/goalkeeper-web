'use client';

import Header from '@root/components/LandingHeader';
import ProtectedRoute from '@root/components/ProtectedRoute';
import LoadingOverlay from '@root/components/LoadingOverlay';
import { AppContext, AppProvider } from '@root/providers/AppProvider';
import i18n from '@root/i18n';
import paths from '@root/routes';
import { useContext, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import Hero from '@root/components/Hero';
import Stats from '@root/components/Stats';
import Features from '@root/components/Features';
import Dashboard from '@root/components/Dashboard';
import Pricing from '@root/components/Pricing';
import AboutUs from '@root/components/AboutUs';
import ThemeProvider from '@root/providers/ThemeProvider';
import { QueryClientProvider } from '@tanstack/react-query';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import { Toaster } from '@root/components/ui/toaster';
import { queryClient } from '@root/lib/services/apis/config';
import apolloClient from '@root/lib/services/graphql/config';
import store from '@root/lib/redux/store';

const LandingPage = () => {
  const { isLoading, setLoading } = useContext(AppContext);

  useEffect(() => {
    if (isLoading) setLoading(false); // Workaround till Next introduces interceptors
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <ApolloProvider client={apolloClient}>
          <AppProvider>
            <Provider store={store}>
              <ProtectedRoute
                defaultRedirectRoute={paths.dashboard}
                preventRedirectOnAuthFail
              >
                <I18nextProvider i18n={i18n}>
                  <div className="min-h-screen bg-gray-900 text-white">
                    <Header />
                    <main>
                      <Hero />
                      <Stats />
                      <Features />
                      <Dashboard />
                      <Pricing />
                      <AboutUs />
                    </main>
                  </div>
                  <LoadingOverlay />
                </I18nextProvider>
              </ProtectedRoute>
            </Provider>
            <Toaster />
          </AppProvider>
        </ApolloProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default LandingPage;
