'use client';

import { FormEvent, JSX, useMemo, useState } from 'react';
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-4 text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Annotations
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Manage markers for the chart
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {annotationsQuery.isFetching ? 'Refreshing…' : ''}
          </span>
          <button
            type="button"
            onClick={openDialog}
            className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
          >
            Add annotation
          </button>
        </div>
      </div>

      {annotationsQuery.isError && annotationsQuery.error ? (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/50 dark:bg-rose-900/40 dark:text-rose-100">
          {annotationsQuery.error.message}
        </div>
      ) : null}

      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((key) => (
            <div
              key={key}
              className="flex animate-pulse items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-4 w-12 rounded bg-zinc-200 dark:bg-zinc-700" />
            </div>
          ))}
        </div>
      ) : null}

      {!isLoading && annotations.length === 0 ? (
        <div className="rounded-md border border-dashed border-zinc-300 px-3 py-3 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
          No annotations yet.
        </div>
      ) : null}

      {!isLoading && annotations.length > 0 ? (
        <ul className="space-y-2">
          {annotations.map((annotation) => (
            <li
              key={annotation.id}
              className="flex items-start justify-between rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {annotation.text}
                </span>
                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                  {new Date(annotation.timestamp).toLocaleString()}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(annotation.id)}
                disabled={deleteAnnotationMutation.isPending}
                className="text-xs font-medium text-rose-600 transition hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-60 dark:text-rose-300 dark:hover:text-rose-200"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {isDialogOpen ? (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 px-4 py-6 dark:bg-black/60">
          <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-5 text-zinc-900 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Add annotation
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  Set a timestamp and label
                </div>
              </div>
              <button
                type="button"
                onClick={closeDialog}
                className="text-xs font-medium text-zinc-500 transition hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                Close
              </button>
            </div>

            <form className="mt-4 flex flex-col gap-3" onSubmit={handleAdd}>
              <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
                Timestamp
                <input
                  type="datetime-local"
                  value={form.timestamp}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      timestamp: event.target.value,
                      error: undefined,
                    }))
                  }
                  className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-900/60"
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
                Text
                <input
                  type="text"
                  value={form.text}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, text: event.target.value, error: undefined }))
                  }
                  placeholder="Deployment, incident, etc."
                  className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-900/60"
                  required
                />
              </label>
              {form.error ? (
                <div className="text-xs text-rose-600 dark:text-rose-300">{form.error}</div>
              ) : null}
              {createAnnotationMutation.isError && createAnnotationMutation.error ? (
                <div className="text-xs text-rose-600 dark:text-rose-300">
                  {createAnnotationMutation.error.message}
                </div>
              ) : null}
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitDisabled}
                  className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-500 dark:hover:bg-emerald-400"
                >
                  {createAnnotationMutation.isPending ? 'Adding…' : 'Save annotation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AnnotationsPanel;
