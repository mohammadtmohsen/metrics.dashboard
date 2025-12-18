import api from './api';
import type { DatasetListResponse, DatasetQueryParams } from '@/types/dataset';
export type {
  Dataset,
  DatasetStatus,
  DatasetListResponse,
  DatasetQueryParams,
} from '@/types/dataset';

export const fetchDatasets = async (
  params: DatasetQueryParams = {}
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
