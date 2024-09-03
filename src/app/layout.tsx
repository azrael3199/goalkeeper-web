'use client';

import React from 'react';
import './globals.css';
import { Inter as FontSans } from 'next/font/google';
import { Provider } from 'react-redux';
import { AppProvider } from '@root/providers/AppProvider';

import { cn } from '@root/lib/utils/utils';
import { Toaster } from '@root/components/ui/toaster';
import ThemeProvider from '@root/providers/ThemeProvider';
import store from '@root/lib/redux/store';
import { ApolloProvider } from '@apollo/client';
import apolloClient from '@root/lib/services/graphql/config';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@root/lib/services/apis/config';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const metadata = {
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
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased dark:bg-background',
          fontSans.variable
        )}
      >
        <ThemeProvider defaultTheme="dark">
          <QueryClientProvider client={queryClient}>
            <ApolloProvider client={apolloClient}>
              <AppProvider>
                <Provider store={store}>{children}</Provider>
                <Toaster />
              </AppProvider>
            </ApolloProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
