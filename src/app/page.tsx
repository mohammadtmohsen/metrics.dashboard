'use client';

import { JSX, useMemo, useState } from 'react';
import DatasetBrowser from '@/components/datasets/DatasetBrowser';
import AnnotationsPanel from '@/components/annotations/AnnotationsPanel';
import MetricsChart from '@/components/metrics/MetricsChart';
import MetricsToolbar, {
  TimeRangeSelection,
} from '@/components/metrics/MetricsToolbar';
import useDatasets from '@/hooks/useDatasets';
import useMetrics from '@/hooks/useMetrics';
import HeaderControls from '@/components/layout/HeaderControls';
import { MetricField } from '@/services/metrics.service';
import { Dataset } from '@/services/datasets.service';

const METRIC_FIELDS: MetricField[] = [
  'REQUESTS',
  'ERRORS',
  'P50_LATENCY',
  'P95_LATENCY',
  'P99_LATENCY',
];

const defaultRange = (): TimeRangeSelection => {
  const to = Date.now();
  const from = to - 2 * 60 * 60 * 1000;
  return { preset: '2h', from, to };
};

export default function Home(): JSX.Element {
  const [range, setRange] = useState<TimeRangeSelection>(() => defaultRange());
  const [selectedFields, setSelectedFields] =
    useState<MetricField[]>(METRIC_FIELDS);
  const [selectedDatasetId, setSelectedDatasetId] = useState<
    string | undefined
  >(undefined);

  const datasetsQuery = useDatasets({});
  const datasets = useMemo(
    () => datasetsQuery.data?.datasets ?? [],
    [datasetsQuery.data]
  );
  const isDatasetsLoading = datasetsQuery.isPending;

  const effectiveDatasetId = selectedDatasetId ?? datasets[0]?.id;

  const selectedDataset = useMemo(
    () => datasets.find((dataset) => dataset.id === effectiveDatasetId),
    [datasets, effectiveDatasetId]
  );

  const metricsQuery = useMetrics({
    datasetId: selectedDataset?.id,
    from: range.from,
    to: range.to,
    fields: selectedFields,
  });

  const chartData = metricsQuery.data?.points ?? [];
  const chartError = metricsQuery.isError ? metricsQuery.error : null;
  const chartLoading = metricsQuery.isPending || metricsQuery.isFetching;

  const handleSelectDataset = (dataset: Dataset) => {
    setSelectedDatasetId(dataset.id);
  };

  return (
    <div className='min-h-screen bg-zinc-50 py-10 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100'>
      <div className='mx-auto flex max-w-6xl flex-col gap-6 px-4 text-inherit md:px-6'>
        <HeaderControls />
        <main className='flex flex-col gap-6 text-inherit lg:flex-row'>
          <div className='w-full lg:w-70 xl:w-[320px]'>
            <DatasetBrowser
              selectedId={effectiveDatasetId}
              onSelect={handleSelectDataset}
            />
          </div>
          <div className='flex w-full flex-col gap-4 lg:flex-1'>
            <MetricsToolbar
              availableFields={METRIC_FIELDS}
              selectedFields={selectedFields}
              onFieldsChange={setSelectedFields}
              range={range}
              onRangeChange={setRange}
              disabled={!selectedDataset}
            />
            {selectedDataset ? (
              <MetricsChart
                data={chartData}
                metrics={selectedFields}
                loading={chartLoading}
                error={chartError}
                annotations={metricsQuery.data?.annotations}
              />
            ) : (
              <div className='rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200'>
                {isDatasetsLoading
                  ? 'Loading datasets...'
                  : 'Select a dataset to view metrics.'}
              </div>
            )}
          </div>
          <div className='w-full lg:w-70 xl:w-[320px]'>
            <AnnotationsPanel />
          </div>
        </main>
      </div>
    </div>
  );
}
