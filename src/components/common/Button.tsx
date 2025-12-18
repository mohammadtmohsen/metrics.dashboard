import { ButtonHTMLAttributes, JSX } from 'react';

type Variant = 'primary' | 'outline' | 'dangerText' | 'mutedText' | 'link';
type Size = 'xs' | 'sm' | 'md';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

function cx(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(' ');
}

const base =
  'inline-flex items-center justify-center font-medium transition disabled:cursor-not-allowed disabled:opacity-60';

const sizeClass: Record<Size, string> = {
  xs: 'text-xs px-3 py-1.5',
  sm: 'text-sm px-3 py-2',
  md: 'text-sm px-4 py-2',
};

const variantClass: Record<Variant, string> = {
  primary:
    'rounded-md bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400',
  outline:
    'rounded-md border border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800',
  dangerText:
    'bg-transparent text-rose-600 hover:text-rose-700 dark:text-rose-300 dark:hover:text-rose-200',
  mutedText:
    'bg-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200',
  link: 'bg-transparent p-0 rounded-none text-emerald-600 hover:underline',
};

export default function Button({
  variant = 'primary',
  size = 'sm',
  className,
  ...rest
}: Props): JSX.Element {
  const padding =
    variant === 'link' || variant === 'dangerText' || variant === 'mutedText'
      ? ''
      : sizeClass[size];
  const textOnlySize =
    variant === 'link' || variant === 'dangerText' || variant === 'mutedText'
      ? size === 'xs'
        ? 'text-xs'
        : 'text-sm'
      : '';

  return (
    <button
      {...rest}
      className={cx(
        base,
        variantClass[variant],
        padding,
        textOnlySize,
        className
      )}
    />
  );
}
