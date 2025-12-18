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
