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
import { useAnnotationsQuery } from '@/hooks/useAnnotations';
import HeaderControls from '@/components/layout/Header';
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
  const [isChartMaximized, setIsChartMaximized] = useState(false);

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

  const annotationsQuery = useAnnotationsQuery();

  const chartAnnotations = annotationsQuery.data?.annotations ?? [];

  const handleSelectDataset = (dataset: Dataset) => {
    setSelectedDatasetId(dataset.id);
  };

  return (
    <div className='flex h-screen flex-col overflow-hidden bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100'>
      <HeaderControls
        isMaximized={isChartMaximized}
        onToggleMaximize={() => setIsChartMaximized((prev) => !prev)}
      />
      <div className='flex-1 overflow-y-auto px-4 py-6 md:px-6'>
        <div className='mx-auto flex max-w-350 flex-col gap-6 lg:flex-row'>
          {/* Left Column: Dataset Browser - Animated visibility */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isChartMaximized
                ? 'w-0 opacity-0 lg:w-0'
                : 'w-full opacity-100 lg:w-85'
            }`}
          >
            <div className='w-full lg:w-85'>
              <DatasetBrowser
                selectedId={effectiveDatasetId}
                onSelect={handleSelectDataset}
              />
            </div>
          </div>

          {/* Right Column: Toolbar + Content */}
          <div className='flex min-w-0 flex-1 flex-col gap-6'>
            <MetricsToolbar
              availableFields={METRIC_FIELDS}
              selectedFields={selectedFields}
              onFieldsChange={setSelectedFields}
              range={range}
              onRangeChange={setRange}
              disabled={!selectedDataset}
              onRefresh={() => metricsQuery.refetch()}
            />

            <div className='flex flex-col gap-6 xl:flex-row'>
              {/* Chart Area */}
              <div className='min-w-0 flex-1 transition-all duration-300 ease-in-out'>
                {selectedDataset ? (
                  <MetricsChart
                    data={chartData}
                    metrics={selectedFields}
                    loading={chartLoading}
                    error={chartError}
                    annotations={chartAnnotations}
                  />
                ) : (
                  <div className='rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200'>
                    {isDatasetsLoading
                      ? 'Loading datasets...'
                      : 'Select a dataset to view metrics.'}
                  </div>
                )}
              </div>

              {/* Annotations Panel - Animated visibility */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isChartMaximized
                    ? 'h-0 opacity-0 xl:h-auto xl:w-0'
                    : 'h-auto opacity-100 xl:w-[320px]'
                }`}
              >
                <div className='w-full xl:w-[320px]'>
                  <AnnotationsPanel />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
