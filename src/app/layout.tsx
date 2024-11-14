import React from 'react';
import './globals.css';
import { cn } from '@root/lib/utils/utils';
import { fontSans } from './fonts';

export const metadata = {
  title: 'GoalKeeper',
  description: 'An app for you to achieve your dreams',
  manifest: '/manifest.json',
  themeColor: '#060713',
  backgroundColor: '#060713',
  keywords: ['goal', 'keeper', 'goalkeeper', 'goal keeper'],
  viewport:
    'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover',
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
        {children}
      </body>
    </html>
  );
}
