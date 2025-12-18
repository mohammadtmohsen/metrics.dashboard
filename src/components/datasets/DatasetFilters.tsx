import { JSX, ChangeEvent } from 'react';
import type { DatasetStatus } from '@/services/datasets.service';

export type StatusFilter = DatasetStatus | 'all';

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
};

const statusOptions: { label: string; value: StatusFilter }[] = [
  { label: 'All statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Archived', value: 'archived' },
];

export default function DatasetFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: Props): JSX.Element {
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) =>
    onSearchChange(e.target.value);
  const handleStatus = (e: ChangeEvent<HTMLSelectElement>) =>
    onStatusChange(e.target.value as StatusFilter);

  return (
    <div className='flex gap-3'>
      <input
        type='search'
        value={search}
        onChange={handleSearch}
        placeholder='Search datasets'
        className='flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-900/60'
      />
      <select
        value={status}
        onChange={handleStatus}
        className='w-40 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-900/60'
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
