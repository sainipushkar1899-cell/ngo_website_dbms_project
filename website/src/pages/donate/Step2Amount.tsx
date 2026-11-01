/* ─────────────────────────────────────────────────────────────────────────────
   Step2Amount.tsx — Choose Donation Amount
   Quick-pick chips + custom amount, INR validation against project remaining budget,
   and dynamic live "your impact" line fed from config.
   ───────────────────────────────────────────────────────────────────────────── */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { ProjectForDonation } from "../../api";
import {
  QUICK_PICK_AMOUNTS,
  MIN_DONATION_INR,
  getImpactStatement,
} from "../../config/payment";
import { formatINR } from "../../mock/donation";

interface Step2AmountProps {
  project: ProjectForDonation;
  initialAmount: number | null;
  onSelectAmount: (amount: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step2Amount({
  project,
  initialAmount,
  onSelectAmount,
  onNext,
  onBack,
}: Step2AmountProps) {
  const [selectedQuickAmount, setSelectedQuickAmount] = useState<number | null>(
    initialAmount && (QUICK_PICK_AMOUNTS as readonly number[]).includes(initialAmount)
      ? initialAmount
      : null
  );
  const [customValue, setCustomValue] = useState<string>(
    initialAmount && !(QUICK_PICK_AMOUNTS as readonly number[]).includes(initialAmount)
      ? String(initialAmount)
      : ""
  );
  const [touched, setTouched] = useState(false);

  // Derived current numeric amount
  const currentAmount =
    selectedQuickAmount !== null
      ? selectedQuickAmount
      : customValue.trim() !== ""
      ? Number(customValue)
      : null;

  // Validation
  let validationError: string | null = null;
  let isOverBudget = false;

  if (currentAmount !== null) {
    if (isNaN(currentAmount) || currentAmount <= 0) {
      validationError = "Please enter a valid positive donation amount.";
    } else if (currentAmount < MIN_DONATION_INR) {
      validationError = `Minimum donation amount is ${formatINR(MIN_DONATION_INR)}.`;
    } else if (currentAmount > project.remaining) {
      isOverBudget = true;
      validationError = `Only ${formatINR(
        project.remaining
      )} is needed to fully fund this project. Please adjust your amount.`;
    }
  }

  const isValid = currentAmount !== null && validationError === null;
  const impactStatement =
    currentAmount && currentAmount >= MIN_DONATION_INR && !isOverBudget
      ? getImpactStatement(currentAmount)
      : null;

  const handleQuickPick = (amt: number) => {
    setSelectedQuickAmount(amt);
    setCustomValue("");
    setTouched(true);
    onSelectAmount(amt);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setCustomValue(raw);
    setSelectedQuickAmount(null);
    setTouched(true);
    const num = Number(raw);
    if (raw !== "" && !isNaN(num)) {
      onSelectAmount(num);
    }
  };

  const handleProceed = () => {
    setTouched(true);
    if (isValid && currentAmount !== null) {
      onSelectAmount(currentAmount);
      onNext();
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Step Header */}
      <div className="text-center">
        <span className="section-label">Step 2 of 5</span>
        <h2 className="text-2xl md:text-3xl font-serif text-[var(--color-fg)] mt-1 mb-2">
          How much would you like to contribute?
        </h2>
        <p className="text-sm text-[var(--color-muted)]">
          Supporting:{" "}
          <strong className="text-[var(--color-fg)] font-semibold">
            {project.project_name}
          </strong>{" "}
          • Need:{" "}
          <span className="text-[var(--color-primary)] font-semibold">
            {formatINR(project.remaining)}
          </span>
        </p>
      </div>

      {/* Quick-Pick Amount Chips */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-3 text-center sm:text-left">
          Select an amount (INR)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {QUICK_PICK_AMOUNTS.map((amt) => {
            const isSelected = selectedQuickAmount === amt;
            const exceedsRemaining = amt > project.remaining;

            return (
              <motion.button
                key={amt}
                type="button"
                whileHover={!exceedsRemaining ? { scale: 1.02 } : undefined}
                whileTap={!exceedsRemaining ? { scale: 0.98 } : undefined}
                disabled={exceedsRemaining}
                onClick={() => handleQuickPick(amt)}
                className={`py-3.5 px-4 rounded-xl font-medium text-sm md:text-base border-2 transition-all cursor-pointer flex flex-col items-center justify-center relative ${
                  exceedsRemaining
                    ? "bg-stone-50 border-stone-200 text-stone-300 cursor-not-allowed opacity-60"
                    : isSelected
                    ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-md ring-2 ring-[var(--color-primary)]/20"
                    : "bg-white border-[var(--color-border)] text-stone-800 hover:border-stone-400 hover:bg-stone-50"
                }`}
              >
                <span>{formatINR(amt)}</span>
                {exceedsRemaining && (
                  <span className="text-[10px] text-amber-700 font-semibold mt-0.5">
                    Exceeds need
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Custom Amount Input */}
      <div>
        <label
          htmlFor="custom_amount"
          className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-2"
        >
          Or enter a custom amount (INR)
        </label>
        <div className="relative">
          <span
            className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-stone-500 select-none"
            aria-hidden="true"
          >
            ₹
          </span>
          <input
            id="custom_amount"
            name="custom_amount"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder={`e.g. ${project.remaining > 2000 ? 1500 : project.remaining}`}
            value={customValue}
            onChange={handleCustomChange}
            aria-describedby={validationError ? "amount-error" : undefined}
            aria-invalid={touched && !!validationError}
            className={`w-full pl-9 pr-4 py-3.5 rounded-xl border-2 bg-white text-stone-900 font-medium text-base focus:outline-none transition-colors ${
              touched && validationError
                ? "border-red-400 focus:border-red-500 bg-red-50/20"
                : "border-[var(--color-border)] focus:border-[var(--color-primary)]"
            }`}
          />
        </div>
      </div>

      {/* Validation Message */}
      <AnimatePresence mode="wait">
        {touched && validationError && (
          <motion.div
            id="amount-error"
            role="alert"
            aria-live="polite"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className={`p-3.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2.5 ${
              isOverBudget
                ? "bg-amber-50 border border-amber-200 text-amber-800"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            <span className="text-base select-none">{isOverBudget ? "ℹ️" : "⚠️"}</span>
            <span>{validationError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Impact Statement */}
      <AnimatePresence mode="wait">
        {impactStatement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="p-4 rounded-xl bg-[var(--color-secondary)]/50 border border-[var(--color-border)] flex items-center gap-3.5"
            aria-live="polite"
          >
            <span className="text-2xl select-none" role="img" aria-hidden="true">
              {impactStatement.emoji}
            </span>
            <div className="text-xs sm:text-sm leading-relaxed text-[var(--color-fg)]">
              <strong className="font-semibold text-[var(--color-primary)]">
                Your impact:{" "}
              </strong>
              This gift {impactStatement.verb}{" "}
              <span className="font-medium">{impactStatement.description}</span>.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 rounded-full border border-[var(--color-border)] text-stone-700 font-medium text-sm hover:bg-stone-100 transition-colors cursor-pointer flex items-center gap-2"
        >
          <svg
            className="w-4 h-4 stroke-[2.5]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Back</span>
        </button>

        <button
          type="button"
          disabled={!isValid}
          onClick={handleProceed}
          className={`px-8 py-3.5 rounded-full font-medium text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2 ${
            isValid
              ? "bg-[var(--color-primary)] text-white hover:opacity-95"
              : "bg-stone-200 text-stone-400 cursor-not-allowed shadow-none"
          }`}
        >
          <span>Continue to Details</span>
          <svg
            className="w-4 h-4 stroke-[2.5]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Step2Amount;
