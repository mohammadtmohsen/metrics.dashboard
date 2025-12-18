import { JSX } from 'react';
import Button from '@/components/common/Button';
import type { Annotation } from '@/types/annotation';

type Props = {
  annotation: Annotation;
  onDelete: (id: string) => void;
  deleting?: boolean;
};

export default function AnnotationItem({
  annotation,
  onDelete,
  deleting,
}: Props): JSX.Element {
  return (
    <li className='flex items-start justify-between rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900'>
      <div className='flex flex-col gap-1'>
        <span className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>
          {annotation.text}
        </span>
        <span className='text-xs text-zinc-600 dark:text-zinc-400'>
          {new Date(annotation.timestamp).toLocaleString()}
        </span>
      </div>
      <Button
        type='button'
        onClick={() => onDelete(annotation.id)}
        disabled={Boolean(deleting)}
        variant='dangerText'
        size='xs'
        className='font-medium'
      >
        Delete
      </Button>
    </li>
  );
}
