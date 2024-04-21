import React from 'react';
import './globals.css';
import { Inter as FontSans } from 'next/font/google';
import { AppProvider } from '@root/context/AppContext';

import { cn } from '@root/lib/utils/utils';
import { Toaster } from '@root/components/ui/toaster';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

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
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased dark:bg-background',
          fontSans.variable
        )}
      >
        <AppProvider>
          {children}
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
