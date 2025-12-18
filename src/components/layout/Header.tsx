'use client';

import { JSX, useEffect, useState } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Sun, Moon, Maximize, Minimize } from 'lucide-react';

type HeaderControlsProps = {
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
};

export function HeaderControls({
  isMaximized = false,
  onToggleMaximize,
}: HeaderControlsProps): JSX.Element {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // delay to avoid synchronous state update warning
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className='mx-auto flex w-full max-w-350 flex-col gap-3 border-b border-zinc-200 bg-white/80 px-4 py-3 text-zinc-900 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100 md:px-6'>
      <div className='flex flex-wrap items-center gap-3'>
        {/* Left Side: Title */}
        <div className='flex items-center gap-3'>
          <Image
            src='/icon.svg'
            alt='Logo'
            width={40}
            height={40}
            className='h-10 w-10'
          />
          <div className='flex flex-col leading-tight'>
            <span className='text-sm font-semibold text-zinc-900 dark:text-zinc-100'>
              Metrics dashboard
            </span>
            <span className='text-xs text-zinc-500 dark:text-zinc-400'>
              Static view for monitoring drills
            </span>
          </div>
        </div>

        {/* Right Side: Live Status + Icon Group */}
        <div className='flex w-full items-center gap-3 justify-end sm:w-auto sm:ml-auto'>
          <div className='flex items-center gap-1 rounded-lg border border-zinc-200 bg-white/50 p-1 dark:border-zinc-800 dark:bg-zinc-900/50'>
            {/* Theme Toggle */}
            <button
              onClick={() =>
                setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
              }
              className='flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
              aria-label='Toggle theme'
            >
              {mounted && resolvedTheme === 'dark' ? (
                <Moon className='h-4 w-4' />
              ) : (
                <Sun className='h-4 w-4' />
              )}
            </button>

            {/* Expand / Focus View */}
            <button
              onClick={onToggleMaximize}
              className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
                isMaximized
                  ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
                  : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
              }`}
              aria-label={isMaximized ? 'Minimize view' : 'Maximize view'}
            >
              {isMaximized ? (
                <Minimize className='h-4 w-4' />
              ) : (
                <Maximize className='h-4 w-4' />
              )}
            </button>
          </div>
          <div className='flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm dark:border-emerald-500/50 dark:bg-emerald-500/10 dark:text-emerald-200'>
            <span className='h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.18)]' />
            Live
          </div>
        </div>
      </div>
    </header>
  );
}

export default HeaderControls;
