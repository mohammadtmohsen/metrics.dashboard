'use client';

import { useMemo, useState } from 'react';
import { useAnnotations } from '@/hooks/useAnnotations';

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
  const [form, setForm] = useState<FormState>({ text: '', timestamp: nowInputValue() });

  const {
    annotationsQuery,
    createAnnotationMutation,
    deleteAnnotationMutation,
  } = useAnnotations();

  const isLoading = annotationsQuery.isPending;
  const annotations = useMemo(
    () => annotationsQuery.data?.annotations ?? [],
    [annotationsQuery.data],
  );

  const submitDisabled =
    createAnnotationMutation.isPending ||
    !form.text.trim() ||
    !form.timestamp ||
    Boolean(form.error);

  const handleAdd = async () => {
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
    <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-zinc-900">Annotations</div>
          <div className="text-xs text-zinc-500">Manage markers for the chart</div>
        </div>
        <span className="text-xs text-zinc-500">
          {annotationsQuery.isFetching ? 'Refreshing…' : ''}
        </span>
      </div>

      {annotationsQuery.isError && annotationsQuery.error ? (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {annotationsQuery.error.message}
        </div>
      ) : null}

      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((key) => (
            <div
              key={key}
              className="flex animate-pulse items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2"
            >
              <div className="h-4 w-24 rounded bg-zinc-200" />
              <div className="h-4 w-12 rounded bg-zinc-200" />
            </div>
          ))}
        </div>
      ) : null}

      {!isLoading && annotations.length === 0 ? (
        <div className="rounded-md border border-dashed border-zinc-300 px-3 py-3 text-sm text-zinc-600">
          No annotations yet.
        </div>
      ) : null}

      {!isLoading && annotations.length > 0 ? (
        <ul className="space-y-2">
          {annotations.map((annotation) => (
            <li
              key={annotation.id}
              className="flex items-start justify-between rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2"
            >
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-zinc-900">{annotation.text}</span>
                <span className="text-xs text-zinc-600">
                  {new Date(annotation.timestamp).toLocaleString()}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(annotation.id)}
                disabled={deleteAnnotationMutation.isPending}
                className="text-xs font-medium text-rose-600 transition hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="h-px bg-zinc-200" />

      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm text-zinc-700">
          Timestamp
          <input
            type="datetime-local"
            value={form.timestamp}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, timestamp: event.target.value, error: undefined }))
            }
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-zinc-700">
          Text
          <input
            type="text"
            value={form.text}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, text: event.target.value, error: undefined }))
            }
            placeholder="Deployment, incident, etc."
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
        </label>
        {form.error ? <div className="text-xs text-rose-600">{form.error}</div> : null}
        {createAnnotationMutation.isError && createAnnotationMutation.error ? (
          <div className="text-xs text-rose-600">{createAnnotationMutation.error.message}</div>
        ) : null}
        <button
          type="button"
          onClick={handleAdd}
          disabled={submitDisabled}
          className="inline-flex w-fit items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {createAnnotationMutation.isPending ? 'Adding…' : 'Add Annotation'}
        </button>
      </div>
    </div>
  );
}

export default AnnotationsPanel;
