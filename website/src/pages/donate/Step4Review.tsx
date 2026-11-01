/* ─────────────────────────────────────────────────────────────────────────────
   Step4Review.tsx — Review Donation & Generate Payment Intent
   Displays concise summary card with "Edit" triggers for each prior step.
   Displays clear "Demo project, no real organization" notice.
   Calls createPaymentIntent() and forwards donor to /donate/checkout/:token.
   ───────────────────────────────────────────────────────────────────────────── */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import type { ProjectForDonation } from "../../api";
import { createPaymentIntent } from "../../api";
import { formatINR, CATEGORY_META } from "../../mock/donation";
import { getImpactStatement } from "../../config/payment";
import { LoadingSpinner } from "../../components";

interface Step4ReviewProps {
  project: ProjectForDonation;
  amount: number;
  donorDetails: {
    donor_name: string;
    email: string;
    phone: string;
  };
  onEditStep: (step: 1 | 2 | 3) => void;
  onBack: () => void;
}

export function Step4Review({
  project,
  amount,
  donorDetails,
  onEditStep,
  onBack,
}: Step4ReviewProps) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const meta = CATEGORY_META[project.category] || {
    emoji: "✨",
    color: "#2d5a27",
    bg: "#f0f7ee",
  };
  const impact = getImpactStatement(amount);

  const handleProceedToPayment = async () => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const intent = await createPaymentIntent({
        donor_name: donorDetails.donor_name,
        email: donorDetails.email,
        phone: donorDetails.phone,
        project_id: project.project_id,
        amount,
      });

      // Navigate to checkout route with intent token
      navigate(`/donate/checkout/${intent.token}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Unable to create payment intent. Please check your network and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Step Header */}
      <div className="text-center">
        <span className="section-label">Step 4 of 5</span>
        <h2 className="text-2xl md:text-3xl font-serif text-[var(--color-fg)] mt-1 mb-2">
          Review Your Donation
        </h2>
        <p className="text-sm text-[var(--color-muted)]">
          Please confirm your selected project, contribution amount, and tax receipt details.
        </p>
      </div>

      {/* Mandatory Demo Project Notice */}
      <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-sm">
        <span className="text-xl select-none" aria-hidden="true">💡</span>
        <div className="text-xs sm:text-sm leading-relaxed">
          <strong>Demo project, no real organization:</strong> This application is part of an academic DBMS demonstration (College Problem Statement 39). No real monetary transactions will occur.
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white border-2 border-[var(--color-border)] rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
        {/* Section 1: Project */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-[var(--color-border)]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                style={{ backgroundColor: meta.bg, color: meta.color }}
              >
                {meta.emoji} {project.category}
              </span>
              <span className="text-xs text-[var(--color-muted)] uppercase tracking-wide font-semibold">
                Selected Project
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-[var(--color-fg)]">
              {project.project_name}
            </h3>
            <p className="text-xs text-[var(--color-muted)] mt-1">
              Target: {formatINR(project.budget)} • Remaining need: {formatINR(project.remaining)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(1)}
            className="text-xs font-semibold text-[var(--color-primary)] hover:underline px-3 py-1.5 rounded-lg hover:bg-[var(--color-secondary)]/50 transition-colors cursor-pointer"
          >
            Edit
          </button>
        </div>

        {/* Section 2: Amount */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-[var(--color-border)]">
          <div>
            <span className="block text-xs text-[var(--color-muted)] uppercase tracking-wide font-semibold mb-1">
              Donation Amount
            </span>
            <div className="text-3xl font-serif font-bold text-[var(--color-primary)]">
              {formatINR(amount)}
            </div>
            {impact && (
              <p className="text-xs text-stone-600 mt-1.5 flex items-center gap-1.5">
                <span>{impact.emoji}</span>
                <span>
                  Provides {impact.verb} {impact.description}
                </span>
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onEditStep(2)}
            className="text-xs font-semibold text-[var(--color-primary)] hover:underline px-3 py-1.5 rounded-lg hover:bg-[var(--color-secondary)]/50 transition-colors cursor-pointer"
          >
            Edit
          </button>
        </div>

        {/* Section 3: Donor Details */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="block text-xs text-[var(--color-muted)] uppercase tracking-wide font-semibold mb-1">
              Donor & Tax Receipt Details
            </span>
            <div className="font-semibold text-stone-900 text-sm md:text-base">
              {donorDetails.donor_name}
            </div>
            <div className="text-xs text-stone-600">
              Email: {donorDetails.email}
            </div>
            <div className="text-xs text-stone-600">
              Phone: {donorDetails.phone}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(3)}
            className="text-xs font-semibold text-[var(--color-primary)] hover:underline px-3 py-1.5 rounded-lg hover:bg-[var(--color-secondary)]/50 transition-colors cursor-pointer"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Submission Error Banner */}
      {submitError && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium flex items-center gap-2.5"
          role="alert"
        >
          <span className="text-base select-none">⚠️</span>
          <span>{submitError}</span>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="px-6 py-3 rounded-full border border-[var(--color-border)] text-stone-700 font-medium text-sm hover:bg-stone-100 transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
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
          disabled={submitting}
          onClick={handleProceedToPayment}
          className="px-8 py-3.5 rounded-full font-medium text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white hover:opacity-95 disabled:opacity-70 min-w-[200px]"
        >
          {submitting ? (
            <>
              <LoadingSpinner size="sm" color="white" />
              <span>Preparing QR Checkout...</span>
            </>
          ) : (
            <>
              <span>Proceed to Pay (QR)</span>
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
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default Step4Review;
