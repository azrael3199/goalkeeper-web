import React from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import { AppProvider } from '@root/context/AppContext';
import { AuthProvider } from '@root/context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Goalkeeper | Small steps to success',
  description: 'An app for you to achieve your dreams',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} dark:bg-slate-900`}>
        <AppProvider>
          <AuthProvider>{children}</AuthProvider>
        </AppProvider>
      </body>
    </html>
  );
}
