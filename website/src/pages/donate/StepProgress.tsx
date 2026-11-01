/* ─────────────────────────────────────────────────────────────────────────────
   StepProgress.tsx — Animated 5-step progress indicator for the donation flow.
   Silk-design motion, accessible step semantics, responsive label layout.
   ───────────────────────────────────────────────────────────────────────────── */

import { motion } from "motion/react";

interface StepProgressProps {
  currentStep: number; // 1 to 5
  onStepClick?: (step: number) => void;
  maxAccessibleStep?: number;
}

const STEPS = [
  { step: 1, label: "Project", shortLabel: "Project" },
  { step: 2, label: "Amount", shortLabel: "Amount" },
  { step: 3, label: "Details", shortLabel: "Details" },
  { step: 4, label: "Review", shortLabel: "Review" },
  { step: 5, label: "Pay (QR)", shortLabel: "Pay" },
];

export function StepProgress({
  currentStep,
  onStepClick,
  maxAccessibleStep = currentStep,
}: StepProgressProps) {
  return (
    <nav aria-label="Donation progress" className="w-full max-w-3xl mx-auto mb-10 px-2">
      <ol className="flex items-center justify-between relative">
        {/* Background track line */}
        <div
          className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[2px] bg-[var(--color-border)] -z-0"
          aria-hidden="true"
        />

        {/* Animated active progress line */}
        <motion.div
          className="absolute left-6 top-1/2 -translate-y-1/2 h-[2px] bg-[var(--color-primary)] -z-0 origin-left"
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          animate={{
            scaleX: Math.max(0, Math.min(1, (currentStep - 1) / (STEPS.length - 1))),
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{ width: "calc(100% - 3rem)" }}
        />

        {STEPS.map((s) => {
          const isCompleted = s.step < currentStep;
          const isCurrent = s.step === currentStep;
          const isClickable = onStepClick && s.step <= maxAccessibleStep && s.step !== currentStep;

          return (
            <li key={s.step} className="relative z-10 flex flex-col items-center">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(s.step)}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Step ${s.step}: ${s.label}${isCompleted ? " (completed)" : ""}`}
                className={`flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 ${
                  isCompleted
                    ? "bg-[var(--color-primary)] text-white shadow-sm hover:scale-105 cursor-pointer"
                    : isCurrent
                    ? "bg-[var(--color-card)] text-[var(--color-primary)] border-2 border-[var(--color-primary)] shadow-md ring-4 ring-[var(--aurora-1)]"
                    : "bg-[var(--color-card)] text-[var(--color-muted)] border border-[var(--color-border)] cursor-default"
                }`}
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 text-white stroke-[2.5]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span>{s.step}</span>
                )}
              </button>

              <span
                className={`mt-2 text-[11px] md:text-xs font-medium tracking-tight text-center select-none transition-colors duration-200 ${
                  isCurrent
                    ? "text-[var(--color-primary)] font-semibold"
                    : isCompleted
                    ? "text-[var(--color-fg)]"
                    : "text-[var(--color-muted)]"
                }`}
              >
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden">{s.shortLabel}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default StepProgress;
