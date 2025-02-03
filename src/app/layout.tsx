import React from 'react';
import './globals.css';
import Providers from '@root/providers';
import { cn } from '@root/lib/utils/utils';
import { fontSans } from './fonts';

export const metadata = {
  title: 'GoalKeeper',
  description: 'An app for you to achieve your dreams',
  manifest: '/manifest.json',
  keywords: ['goal', 'keeper', 'goalkeeper', 'goal keeper'],
};

export const viewport = {
  minimumScale: 1,
  initialScale: 1,
  width: 'device-width',
  shrinkToFit: 'no',
  viewportFit: 'cover',
  themeColor: '#060713',
  backgroundColor: '#060713',
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
          'min-h-screen bg-background font-sans antialiased bg-background',
          fontSans.variable
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
