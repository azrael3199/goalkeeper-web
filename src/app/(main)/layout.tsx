'use client';

import Header from '@root/components/Header';
import ProtectedRoute from '@root/components/ProtectedRoute';
import LoadingOverlay from '@root/components/LoadingOverlay';
import Sidebar from '@root/components/Sidebar';
import MobileSidebar from '@root/components/MobileSidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col md:flex-row">
        <Sidebar />
        <main className="h-full w-full grow md:grow-0">
          <Header />
          {children}
          <LoadingOverlay />
        </main>
        <MobileSidebar />
      </div>
    </ProtectedRoute>
  );
}
