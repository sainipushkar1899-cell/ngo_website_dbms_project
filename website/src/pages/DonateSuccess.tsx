/* ─────────────────────────────────────────────────────────────────────────────
   DonateSuccess.tsx — Step 6: Result / Confirmation
   Route: /donate/success/:token
   
   Celebratory and dignified success screen with animated checkmark.
   Official 80G Receipt Card with receipt_no, donation_id, donation_date, donor_name,
   project_name, amount.
   Print stylesheet support with dedicated "Download or print receipt" trigger.
   Animated project progress bar, Share feature, and Donate Again action.
   ───────────────────────────────────────────────────────────────────────────── */

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  getPaymentIntent,
  getReceipt,
  getProjectsForDonation,
  type PaymentIntent,
  type DonationReceipt,
  type ProjectForDonation,
} from "../api";
import { formatINR } from "../mock/donation";
import { LoadingSpinner, DonationErrorBoundary } from "../components";

export function DonateSuccessContent() {
  const { token } = useParams<{ token: string }>();

  const [receipt, setReceipt] = useState<DonationReceipt | null>(null);
  const [project, setProject] = useState<ProjectForDonation | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);

    Promise.all([
      getPaymentIntent(token),
      getReceipt(token),
      getProjectsForDonation(),
    ])
      .then(([intentData, receiptData, projectsData]) => {
        if (!mounted) return;
        if (intentData) {
          const matchedProj = projectsData.find(
            (p) => p.project_id === intentData.project_id
          );
          if (matchedProj) setProject(matchedProj);
        }

        if (receiptData) {
          setReceipt(receiptData);
        } else if (intentData) {
          // If receipt not explicitly found, synthesize from intent
          setReceipt({
            receipt_no: `RCT-${intentData.token.slice(0, 8).toUpperCase()}`,
            donation_id: intentData.token,
            donation_date: intentData.created_at.slice(0, 10),
            donor_name: intentData.donor_name,
            project_name: intentData.project_name,
            amount: intentData.amount,
          });
        }
      })
      .catch((err) => {
        console.error("Failed to load receipt:", err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [token]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: "I supported Aadhara Foundation",
      text: `I just contributed ${receipt ? formatINR(receipt.amount) : "a donation"} to ${receipt?.project_name || "Aadhara Foundation"}. Join me in making a difference!`,
      url: window.location.origin + "/donate",
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(
        `${shareData.text} ${shareData.url}`
      );
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  if (loading) {
    return (
      <main className="section-wrapper py-28 flex flex-col items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
        <p className="mt-4 text-sm text-[var(--color-muted)] font-medium">
          Generating official 80G tax receipt...
        </p>
      </main>
    );
  }

  if (!receipt) {
    return (
      <main className="section-wrapper py-24 flex items-center justify-center min-h-[60vh]">
        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center text-2xl mb-4">
            🔍
          </div>
          <h2 className="text-xl font-serif font-bold text-stone-900 mb-2">
            Receipt Not Found
          </h2>
          <p className="text-stone-600 text-sm mb-6 leading-relaxed">
            We could not find an active confirmed donation for this reference token.
          </p>
          <Link
            to="/donate"
            className="inline-block px-6 py-3 rounded-full bg-[var(--color-primary)] text-white font-medium text-sm hover:opacity-95"
          >
            Go to Donate
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative pt-28 pb-32 overflow-hidden min-h-screen">
      {/* Aurora Ambient Background (hidden during print) */}
      <div className="aurora-bg no-print" aria-hidden="true">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
      </div>

      <div className="section-wrapper relative z-10 max-w-2xl mx-auto px-4">
        {/* Celebratory Checkmark Icon */}
        <div className="text-center mb-8 no-print">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-500/20 text-emerald-700 mx-auto flex items-center justify-center shadow-lg mb-4"
          >
            <svg
              className="w-10 h-10 stroke-[2.5]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>

          <span className="section-label">Payment Confirmed</span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[var(--color-fg)] mt-1 mb-2">
            Thank you, {receipt.donor_name}!
          </h1>
          <p className="text-sm md:text-base text-[var(--color-muted)] max-w-md mx-auto leading-relaxed">
            Your generous contribution of{" "}
            <strong className="text-stone-900 font-bold">
              {formatINR(receipt.amount)}
            </strong>{" "}
            has been confirmed and allocated to{" "}
            <strong className="text-stone-900 font-semibold">
              {receipt.project_name}
            </strong>.
          </p>
        </div>

        {/* Printable Official Receipt Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="print-receipt-container bg-white border-2 border-[var(--color-border)] rounded-3xl p-6 md:p-8 shadow-xl space-y-6"
        >
          {/* Receipt Top Header */}
          <div className="flex items-start justify-between border-b-2 border-stone-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🌿</span>
                <span className="font-serif font-bold text-lg text-[var(--color-primary)]">
                  Aadhara Foundation
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Regd. Section 80G Certified Non-Profit Organisation
              </p>
              <p className="text-[10px] text-stone-400">
                PAN: AAATA1234F • 80G Approval: CIT/BLR/80G/2024-25/1049
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                Confirmed Paid
              </span>
              <p className="text-[11px] font-mono text-stone-500 mt-1">
                {receipt.donation_date}
              </p>
            </div>
          </div>

          {/* Receipt Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 py-2 text-xs md:text-sm">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
                Receipt Number
              </span>
              <span className="font-mono font-bold text-stone-800">
                {receipt.receipt_no}
              </span>
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
                Donation ID
              </span>
              <span className="font-mono font-semibold text-stone-700">
                {receipt.donation_id}
              </span>
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
                Donor Name
              </span>
              <span className="font-semibold text-stone-900">
                {receipt.donor_name}
              </span>
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
                Allocated Project
              </span>
              <span className="font-semibold text-stone-900">
                {receipt.project_name}
              </span>
            </div>
          </div>

          {/* Amount Paid Highlight Row */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-stone-600 font-semibold">
              Total Amount Received
            </span>
            <span className="text-2xl font-serif font-bold text-[var(--color-primary)]">
              {formatINR(receipt.amount)}
            </span>
          </div>

          {/* Legal / Audit compliance disclaimer */}
          <div className="text-[11px] text-stone-500 border-t border-stone-100 pt-4 leading-relaxed">
            * This donation is eligible for tax deduction under Section 80G of the Indian Income Tax Act, 1961. Retain this digital receipt for tax filing purposes.
          </div>
        </motion.div>

        {/* Updated Project Progress Bar */}
        {project && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-6 bg-white border border-[var(--color-border)] rounded-2xl p-5 shadow-sm space-y-2.5 no-print"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-800">
                Project Progress: {project.project_name}
              </span>
              <span className="font-bold text-[var(--color-primary)]">
                {project.percent_funded}% Funded
              </span>
            </div>

            <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, project.percent_funded)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-[var(--color-primary)] rounded-full"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium">
              <span>Raised: {formatINR(project.raised)}</span>
              <span>Target: {formatINR(project.budget)}</span>
            </div>
          </motion.div>
        )}

        {/* Action Controls (Hidden in print) */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 no-print">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[var(--color-primary)] text-white font-semibold text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <svg
              className="w-4 h-4 stroke-[2]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            <span>Download or Print Receipt</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="w-full sm:w-auto px-5 py-3.5 rounded-full border border-[var(--color-border)] text-stone-800 font-medium text-sm hover:bg-stone-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg
              className="w-4 h-4 stroke-[2]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            <span>{copiedShare ? "Link Copied!" : "Share Cause"}</span>
          </button>

          <Link
            to="/donate"
            className="w-full sm:w-auto px-5 py-3.5 rounded-full border border-[var(--color-border)] text-stone-700 font-medium text-sm hover:bg-stone-50 transition-colors text-center"
          >
            Donate Again
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function DonateSuccess() {
  return (
    <DonationErrorBoundary fallbackMessage="Unable to display donation confirmation. Please check your network or return to the donation page.">
      <DonateSuccessContent />
    </DonationErrorBoundary>
  );
}
