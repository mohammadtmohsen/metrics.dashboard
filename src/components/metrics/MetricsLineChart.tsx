import { JSX, ReactNode } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from 'recharts';
import type { Margin } from 'recharts/types/util/types';
import type {
  MetricField,
  MetricsAnnotation,
} from '@/services/metrics.service';

export type MetricsLineChartProps<
  T extends Record<string, unknown> = Record<string, unknown>
> = {
  data: T[];
  metrics: MetricField[];
  colors: Record<MetricField, string>;
  axisColor: string;
  gridColor: string;
  tooltipStyle: React.CSSProperties;
  labelStyle: React.CSSProperties;
  annotations?: MetricsAnnotation[];
  xKey?: keyof T & string; // defaults to 'timestamp'
  tickFormatter?: (value: number | string) => string;
  tooltipLabelFormatter?: (value: number | string) => string;
  tooltipFormatter?: (
    value: number,
    name: string | number
  ) => [ReactNode, ReactNode];
  margin?: Margin;
};

type AnnotationLabelProps = {
  payload?: {
    value: number | string;
  };
};

const AnnotationLabel = ({ payload }: AnnotationLabelProps): ReactNode => {
  if (!payload || typeof payload.value !== 'number') return null;
  return (
    <div className='rounded bg-white px-2 py-1 text-xs text-emerald-800 shadow-sm ring-1 ring-emerald-200 dark:bg-zinc-900 dark:text-emerald-100 dark:ring-emerald-500/50'>
      {new Date(payload.value).toLocaleTimeString()}
    </div>
  );
};

export default function MetricsLineChart<T extends Record<string, unknown>>({
  data,
  metrics,
  colors,
  axisColor,
  gridColor,
  tooltipStyle,
  labelStyle,
  annotations = [],
  xKey = 'timestamp',
  tickFormatter,
  tooltipLabelFormatter,
  tooltipFormatter = (value: number, name: string | number) => [
    value,
    String(name),
  ],
  margin = { top: 10, right: 20, bottom: 10, left: 0 },
}: MetricsLineChartProps<T>): JSX.Element {
  return (
    <LineChart data={data} margin={margin}>
      <CartesianGrid stroke={gridColor} strokeDasharray='4 4' />
      <XAxis
        dataKey={xKey}
        tickFormatter={tickFormatter}
        stroke={axisColor}
        tick={{ fontSize: 12, fill: axisColor }}
      />
      <YAxis stroke={axisColor} tick={{ fontSize: 12, fill: axisColor }} />
      <Tooltip
        labelFormatter={tooltipLabelFormatter}
        formatter={tooltipFormatter}
        contentStyle={tooltipStyle}
        labelStyle={labelStyle}
      />
      {metrics.map((metric) => (
        <Line
          key={metric}
          type='monotone'
          dataKey={metric}
          stroke={colors[metric]}
          dot={false}
          strokeWidth={2}
          isAnimationActive={false}
        />
      ))}
      {annotations.map((annotation) => (
        <ReferenceLine
          key={annotation.id}
          x={annotation.timestamp}
          stroke='#10b981'
          strokeDasharray='4 2'
          strokeWidth={1.5}
          label={<AnnotationLabel payload={{ value: annotation.timestamp }} />}
        />
      ))}
    </LineChart>
  );
}
