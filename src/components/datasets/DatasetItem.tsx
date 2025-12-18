import { JSX } from 'react';
import type { Dataset, DatasetStatus } from '@/services/datasets.service';

type Props = {
  dataset: Dataset;
  isSelected?: boolean;
  onSelect?: (dataset: Dataset) => void;
};

const statusBadgeClasses: Record<DatasetStatus, string> = {
  active:
    'border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-500/60 dark:bg-emerald-500/10 dark:text-emerald-200',
  inactive:
    'border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-500/60 dark:bg-amber-500/10 dark:text-amber-200',
  archived:
    'border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200',
};

const formatCount = (value: number): string =>
  value >= 1_000_000
    ? `${(value / 1_000_000).toFixed(1)}M`
    : value >= 1_000
    ? `${(value / 1_000).toFixed(1)}k`
    : `${value}`;

const formatDate = (iso: string): string => {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function DatasetItem({
  dataset,
  isSelected,
  onSelect,
}: Props): JSX.Element {
  return (
    <button
      key={dataset.id}
      type='button'
      onClick={() => onSelect?.(dataset)}
      className={`group w-full rounded-lg border px-4 py-3 text-left transition ${
        isSelected
          ? 'border-emerald-400 bg-emerald-50 shadow-sm dark:border-emerald-500 dark:bg-emerald-500/15'
          : 'border-zinc-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/60 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-500/60 dark:hover:bg-emerald-500/10'
      }`}
    >
      <div className='flex items-start justify-between gap-3'>
        <div>
          <div className='text-sm font-semibold text-zinc-900 dark:text-zinc-100'>
            {dataset.name}
          </div>
          <div className='text-xs text-zinc-600 dark:text-zinc-400'>
            {dataset.id}
          </div>
        </div>
        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
            statusBadgeClasses[dataset.status]
          }`}
        >
          {dataset.status}
        </span>
      </div>
      <p className='mt-2 text-sm text-zinc-700 dark:text-zinc-200'>
        {dataset.description.length > 140
          ? `${dataset.description.slice(0, 137)}...`
          : dataset.description}
      </p>
      <div className='mt-3 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400'>
        <span>Updated {formatDate(dataset.updatedAt)}</span>
        <span>{formatCount(dataset.records)} records</span>
      </div>
    </button>
  );
}
