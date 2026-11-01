interface EmptyStateProps {
  message: string;
  icon?: string;
}

export function EmptyState({ message, icon = '📭' }: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message}
      className="card-static flex flex-col items-center gap-4 px-6 py-14 text-center max-w-sm mx-auto"
    >
      {/* Decorative icon or emoji */}
      <span
        aria-hidden="true"
        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[color-mix(in_srgb,var(--primary-cta)_8%,transparent)] text-3xl select-none"
        role="img"
      >
        {icon}
      </span>

      <div>
        <h3 className="font-display font-semibold text-[var(--fg)] mb-1 text-lg">
          Nothing here yet
        </h3>
        <p className="text-sm text-[var(--muted)] leading-relaxed">{message}</p>
      </div>
    </div>
  );
}

export default EmptyState;
