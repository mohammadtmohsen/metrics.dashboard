'use client';

import { JSX, useMemo } from 'react';
// Chart internals moved into MetricsLineChart
import {
  MetricField,
  MetricPoint,
  MetricsAnnotation,
} from '@/services/metrics.service';
import { NormalizedApiError } from '@/services/api';
import ErrorState from '@/components/common/ErrorState';
import { useTheme } from 'next-themes';

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

import EmptyState from '@/components/common/EmptyState';
import Skeleton from '../common/Skeleton';
import ResponsiveChart from '@/components/common/ResponsiveChart';
import MetricsLineChart from '@/components/metrics/MetricsLineChart';

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

// Annotation label is now encapsulated within MetricsLineChart

export function MetricsChart({
  data,
  metrics,
  loading = false,
  error = null,
  height = 360,
  annotations = [],
}: MetricsChartProps): JSX.Element {
  const { resolvedTheme } = useTheme();
  // Use resolvedTheme for calculations to ensure system preference is respected
  const theme = resolvedTheme;
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
      <ErrorState
        title='Unable to load metrics'
        message={message}
        tone='danger'
      />
    );
  }

  if (loading) {
    return (
      <div className='flex min-h-118.75 flex-col rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900'>
        <Skeleton width={128} height={16} rounded='sm' className='mb-3' />
        <Skeleton rounded='md' className='flex-1' />
      </div>
    );
  }

  if (!metrics.length) {
    return (
      <EmptyState
        message='Select at least one metric to plot.'
        align='center'
        className='rounded-lg border border-zinc-200 bg-white px-4 py-6 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200'
      />
    );
  }

  if (!chartData.length) {
    return (
      <EmptyState
        message='No datapoints available for this range.'
        align='center'
        className='rounded-lg border border-zinc-200 bg-white px-4 py-6 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200'
      />
    );
  }

  return (
    <div className='rounded-lg border border-zinc-200 bg-white p-4 text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100'>
      <div className='text-sm font-semibold text-zinc-900 dark:text-zinc-100'>
        Metrics
      </div>
      <ResponsiveChart height={height} className='mt-3'>
        <MetricsLineChart
          data={chartData}
          metrics={metrics}
          colors={COLORS}
          axisColor={axisColor}
          gridColor={gridColor}
          tooltipStyle={tooltipStyle}
          labelStyle={labelStyle}
          annotations={annotations}
          xKey='timestamp'
          tickFormatter={(v) => formatTimestamp(Number(v))}
          tooltipLabelFormatter={(value) => formatTooltipDate(Number(value))}
          margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
        />
      </ResponsiveChart>
      <div className='mt-4 flex flex-wrap justify-center gap-4 border-t border-zinc-100 pt-4 dark:border-zinc-800'>
        {metrics.map((metric) => (
          <div
            key={metric}
            className='flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400'
          >
            <span
              className='h-2.5 w-2.5 rounded-full'
              style={{ backgroundColor: COLORS[metric] }}
            />
            {metric}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MetricsChart;
