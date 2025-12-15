'use client';

import { JSX, ReactNode, useMemo } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from 'recharts';
import {
  MetricField,
  MetricPoint,
  MetricsAnnotation,
} from '@/services/metrics.service';
import { NormalizedApiError } from '@/services/api';
import { useTheme } from '@/components/layout/ThemeProvider';

type MetricsChartProps = {
  data: MetricPoint[];
  metrics: MetricField[];
  loading?: boolean;
  error?: NormalizedApiError | string | null;
  height?: number;
  annotations?: MetricsAnnotation[];
};

const COLORS: Record<MetricField, string> = {
  REQUESTS: '#2563eb',
  ERRORS: '#ef4444',
  P50_LATENCY: '#10b981',
  P95_LATENCY: '#f59e0b',
  P99_LATENCY: '#7c3aed',
};

const fallbackMessageClasses =
  'rounded-lg border border-zinc-200 bg-white px-4 py-6 text-center text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200';

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatTooltipDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
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

export function MetricsChart({
  data,
  metrics,
  loading = false,
  error = null,
  height = 360,
  annotations = [],
}: MetricsChartProps): JSX.Element {
  const { theme } = useTheme();
  const chartData = useMemo(
    () =>
      data.map((point) => ({ timestamp: point.timestamp, ...point.values })),
    [data]
  );
  const axisColor = theme === 'dark' ? '#d4d4d8' : '#52525b';
  const gridColor = theme === 'dark' ? '#27272a' : '#e4e4e7';
  const tooltipStyle = useMemo(
    () => ({
      backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
      borderColor: theme === 'dark' ? '#27272a' : '#e4e4e7',
      color: theme === 'dark' ? '#e5e7eb' : '#0f172a',
    }),
    [theme]
  );
  const labelStyle = useMemo(
    () => ({
      color: theme === 'dark' ? '#a1a1aa' : '#52525b',
    }),
    [theme]
  );

  if (error) {
    const message = typeof error === 'string' ? error : error.message;
    return (
      <div className={fallbackMessageClasses}>
        <div className='font-semibold text-rose-700 dark:text-rose-200'>
          Unable to load metrics
        </div>
        <p className='mt-1 text-rose-700 dark:text-rose-200'>{message}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='space-y-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900'>
        <div className='h-4 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700' />
        <div className='h-80 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800' />
      </div>
    );
  }

  if (!metrics.length) {
    return (
      <div className={fallbackMessageClasses}>
        Select at least one metric to plot.
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className={fallbackMessageClasses}>
        No datapoints available for this range.
      </div>
    );
  }

  return (
    <div className='rounded-lg border border-zinc-200 bg-white p-4 text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100'>
      <div className='text-sm font-semibold text-zinc-900 dark:text-zinc-100'>
        Metrics
      </div>
      <div style={{ height }} className='mt-3'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
          >
            <CartesianGrid stroke={gridColor} strokeDasharray='4 4' />
            <XAxis
              dataKey='timestamp'
              tickFormatter={formatTimestamp}
              stroke={axisColor}
              tick={{ fontSize: 12, fill: axisColor }}
            />
            <YAxis
              stroke={axisColor}
              tick={{ fontSize: 12, fill: axisColor }}
            />
            <Tooltip
              labelFormatter={(value) => formatTooltipDate(Number(value))}
              formatter={(value: number, name: MetricField) => [value, name]}
              contentStyle={tooltipStyle}
              labelStyle={labelStyle}
            />
            <Legend wrapperStyle={labelStyle} />
            {metrics.map((metric) => (
              <Line
                key={metric}
                type='monotone'
                dataKey={metric}
                stroke={COLORS[metric]}
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
                label={
                  <AnnotationLabel payload={{ value: annotation.timestamp }} />
                }
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default MetricsChart;
