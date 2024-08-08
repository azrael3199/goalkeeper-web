'use client';

import Header from '@root/components/Header';
import ProtectedRoute from '@root/components/ProtectedRoute';
import LoadingOverlay from '@root/components/LoadingOverlay';
import Navbar from '@root/components/Navbar/Navbar';
import MobileNavbar from '@root/components/Navbar/MobileNavbar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="h-screen max-h-screen flex flex-col md:flex-row">
        <Navbar />
        <main className="overflow-hidden w-full flex flex-col">
          <Header />
          {children}
          <LoadingOverlay />
        </main>
        <MobileNavbar />
      </div>
    </ProtectedRoute>
  );
}
