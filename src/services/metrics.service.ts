import api from './api';

export type MetricField =
  | 'REQUESTS'
  | 'ERRORS'
  | 'P50_LATENCY'
  | 'P95_LATENCY'
  | 'P99_LATENCY';

export type MetricPoint = {
  timestamp: number;
  values: Record<MetricField, number>;
};

export type MetricsAnnotation = {
  id: string;
  timestamp: number;
  text: string;
};

export type MetricsResponse = {
  dataset: string;
  range: { from: number; to: number };
  fields: MetricField[];
  points: MetricPoint[];
  annotations: MetricsAnnotation[];
};

export type MetricsRequestParams = {
  datasetId: string;
  from: number;
  to: number;
  fields?: MetricField[];
};

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
