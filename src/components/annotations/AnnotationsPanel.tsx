'use client';

import { FormEvent, JSX, useMemo, useState } from 'react';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import { Skeleton } from '@/components/common/Skeleton';
import { useAnnotations } from '@/hooks/useAnnotations';
import AnnotationForm from './AnnotationForm';
import AnnotationItem from './AnnotationItem';

type FormState = {
  text: string;
  timestamp: string;
  error?: string;
};

const nowInputValue = (): string => {
  const now = new Date();
  now.setSeconds(0, 0);
  return now.toISOString().slice(0, 16);
};

export function AnnotationsPanel(): JSX.Element {
  const [form, setForm] = useState<FormState>({
    text: '',
    timestamp: nowInputValue(),
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    annotationsQuery,
    createAnnotationMutation,
    deleteAnnotationMutation,
  } = useAnnotations();

  const isLoading = annotationsQuery.isPending;
  const annotations = useMemo(
    () => annotationsQuery.data?.annotations ?? [],
    [annotationsQuery.data]
  );

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const submitDisabled =
    createAnnotationMutation.isPending ||
    !form.text.trim() ||
    !form.timestamp ||
    Boolean(form.error);

  const handleAdd = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = Date.parse(form.timestamp);
    if (!Number.isFinite(parsed)) {
      setForm((prev) => ({ ...prev, error: 'Enter a valid timestamp' }));
      return;
    }

    try {
      await createAnnotationMutation.mutateAsync({
        timestamp: parsed,
        text: form.text.trim(),
      });
      setForm({ text: '', timestamp: nowInputValue(), error: undefined });
      closeDialog();
    } catch {
      // Error surfaced via mutation state
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAnnotationMutation.mutateAsync(id);
    } catch {
      // Error surfaced via mutation state
    }
  };

  return (
    <div className='flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-4 text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100'>
      <div className='flex items-center justify-between'>
        <div>
          <div className='text-sm font-semibold text-zinc-900 dark:text-zinc-100'>
            Annotations
          </div>
          <div className='text-xs text-zinc-500 dark:text-zinc-400'>
            Manage markers for the chart
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <span className='text-xs text-zinc-500 dark:text-zinc-400'>
            {annotationsQuery.isFetching ? 'Refreshing…' : ''}
          </span>
          <Button
            type='button'
            onClick={openDialog}
            variant='primary'
            size='xs'
          >
            Add annotation
          </Button>
        </div>
      </div>

      {annotationsQuery.isError && annotationsQuery.error ? (
        <ErrorState
          title='Unable to load annotations'
          message={annotationsQuery.error.message}
          tone='danger'
          onRetry={() => annotationsQuery.refetch()}
          retryLabel='Retry'
        />
      ) : null}

      {isLoading ? (
        <div className='space-y-2'>
          {[0, 1, 2].map((key) => (
            <div
              key={key}
              className='flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900'
            >
              <Skeleton width={96} height={16} rounded='sm' />
              <Skeleton width={48} height={16} rounded='sm' />
            </div>
          ))}
        </div>
      ) : null}

      {!isLoading && annotations.length === 0 ? (
        <EmptyState dashed message='No annotations yet.' />
      ) : null}

      {!isLoading && annotations.length > 0 ? (
        <ul className='space-y-2'>
          {annotations.map((annotation) => (
            <AnnotationItem
              key={annotation.id}
              annotation={annotation}
              onDelete={handleDelete}
              deleting={deleteAnnotationMutation.isPending}
            />
          ))}
        </ul>
      ) : null}

      <AnnotationForm
        open={isDialogOpen}
        onClose={closeDialog}
        form={form}
        onFormChange={(next) => setForm((prev) => ({ ...prev, ...next }))}
        onSubmit={handleAdd}
        submitDisabled={submitDisabled}
        isPending={createAnnotationMutation.isPending}
        errorMessage={
          createAnnotationMutation.isError && createAnnotationMutation.error
            ? createAnnotationMutation.error.message
            : undefined
        }
      />
    </div>
  );
}

export default AnnotationsPanel;
