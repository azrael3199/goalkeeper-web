'use client';

import React from 'react';
import './globals.css';
import { Provider } from 'react-redux';
import { AppProvider } from '@root/providers/AppProvider';
import Head from 'next/head';

import { cn } from '@root/lib/utils/utils';
import { Toaster } from '@root/components/ui/toaster';
import ThemeProvider from '@root/providers/ThemeProvider';
import store from '@root/lib/redux/store';
import { ApolloProvider } from '@apollo/client';
import apolloClient from '@root/lib/services/graphql/config';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@root/lib/services/apis/config';
import { fontSans } from './fonts';

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
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="icon"
          href="/android/mipmap-mdpi/ic_launcher.png"
          sizes="48x48"
        />
        <link
          rel="icon"
          href="/android/mipmap-hdpi/ic_launcher.png"
          sizes="72x72"
        />
        <link
          rel="icon"
          href="/android/mipmap-xhdpi/ic_launcher.png"
          sizes="96x96"
        />
        <link
          rel="icon"
          href="/android/mipmap-xxhdpi/ic_launcher.png"
          sizes="144x144"
        />
        <link
          rel="icon"
          href="/android/mipmap-xxxhdpi/ic_launcher.png"
          sizes="192x192"
        />
        <meta name="theme-color" content="#ffffff" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>
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
