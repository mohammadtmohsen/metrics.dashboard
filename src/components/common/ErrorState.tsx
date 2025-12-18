import { JSX, ReactNode } from 'react';

type Tone = 'danger' | 'neutral';

type Props = {
  title?: string;
  message?: string;
  children?: ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  tone?: Tone;
  className?: string;
};

export default function ErrorState({
  title,
  message,
  children,
  onRetry,
  retryLabel = 'Retry',
  tone = 'danger',
  className,
}: Props): JSX.Element {
  const base = 'rounded-lg border px-4 py-3 text-sm shadow-sm';
  const dangerBox =
    'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-500/50 dark:bg-rose-900/40 dark:text-rose-100';
  const neutralBox =
    'border-zinc-200 bg-white text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200';
  const box = tone === 'danger' ? dangerBox : neutralBox;

  return (
    <div
      role='alert'
      className={[base, box, className].filter(Boolean).join(' ')}
    >
      {title ? <div className='font-semibold'>{title}</div> : null}
      {message ? <p className='mt-1'>{message}</p> : children}
      {onRetry ? (
        <button
          type='button'
          onClick={onRetry}
          className='mt-2 inline-flex items-center justify-center rounded-md bg-rose-700 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-rose-800 dark:bg-rose-600 dark:hover:bg-rose-500'
        >
          {retryLabel}
        </button>
      ) : null}
    </div>
  );
}
