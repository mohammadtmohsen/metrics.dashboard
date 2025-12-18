import { CSSProperties, JSX, ReactNode } from 'react';
import { ResponsiveContainer } from 'recharts';
import type { ResponsiveContainerProps } from 'recharts';

type Percent = `${number}%`;

export type ResponsiveChartProps = {
  // Wrapper div props
  height?: number | string;
  className?: string;
  style?: CSSProperties;

  // ResponsiveContainer props overrides
  containerWidth?: number | Percent; // default '100%'
  containerHeight?: number | Percent; // default '100%'
  containerClassName?: string;
  containerStyle?: CSSProperties;
  containerProps?: Omit<
    ResponsiveContainerProps,
    'width' | 'height' | 'children'
  >;

  children: ReactNode;
};

export default function ResponsiveChart({
  height,
  className,
  style,
  containerWidth,
  containerHeight,
  containerClassName,
  containerStyle,
  containerProps,
  children,
}: ResponsiveChartProps): JSX.Element {
  const defaultPercent: Percent = '100%';
  const cWidth = containerWidth ?? defaultPercent;
  const cHeight = containerHeight ?? defaultPercent;
  const wrapperStyle: CSSProperties = {
    height,
    ...style,
  };
  return (
    <div style={wrapperStyle} className={className}>
      <ResponsiveContainer
        width={cWidth}
        height={cHeight}
        className={containerClassName}
        style={containerStyle}
        {...containerProps}
      >
        {children}
      </ResponsiveContainer>
    </div>
  );
}
