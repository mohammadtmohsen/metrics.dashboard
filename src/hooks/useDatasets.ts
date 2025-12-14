import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  DatasetListResponse,
  DatasetStatus,
  fetchDatasets,
} from '@/services/datasets.service';
import { NormalizedApiError } from '@/services/api';

type UseDatasetsArgs = {
  search?: string;
  status?: DatasetStatus;
};

const datasetsKey = (params: UseDatasetsArgs) => [
  'datasets',
  {
    search: params.search?.trim() ?? '',
    status: params.status ?? '',
  },
];

export const useDatasets = (
  params: UseDatasetsArgs = {},
): UseQueryResult<DatasetListResponse, NormalizedApiError> => {
  return useQuery<DatasetListResponse, NormalizedApiError>({
    queryKey: datasetsKey(params),
    queryFn: () =>
      fetchDatasets({
        search: params.search?.trim(),
        status: params.status,
      }),
  });
};

export default useDatasets;
