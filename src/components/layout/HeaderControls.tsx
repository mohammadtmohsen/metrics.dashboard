'use client';

import { JSX } from 'react';
import { useTheme } from './ThemeProvider';

export function HeaderControls(): JSX.Element {
  const { theme, toggleTheme, isReady } = useTheme();
  const isDark = theme === 'dark';

  return (
    <header className='flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white/80 px-4 py-3 text-zinc-900 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm dark:border-emerald-500/50 dark:bg-emerald-500/10 dark:text-emerald-200'>
            <span className='h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.18)]' />
            Live
          </div>
          <div className='flex flex-col leading-tight'>
            <span className='text-sm font-semibold text-zinc-900 dark:text-zinc-100'>
              Metrics dashboard
            </span>
            <span className='text-xs text-zinc-500 dark:text-zinc-400'>
              Static view for monitoring drills
            </span>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <div className='rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-300'>
            {isDark ? 'Dark mode' : 'Light mode'}
          </div>
          <button
            type='button'
            aria-pressed={isDark}
            onClick={toggleTheme}
            disabled={!isReady}
            className='flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-800 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:border-emerald-400 dark:hover:text-emerald-200 disabled:cursor-not-allowed disabled:opacity-60'
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ring-2 ring-inset ${
                isDark
                  ? 'bg-emerald-300 ring-emerald-500'
                  : 'bg-amber-300 ring-amber-500'
              }`}
            />
            <span>{isDark ? 'Switch to light' : 'Switch to dark'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default HeaderControls;
