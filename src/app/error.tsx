'use client';

import { useEffect, type JSX } from 'react';
import ErrorState from '@/components/common/ErrorState';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorProps): JSX.Element {
  useEffect(() => {
    // Log for observability; avoid user-facing noise.
    console.error(error);
  }, [error]);

  return (
    <div className='flex min-h-screen items-center justify-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100'>
      <div className='w-full max-w-md px-4'>
        <ErrorState
          title='Something went wrong'
          message={error.message || 'Unexpected error occurred.'}
          onRetry={reset}
          retryLabel='Try again'
        />
      </div>
    </div>
  );
}
