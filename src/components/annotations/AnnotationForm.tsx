import { FormEvent, JSX } from 'react';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';

export type FormState = {
  text: string;
  timestamp: string;
  error?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  form: FormState;
  onFormChange: (next: Partial<FormState>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitDisabled: boolean;
  isPending: boolean;
  errorMessage?: string;
};

export default function AnnotationForm(props: Props): JSX.Element {
  const {
    open,
    onClose,
    form,
    onFormChange,
    onSubmit,
    submitDisabled,
    isPending,
    errorMessage,
  } = props;

  return (
    <Modal open={open} onClose={onClose} ariaLabel='Add annotation dialog'>
      <div className='flex items-start justify-between'>
        <div>
          <div className='text-sm font-semibold text-zinc-900 dark:text-zinc-100'>
            Add annotation
          </div>
          <div className='text-xs text-zinc-500 dark:text-zinc-400'>
            Set a timestamp and label
          </div>
        </div>
        <Button
          type='button'
          onClick={onClose}
          variant='mutedText'
          size='xs'
          className='font-medium'
        >
          Close
        </Button>
      </div>

      <form className='mt-4 flex flex-col gap-3' onSubmit={onSubmit}>
        <label className='flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300'>
          Timestamp
          <input
            type='datetime-local'
            value={form.timestamp}
            onChange={(event) =>
              onFormChange({ timestamp: event.target.value, error: undefined })
            }
            className='rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-900/60'
            required
          />
        </label>
        <label className='flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300'>
          Text
          <input
            type='text'
            value={form.text}
            onChange={(event) =>
              onFormChange({ text: event.target.value, error: undefined })
            }
            placeholder='Deployment, incident, etc.'
            className='rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-900/60'
            required
          />
        </label>
        {form.error ? (
          <div className='text-xs text-rose-600 dark:text-rose-300'>
            {form.error}
          </div>
        ) : null}
        {errorMessage ? (
          <div className='text-xs text-rose-600 dark:text-rose-300'>
            {errorMessage}
          </div>
        ) : null}
        <div className='flex items-center justify-end gap-2'>
          <Button type='button' onClick={onClose} variant='outline' size='sm'>
            Cancel
          </Button>
          <Button
            type='submit'
            disabled={submitDisabled}
            variant='primary'
            size='md'
          >
            {isPending ? 'Adding…' : 'Save annotation'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
