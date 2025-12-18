'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { JSX, ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export function ThemeProvider({ children }: Props): JSX.Element {
  return (
    <NextThemesProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

export default ThemeProvider;
