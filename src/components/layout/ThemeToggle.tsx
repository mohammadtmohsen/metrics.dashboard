'use client';
import { JSX } from 'react';
import { useTheme } from 'next-themes';

export default function ThemeToggle(): JSX.Element {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    />
  );
}
