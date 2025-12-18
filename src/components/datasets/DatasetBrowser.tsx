'use client';

import { JSX, useEffect, useMemo, useState } from 'react';
import useDatasets from '@/hooks/useDatasets';
import { Dataset, DatasetStatus } from '@/services/datasets.service';
import { NormalizedApiError } from '@/services/api';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import { Skeleton, SkeletonText } from '@/components/common/Skeleton';
import DatasetFilters from '@/components/datasets/DatasetFilters';
import DatasetItem from '@/components/datasets/DatasetItem';

type DatasetBrowserProps = {
  selectedId?: string;
  onSelect?: (dataset: Dataset) => void;
};

type LocalStatusFilter = DatasetStatus | 'all';

const skeletonRows = Array.from({ length: 5 });

export function DatasetBrowser({
  selectedId,
  onSelect,
}: DatasetBrowserProps): JSX.Element {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState<LocalStatusFilter>('all');

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 250);
    return () => clearTimeout(handle);
  }, [searchInput]);

  const queryStatus = status === 'all' ? undefined : (status as DatasetStatus);

  const datasetsQuery = useDatasets({
    search: debouncedSearch,
    status: queryStatus,
  });

  const isLoading = datasetsQuery.isPending;

  const datasets = useMemo(
    () => datasetsQuery.data?.datasets ?? [],
    [datasetsQuery]
  );

  const renderError = (error: NormalizedApiError): JSX.Element => (
    <ErrorState
      title='Unable to load datasets'
      message={error.message}
      onRetry={() => datasetsQuery.refetch()}
      retryLabel='Retry'
      tone='danger'
    />
  );

  const renderEmpty = (): JSX.Element => (
    <EmptyState
      dashed
      align='center'
      message='No datasets match your filters.'
      className='rounded-lg px-4 py-6'
    />
  );

  const renderSkeletons = (): JSX.Element => (
    <div className='space-y-2'>
      {skeletonRows.map((_, index) => (
        <div
          key={index}
          className='flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900'
        >
          <div className='flex justify-between'>
            <Skeleton width={112} height={16} rounded='sm' />
            <Skeleton width={64} height={16} rounded='sm' />
          </div>
          <SkeletonText lines={1} widths={['75%']} />
          <Skeleton width={96} height={12} rounded='sm' />
        </div>
      ))}
    </div>
  );

  const renderDataset = (dataset: Dataset): JSX.Element => (
    <DatasetItem
      key={dataset.id}
      dataset={dataset}
      isSelected={selectedId === dataset.id}
      onSelect={onSelect}
    />
  );

  return (
    <div className='flex flex-col gap-4 text-zinc-900 dark:text-zinc-100'>
      <div className='flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-inherit'>
        <div className='text-sm font-semibold text-zinc-900 dark:text-zinc-100'>
          Datasets
        </div>
        <DatasetFilters
          search={searchInput}
          onSearchChange={setSearchInput}
          status={status}
          onStatusChange={setStatus}
        />
      </div>

      {datasetsQuery.isError && datasetsQuery.error
        ? renderError(datasetsQuery.error)
        : null}

      {isLoading ? renderSkeletons() : null}

      {!isLoading && datasets.length === 0 && !datasetsQuery.isError
        ? renderEmpty()
        : null}

      {!isLoading && datasets.length > 0 ? (
        <div className='space-y-2'>{datasets.map(renderDataset)}</div>
      ) : null}
    </div>
  );
}

export default DatasetBrowser;
