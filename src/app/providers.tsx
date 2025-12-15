'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { JSX, ReactNode, useState } from 'react';
import { ThemeProvider } from 'next-themes';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps): JSX.Element {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 60_000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default Providers;
