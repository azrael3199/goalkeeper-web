'use client';

import Header from '@root/components/LandingHeader';
import { AppContext } from '@root/providers/AppProvider';
import { useContext, useEffect } from 'react';
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
  );
};

export default LandingPage;
