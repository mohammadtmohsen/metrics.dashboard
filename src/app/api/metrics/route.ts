import { NextRequest, NextResponse } from 'next/server';

type MetricField =
  | 'REQUESTS'
  | 'ERRORS'
  | 'P50_LATENCY'
  | 'P95_LATENCY'
  | 'P99_LATENCY';

type MetricPoint = {
  timestamp: number;
  values: Record<MetricField, number>;
};

type MetricsResponse = {
  dataset: string;
  range: { from: number; to: number };
  fields: MetricField[];
  points: MetricPoint[];
  annotations: Array<unknown>;
};

const METRIC_FIELDS: MetricField[] = [
  'REQUESTS',
  'ERRORS',
  'P50_LATENCY',
  'P95_LATENCY',
  'P99_LATENCY',
];

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const parseTimestamp = (value: string | null): number | null => {
  if (!value) {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const parseFields = (value: string | null): MetricField[] => {
  if (!value) {
    return METRIC_FIELDS;
  }

  const requested = value
    .split(',')
    .map((field) => field.trim().toUpperCase())
    .filter((field): field is MetricField =>
      METRIC_FIELDS.includes(field as MetricField),
    );

  return requested.length > 0 ? requested : METRIC_FIELDS;
};

const createPrng = (seed: number): (() => number) => {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
};

const generatePoints = (
  dataset: string,
  from: number,
  to: number,
  fields: MetricField[],
): MetricPoint[] => {
  const range = Math.max(to - from, 1);
  const pointCount = Math.min(96, Math.max(24, Math.floor(range / (1000 * 60 * 5))));
  const step = Math.max(1000 * 60 * 5, Math.floor(range / pointCount));
  const seedBase = dataset
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rand = createPrng(seedBase + from + to);

  const baseByField: Record<MetricField, number> = {
    REQUESTS: 1200,
    ERRORS: 30,
    P50_LATENCY: 110,
    P95_LATENCY: 240,
    P99_LATENCY: 380,
  };

  const points: MetricPoint[] = [];

  for (let ts = from; ts <= to; ts += step) {
    const values = {} as Record<MetricField, number>;

    for (const field of fields) {
      const base = baseByField[field];
      const noise = 0.75 + rand() * 0.6;
      const trend =
        1 +
        0.08 * Math.sin(((ts - from) / Math.max(range, 1)) * Math.PI * 2);
      const value = Math.max(0, Math.round(base * noise * trend));
      values[field] = value;
    }

    points.push({ timestamp: ts, values });
  }

  return points;
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const dataset = searchParams.get('dataset')?.trim();
  const fromParam = parseTimestamp(searchParams.get('from'));
  const toParam = parseTimestamp(searchParams.get('to'));
  const fields = parseFields(searchParams.get('fields'));

  if (!dataset) {
    return NextResponse.json({ message: 'dataset is required' }, { status: 400 });
  }

  if (fromParam === null || toParam === null) {
    return NextResponse.json(
      { message: 'from and to are required timestamps (ms)' },
      { status: 400 },
    );
  }

  if (toParam <= fromParam) {
    return NextResponse.json(
      { message: 'to must be greater than from' },
      { status: 400 },
    );
  }

  const delayMs = 500 + Math.floor(Math.random() * 301);
  await delay(delayMs);

  const points = generatePoints(dataset, fromParam, toParam, fields);

  const body: MetricsResponse = {
    dataset,
    range: { from: fromParam, to: toParam },
    fields,
    points,
    annotations: [],
  };

  return NextResponse.json(body);
}
