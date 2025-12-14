import api from './api';

export type DatasetStatus = 'active' | 'inactive' | 'archived';

export type Dataset = {
  id: string;
  name: string;
  status: DatasetStatus;
  description: string;
  updatedAt: string;
  records: number;
};

export type DatasetListResponse = {
  datasets: Dataset[];
  total: number;
};

export type DatasetQueryParams = {
  search?: string;
  status?: DatasetStatus;
};

export const fetchDatasets = async (
  params: DatasetQueryParams = {},
): Promise<DatasetListResponse> => {
  const query: Record<string, string> = {};

  if (params.search && params.search.trim()) {
    query.search = params.search.trim();
  }

  if (params.status) {
    query.status = params.status;
  }

  const response = await api.get<DatasetListResponse>('/datasets', {
    params: query,
  });

  return response.data;
};

const datasetsService = {
  fetchDatasets,
};

export default datasetsService;
