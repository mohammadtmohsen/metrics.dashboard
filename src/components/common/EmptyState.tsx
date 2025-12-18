import { JSX, ReactNode } from 'react';

type Props = {
  title?: string;
  message?: string;
  children?: ReactNode;
  dashed?: boolean;
  align?: 'left' | 'center';
  className?: string;
};

export default function EmptyState({
  title,
  message,
  children,
  dashed = false,
  align = 'left',
  className,
}: Props): JSX.Element {
  const base = 'rounded-md border px-3 py-3 text-sm';
  const box = dashed
    ? 'border-dashed border-zinc-300 dark:border-zinc-700'
    : 'border-zinc-200 bg-white text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200';
  const alignClass = align === 'center' ? 'text-center' : '';

  return (
    <div
      className={[base, box, alignClass, className].filter(Boolean).join(' ')}
    >
      {title ? <div className='font-semibold'>{title}</div> : null}
      {message ? <p className={title ? 'mt-1' : ''}>{message}</p> : children}
    </div>
  );
}
