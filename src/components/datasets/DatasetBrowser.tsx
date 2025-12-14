'use client';

import { useEffect, useMemo, useState } from 'react';
import useDatasets from '@/hooks/useDatasets';
import { Dataset, DatasetStatus } from '@/services/datasets.service';
import { NormalizedApiError } from '@/services/api';

type DatasetBrowserProps = {
  selectedId?: string;
  onSelect?: (dataset: Dataset) => void;
};

type StatusFilter = DatasetStatus | 'all';

const statusOptions: { label: string; value: StatusFilter }[] = [
  { label: 'All statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Archived', value: 'archived' },
];

const skeletonRows = Array.from({ length: 5 });

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

const statusBadgeClasses: Record<DatasetStatus, string> = {
  active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  inactive: 'bg-amber-100 text-amber-800 border-amber-200',
  archived: 'bg-zinc-100 text-zinc-700 border-zinc-200',
};

export function DatasetBrowser({
  selectedId,
  onSelect,
}: DatasetBrowserProps): JSX.Element {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 250);
    return () => clearTimeout(handle);
  }, [searchInput]);

  const queryStatus = status === 'all' ? undefined : status;

  const datasetsQuery = useDatasets({
    search: debouncedSearch,
    status: queryStatus,
  });

  const isLoading = datasetsQuery.isPending;

  const datasets = useMemo(() => datasetsQuery.data?.datasets ?? [], [datasetsQuery]);

  const renderError = (error: NormalizedApiError): JSX.Element => (
    <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800">
      <div className="text-sm font-semibold">Unable to load datasets</div>
      <p className="text-sm">{error.message}</p>
      <button
        type="button"
        onClick={() => datasetsQuery.refetch()}
        className="mt-2 inline-flex items-center justify-center rounded-md bg-rose-700 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-rose-800"
      >
        Retry
      </button>
    </div>
  );

  const renderEmpty = (): JSX.Element => (
    <div className="rounded-lg border border-dashed border-zinc-300 bg-white px-4 py-6 text-center text-sm text-zinc-600">
      No datasets match your filters.
    </div>
  );

  const renderSkeletons = (): JSX.Element => (
    <div className="space-y-2">
      {skeletonRows.map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-4"
        >
          <div className="flex justify-between">
            <div className="h-4 w-28 rounded bg-zinc-200" />
            <div className="h-4 w-16 rounded bg-zinc-200" />
          </div>
          <div className="h-3 w-3/4 rounded bg-zinc-200" />
          <div className="h-3 w-24 rounded bg-zinc-200" />
        </div>
      ))}
    </div>
  );

  const renderDataset = (dataset: Dataset): JSX.Element => {
    const isSelected = selectedId === dataset.id;
    return (
      <button
        key={dataset.id}
        type="button"
        onClick={() => onSelect?.(dataset)}
        className={`group w-full rounded-lg border px-4 py-3 text-left transition ${
          isSelected
            ? 'border-emerald-400 bg-emerald-50 shadow-sm'
            : 'border-zinc-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/60'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-zinc-900">{dataset.name}</div>
            <div className="text-xs text-zinc-600">{dataset.id}</div>
          </div>
          <span
            className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
              statusBadgeClasses[dataset.status]
            }`}
          >
            {dataset.status}
          </span>
        </div>
        <p className="mt-2 text-sm text-zinc-700">
          {dataset.description.length > 140
            ? `${dataset.description.slice(0, 137)}...`
            : dataset.description}
        </p>
        <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
          <span>Updated {formatDate(dataset.updatedAt)}</span>
          <span>{formatCount(dataset.records)} records</span>
        </div>
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="text-sm font-semibold text-zinc-900">Datasets</div>
        <div className="flex gap-3">
          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search datasets"
            className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusFilter)}
            className="w-40 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {datasetsQuery.isError && datasetsQuery.error
        ? renderError(datasetsQuery.error)
        : null}

      {isLoading ? renderSkeletons() : null}

      {!isLoading && datasets.length === 0 && !datasetsQuery.isError ? renderEmpty() : null}

      {!isLoading && datasets.length > 0 ? (
        <div className="space-y-2">{datasets.map(renderDataset)}</div>
      ) : null}
    </div>
  );
}

export default DatasetBrowser;
