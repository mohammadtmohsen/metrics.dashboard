import { CSSProperties, JSX, ReactNode } from 'react';

type Rounded = 'sm' | 'md' | 'lg' | 'full';

type SkeletonProps = {
  width?: number | string;
  height?: number | string;
  rounded?: Rounded;
  className?: string;
  style?: CSSProperties;
};

const roundedClass: Record<Rounded, string> = {
  sm: 'rounded',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

export function Skeleton({
  width,
  height,
  rounded = 'md',
  className,
  style,
}: SkeletonProps): JSX.Element {
  const styles: CSSProperties = {
    width,
    height,
    ...style,
  };
  return (
    <div
      style={styles}
      className={[
        'animate-pulse bg-zinc-200 dark:bg-zinc-700',
        roundedClass[rounded],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}

type SkeletonTextProps = {
  lines?: number;
  widths?: Array<number | string>;
  className?: string;
  lineClassName?: string;
};

export function SkeletonText({
  lines = 3,
  widths,
  className,
  lineClassName,
}: SkeletonTextProps): JSX.Element {
  const count = Math.max(0, lines);
  const items = Array.from({ length: count });
  return (
    <div className={className}>
      {items.map((_, idx) => (
        <Skeleton
          key={idx}
          height={12}
          width={widths?.[idx] ?? '100%'}
          rounded='sm'
          className={[idx > 0 ? 'mt-2' : '', lineClassName]
            .filter(Boolean)
            .join(' ')}
        />
      ))}
    </div>
  );
}

type SkeletonContainerProps = {
  children?: ReactNode;
  className?: string;
};

export function SkeletonContainer({
  children,
  className,
}: SkeletonContainerProps): JSX.Element {
  return (
    <div className={['animate-pulse', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}

export default Skeleton;
