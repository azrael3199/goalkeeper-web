'use client';

import Header from '@root/components/Header';
import ProtectedRoute from '@root/components/ProtectedRoute';
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
        <div className="overflow-hidden w-full flex flex-col grow">
          <Header />
          <main className="p-4 pt-2 md:pt-4 overflow-y-scroll">{children}</main>
        </div>
        <MobileNavbar />
      </div>
    </ProtectedRoute>
  );
}
