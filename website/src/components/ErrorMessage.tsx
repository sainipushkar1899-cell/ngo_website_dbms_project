interface ErrorMessageProps {
  message: string;
  retry?: () => void;
}

export function ErrorMessage({ message, retry }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="card-static flex flex-col items-center gap-4 px-6 py-10 text-center max-w-sm mx-auto"
    >
      {/* Icon */}
      <span
        aria-hidden="true"
        className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[color-mix(in_srgb,#ef4444_10%,transparent)]"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-red-500"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </span>

      <div>
        <h3 className="font-display font-semibold text-[var(--fg)] mb-1 text-lg">
          Something went wrong
        </h3>
        <p className="text-sm text-[var(--muted)] leading-relaxed">{message}</p>
      </div>

      {retry && (
        <button
          type="button"
          onClick={retry}
          className="secondary-button"
          aria-label="Try again"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
