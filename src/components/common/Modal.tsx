'use client';

import { JSX, ReactNode, useEffect } from 'react';

type Props = {
  open: boolean;
  onClose?: () => void;
  children?: ReactNode;
  ariaLabel?: string;
  containerClassName?: string;
};

export default function Modal({
  open,
  onClose,
  children,
  ariaLabel,
  containerClassName,
}: Props): JSX.Element | null {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className='fixed inset-0 z-20 flex items-center justify-center bg-black/30 px-4 py-6 dark:bg-black/60'
      role='dialog'
      aria-label={ariaLabel}
      onClick={() => onClose?.()}
    >
      <div
        className={
          containerClassName ??
          'w-full max-w-md rounded-lg border border-zinc-200 bg-white p-5 text-zinc-900 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100'
        }
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
