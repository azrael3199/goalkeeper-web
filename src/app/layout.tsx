import React from 'react';
import './globals.css';
import { Roboto } from 'next/font/google';
import { AppProvider } from '@root/context/AppContext';
import { ErrorProvider } from '@root/context/ErrorContext';

const roboto = Roboto({ weight: '400', subsets: ['latin'] });

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
      <body className={`${roboto.className} dark:bg-slate-900`}>
        <AppProvider>
          <ErrorProvider>{children}</ErrorProvider>
        </AppProvider>
      </body>
    </html>
  );
}
