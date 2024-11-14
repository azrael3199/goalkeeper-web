'use client';

import Header from '@root/components/LandingHeader';
import ProtectedRoute from '@root/components/ProtectedRoute';
import LoadingOverlay from '@root/components/LoadingOverlay';
import { AppContext } from '@root/providers/AppProvider';
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

const LandingPage = () => {
  const { isLoading, setLoading } = useContext(AppContext);

  useEffect(() => {
    if (isLoading) setLoading(false); // Workaround till Next introduces interceptors
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
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
  );
};

export default LandingPage;
