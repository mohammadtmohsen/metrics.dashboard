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
