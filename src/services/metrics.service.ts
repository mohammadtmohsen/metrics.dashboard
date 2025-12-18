import api from './api';
import type { MetricsResponse, MetricsRequestParams } from '@/types/metrics';
export type {
  MetricField,
  MetricPoint,
  MetricsAnnotation,
  MetricsResponse,
  MetricsRequestParams,
} from '@/types/metrics';

export const fetchMetrics = async (
  params: MetricsRequestParams
): Promise<MetricsResponse> => {
  const { datasetId, from, to, fields } = params;

  const response = await api.get<MetricsResponse>('/metrics', {
    params: {
      dataset: datasetId,
      from,
      to,
      fields: fields?.join(','),
    },
  });

  return response.data;
};

const metricsService = {
  fetchMetrics,
};

export default metricsService;
