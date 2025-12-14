import { NextRequest, NextResponse } from 'next/server';

type DatasetStatus = 'active' | 'inactive' | 'archived';

type Dataset = {
  id: string;
  name: string;
  status: DatasetStatus;
  description: string;
  updatedAt: string;
  records: number;
};

const DATASETS: Dataset[] = [
  {
    id: 'edge-logs',
    name: 'Edge Logs',
    status: 'active',
    description: 'CDN edge request and error logs aggregated hourly.',
    updatedAt: '2024-06-01T12:15:00Z',
    records: 1283000,
  },
  {
    id: 'auth-service',
    name: 'Auth Service',
    status: 'active',
    description: 'Authentication service latency and error metrics.',
    updatedAt: '2024-06-01T12:10:00Z',
    records: 842000,
  },
  {
    id: 'billing-pipeline',
    name: 'Billing Pipeline',
    status: 'inactive',
    description: 'ETL pipeline metrics for billing transformations.',
    updatedAt: '2024-05-28T18:45:00Z',
    records: 412000,
  },
  {
    id: 'mobile-api',
    name: 'Mobile API',
    status: 'active',
    description: 'Mobile API request metrics across regions.',
    updatedAt: '2024-06-01T11:55:00Z',
    records: 973000,
  },
  {
    id: 'legacy-analytics',
    name: 'Legacy Analytics',
    status: 'archived',
    description: 'Deprecated analytics dataset retained for reference.',
    updatedAt: '2024-04-15T09:00:00Z',
    records: 155000,
  },
];

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const isDatasetStatus = (value: string): value is DatasetStatus =>
  value === 'active' || value === 'inactive' || value === 'archived';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.trim().toLowerCase() ?? '';
  const statusParam = searchParams.get('status')?.trim().toLowerCase();

  if (statusParam && !isDatasetStatus(statusParam)) {
    return NextResponse.json(
      { message: 'Invalid status. Use one of: active, inactive, archived.' },
      { status: 400 },
    );
  }

  const delayMs = 500 + Math.floor(Math.random() * 301);
  await delay(delayMs);

  let filtered = DATASETS;

  if (statusParam) {
    filtered = filtered.filter((dataset) => dataset.status === statusParam);
  }

  if (search) {
    filtered = filtered.filter(
      (dataset) =>
        dataset.name.toLowerCase().includes(search) ||
        dataset.description.toLowerCase().includes(search) ||
        dataset.id.toLowerCase().includes(search),
    );
  }

  return NextResponse.json({
    datasets: filtered,
    total: filtered.length,
  });
}
