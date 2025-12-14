import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  MetricField,
  MetricsRequestParams,
  MetricsResponse,
  fetchMetrics,
} from '@/services/metrics.service';
import { NormalizedApiError } from '@/services/api';

export type UseMetricsArgs = {
  datasetId?: string;
  from?: number;
  to?: number;
  fields?: MetricField[];
};

const metricsKey = (params: UseMetricsArgs) => [
  'metrics',
  {
    datasetId: params.datasetId ?? '',
    from: params.from ?? null,
    to: params.to ?? null,
    fields: [...(params.fields ?? [])].sort(),
  },
];

const canFetch = (params: UseMetricsArgs): params is MetricsRequestParams => {
  return (
    typeof params.datasetId === 'string' &&
    params.datasetId.length > 0 &&
    typeof params.from === 'number' &&
    Number.isFinite(params.from) &&
    typeof params.to === 'number' &&
    Number.isFinite(params.to)
  );
};

export const useMetrics = (
  params: UseMetricsArgs,
): UseQueryResult<MetricsResponse, NormalizedApiError> => {
  return useQuery<MetricsResponse, NormalizedApiError>({
    queryKey: metricsKey(params),
    queryFn: () => {
      if (!canFetch(params)) {
        throw new Error('metrics query called without required params');
      }
      return fetchMetrics({
        datasetId: params.datasetId,
        from: params.from,
        to: params.to,
        fields: params.fields,
      });
    },
    enabled: canFetch(params),
  });
};

export default useMetrics;
