type Size = 'sm' | 'md' | 'lg';

interface LoadingSpinnerProps {
  size?: Size;
  message?: string;
}

const SIZE_MAP: Record<Size, { box: string; border: string }> = {
  sm: { box: 'w-5 h-5', border: 'border-2' },
  md: { box: 'w-9 h-9', border: 'border-[3px]' },
  lg: { box: 'w-14 h-14', border: 'border-4' },
};

export function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  const { box, border } = SIZE_MAP[size];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message ?? 'Loading…'}
      className="flex flex-col items-center justify-center gap-3"
    >
      <span
        aria-hidden="true"
        className={[
          box,
          border,
          'rounded-full',
          'border-[color-mix(in_srgb,var(--primary-cta)_20%,transparent)]',
          'border-t-[var(--primary-cta)]',
          'animate-spin',
        ].join(' ')}
        style={{ animationDuration: '0.75s' }}
      />
      {message && (
        <p className="text-sm text-[var(--muted)] font-body">{message}</p>
      )}
      {/* SR-only live text */}
      <span className="sr-only">{message ?? 'Loading, please wait.'}</span>
    </div>
  );
}

export default LoadingSpinner;
