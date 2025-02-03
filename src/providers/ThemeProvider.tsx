// 'use client';

// import { createContext, useContext, useEffect, useMemo, useState } from 'react';

// type Theme = 'dark' | 'light' | 'system';

// type ThemeProviderProps = {
//   children: React.ReactNode;
//   defaultTheme?: Theme;
//   storageKey?: string;
// };

// type ThemeProviderState = {
//   theme: Theme;
//   setTheme: (theme: Theme) => void;
// };

// const initialState: ThemeProviderState = {
//   theme: 'dark',
//   setTheme: () => null,
// };

// const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// const ThemeProvider = ({
//   children,
//   defaultTheme = 'dark',
//   storageKey = 'next-ui-theme',
//   ...props
// }: ThemeProviderProps) => {
//   const [theme, setTheme] = useState<Theme>(defaultTheme);

//   useEffect(() => {
//     const storedTheme = window.localStorage.getItem(storageKey) as Theme;
//     setTheme(storedTheme || defaultTheme);
//   }, [defaultTheme, storageKey]);

//   useEffect(() => {
//     const root = window.document.documentElement;
//     root.classList.remove('light', 'dark');

//     if (theme === 'system') {
//       const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
//         .matches
//         ? 'dark'
//         : 'light';
//       root.classList.add(systemTheme);
//       return;
//     }

//     root.classList.add(theme);
//   }, [theme]);

//   const value = useMemo(
//     () => ({
//       theme,
//       setTheme: (theme: Theme) => {
//         if (localStorage) {
//           localStorage.setItem(storageKey, theme);
//           setTheme(theme);
//         }
//       },
//     }),
//     [storageKey, theme]
//   );

//   return (
//     <ThemeProviderContext.Provider {...props} value={value}>
//       {children}
//     </ThemeProviderContext.Provider>
//   );
// };

// export const useTheme = () => {
//   const context = useContext(ThemeProviderContext);

//   if (context === undefined) {
//     throw new Error('useTheme must be used within a ThemeProvider');
//   }

//   return context;
// };

// export default ThemeProvider;

'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export default ThemeProvider;
