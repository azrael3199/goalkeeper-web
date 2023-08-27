'use client';

import Navbar from '@root/components/client/Navbar';
import ProtectedRoute from '@root/components/client/ProtectedRoute';
import LoadingOverlay from '@root/components/server/LoadingOverlay';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <main className="min-h-screen">
        <Navbar />
        {children}
        <LoadingOverlay />
      </main>
    </ProtectedRoute>
  );
}
