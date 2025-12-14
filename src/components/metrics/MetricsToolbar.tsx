'use client';

import { JSX, useCallback, useMemo, useState } from 'react';
import { MetricField } from '@/services/metrics.service';

type TimeRangePreset = '30m' | '2h' | '24h' | 'custom';

export type TimeRangeSelection = {
  preset: TimeRangePreset;
  from?: number;
  to?: number;
};

type MetricsToolbarProps = {
  availableFields: MetricField[];
  selectedFields: MetricField[];
  onFieldsChange: (fields: MetricField[]) => void;
  range: TimeRangeSelection;
  onRangeChange: (range: TimeRangeSelection) => void;
  disabled?: boolean;
};

const fieldLabels: Record<MetricField, string> = {
  REQUESTS: 'Requests',
  ERRORS: 'Errors',
  P50_LATENCY: 'P50 Latency',
  P95_LATENCY: 'P95 Latency',
  P99_LATENCY: 'P99 Latency',
};

const presetDefinitions: Array<{
  label: string;
  preset: TimeRangePreset;
  minutes?: number;
}> = [
  { label: '30m', preset: '30m', minutes: 30 },
  { label: '2h', preset: '2h', minutes: 120 },
  { label: '24h', preset: '24h', minutes: 24 * 60 },
  { label: 'Custom', preset: 'custom' },
];

const toInputValue = (timestamp?: number): string => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toISOString().slice(0, 16);
};

const fromInputValue = (value: string): number | undefined => {
  if (!value) return undefined;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export function MetricsToolbar({
  availableFields,
  selectedFields,
  onFieldsChange,
  range,
  onRangeChange,
  disabled = false,
}: MetricsToolbarProps): JSX.Element {
  const [customFrom, setCustomFrom] = useState<string>(() =>
    toInputValue(range.from)
  );
  const [customTo, setCustomTo] = useState<string>(() =>
    toInputValue(range.to)
  );

  const sortedFields = useMemo(
    () => [...availableFields].filter(Boolean).sort(),
    [availableFields]
  );

  const handlePresetSelect = useCallback(
    (preset: TimeRangePreset, minutes?: number) => {
      if (preset === 'custom') {
        onRangeChange({ preset: 'custom', from: range.from, to: range.to });
        return;
      }

      const now = Date.now();
      const duration = (minutes ?? 0) * 60 * 1000;
      const from = now - duration;
      onRangeChange({ preset, from, to: now });
    },
    [onRangeChange, range.from, range.to]
  );

  const toggleField = (field: MetricField) => {
    const next = selectedFields.includes(field)
      ? selectedFields.filter((item) => item !== field)
      : [...selectedFields, field];
    onFieldsChange(next);
  };

  const handleCustomChange = (type: 'from' | 'to', value: string) => {
    const nextFrom = type === 'from' ? value : customFrom;
    const nextTo = type === 'to' ? value : customTo;
    setCustomFrom(nextFrom);
    setCustomTo(nextTo);

    const fromTs = fromInputValue(nextFrom);
    const toTs = fromInputValue(nextTo);

    onRangeChange({
      preset: 'custom',
      from: fromTs,
      to: toTs,
    });
  };

  const isPresetActive = (preset: TimeRangePreset): boolean =>
    range.preset === preset && preset !== 'custom';

  return (
    <div className='flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm'>
      <div className='flex flex-wrap items-center gap-2'>
        <span className='text-sm font-semibold text-zinc-900'>Time Range</span>
        <div className='flex flex-wrap gap-2'>
          {presetDefinitions.map(({ label, preset, minutes }) => (
            <button
              key={preset}
              type='button'
              disabled={disabled}
              onClick={() => handlePresetSelect(preset, minutes)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                isPresetActive(preset)
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'border border-zinc-200 bg-white text-zinc-800 hover:border-emerald-300 hover:text-emerald-700'
              } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {range.preset === 'custom' ? (
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <label className='flex flex-col gap-1 text-sm text-zinc-700'>
            From
            <input
              type='datetime-local'
              value={customFrom}
              onChange={(event) =>
                handleCustomChange('from', event.target.value)
              }
              disabled={disabled}
              className='rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60'
            />
          </label>
          <label className='flex flex-col gap-1 text-sm text-zinc-700'>
            To
            <input
              type='datetime-local'
              value={customTo}
              onChange={(event) => handleCustomChange('to', event.target.value)}
              disabled={disabled}
              className='rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60'
            />
          </label>
        </div>
      ) : null}

      <div className='flex flex-col gap-3'>
        <div className='flex items-center justify-between'>
          <span className='text-sm font-semibold text-zinc-900'>Metrics</span>
          <span className='text-xs text-zinc-500'>
            {selectedFields.length} selected
          </span>
        </div>

        {sortedFields.length === 0 ? (
          <div className='rounded-md border border-dashed border-zinc-300 px-3 py-3 text-sm text-zinc-600'>
            No metrics available for this dataset.
          </div>
        ) : (
          <div className='flex flex-wrap gap-2'>
            {sortedFields.map((field) => {
              const isSelected = selectedFields.includes(field);
              return (
                <button
                  key={field}
                  type='button'
                  disabled={disabled}
                  onClick={() => toggleField(field)}
                  className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
                    isSelected
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                      : 'border-zinc-200 bg-white text-zinc-800 hover:border-emerald-300 hover:text-emerald-700'
                  } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
                >
                  {fieldLabels[field] ?? field}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MetricsToolbar;
