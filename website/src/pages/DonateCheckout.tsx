/* ─────────────────────────────────────────────────────────────────────────────
   DonateCheckout.tsx — Step 5: Pay via QR
   Route: /donate/checkout/:token
   
   Restores state upon refresh via getPaymentIntent(token).
   Countdown timer to expires_at (10 mins).
   QR slot with scan-line animation and fallback placeholder.
   Idempotent confirmPayment with double-click guard.
   Mobile-first sticky action bar.
   ───────────────────────────────────────────────────────────────────────────── */

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  getPaymentIntent,
  confirmPayment,
  cancelPaymentIntent,
  type PaymentIntent,
} from "../api";
import {
  QR_IMAGE_PATH,
  UPI_ID_DISPLAY,
  PAYEE_NAME,
} from "../config/payment";
import { formatINR, shortToken } from "../mock/donation";
import { LoadingSpinner, DonationErrorBoundary } from "../components";
import StepProgress from "./donate/StepProgress";

export function DonateCheckoutContent() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [intent, setIntent] = useState<PaymentIntent | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // QR image load state
  const [imageError, setImageError] = useState(false);

  // UTR field
  const [utr, setUtr] = useState("");

  // Countdown timer in seconds
  const [secondsRemaining, setSecondsRemaining] = useState<number>(600);
  const [isExpired, setIsExpired] = useState(false);

  // Confirmation state
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  // Cancellation state
  const [isCancelling, setIsCancelling] = useState(false);

  // Reference copy notification
  const [copied, setCopied] = useState(false);

  // ─── Fetch Intent on Mount / Refresh ─────────────────────────────────────────
  useEffect(() => {
    if (!token) {
      setFetchError("Invalid checkout link: missing transaction token.");
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);

    getPaymentIntent(token)
      .then((data) => {
        if (!mounted) return;
        if (!data) {
          setFetchError("Payment session not found or does not exist.");
          return;
        }

        // If already paid, directly navigate to success
        if (data.status === "paid") {
          navigate(`/donate/success/${token}`, { replace: true });
          return;
        }

        setIntent(data);

        // Check expiration
        const expiry = new Date(data.expires_at).getTime();
        const diffSecs = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
        setSecondsRemaining(diffSecs);

        if (diffSecs <= 0 || data.status === "expired") {
          setIsExpired(true);
        }
      })
      .catch((err) => {
        if (!mounted) return;
        setFetchError(err instanceof Error ? err.message : "Failed to load payment session.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [token, navigate]);

  // ─── Countdown Timer ────────────────────────────────────────────────────────
  useEffect(() => {
    if (loading || isExpired || !intent) return;

    const timer = setInterval(() => {
      const expiry = new Date(intent.expires_at).getTime();
      const diffSecs = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
      setSecondsRemaining(diffSecs);

      if (diffSecs <= 0) {
        setIsExpired(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, isExpired, intent]);

  // ─── Copy Reference ─────────────────────────────────────────────────────────
  const handleCopyReference = () => {
    if (!intent) return;
    navigator.clipboard.writeText(intent.token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ─── Confirm Payment ────────────────────────────────────────────────────────
  const handleConfirmPayment = async () => {
    if (!token || isConfirming || isExpired) return;

    setIsConfirming(true);
    setConfirmError(null);

    try {
      const result = await confirmPayment(token, utr);
      if (result.success) {
        navigate(`/donate/success/${token}`);
      }
    } catch (err) {
      setConfirmError(
        err instanceof Error
          ? err.message
          : "Verification failed. Please check your network and retry."
      );
    } finally {
      setIsConfirming(false);
    }
  };

  // ─── Cancel Intent ──────────────────────────────────────────────────────────
  const handleCancel = async () => {
    if (!token || isCancelling) return;
    setIsCancelling(true);
    try {
      await cancelPaymentIntent(token);
    } catch {
      // non-fatal
    } finally {
      navigate("/donate");
    }
  };

  // Format MM:SS
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // ─── Loading State ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="section-wrapper py-28 flex flex-col items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
        <p className="mt-4 text-sm text-[var(--color-muted)] font-medium">
          Retrieving secure QR payment session...
        </p>
      </main>
    );
  }

  // ─── Fetch Error State ──────────────────────────────────────────────────────
  if (fetchError || !intent) {
    return (
      <main className="section-wrapper py-24 flex items-center justify-center min-h-[60vh]">
        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center text-2xl mb-4">
            ⚠️
          </div>
          <h2 className="text-xl font-serif font-bold text-stone-900 mb-2">
            Payment Session Error
          </h2>
          <p className="text-stone-600 text-sm mb-6 leading-relaxed">
            {fetchError || "The requested payment session could not be found."}
          </p>
          <Link
            to="/donate"
            className="inline-block px-6 py-3 rounded-full bg-[var(--color-primary)] text-white font-medium text-sm hover:opacity-95 transition-opacity"
          >
            Start a New Donation
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative pt-28 pb-32 overflow-hidden min-h-screen">
      {/* Aurora Ambient Background */}
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
      </div>

      <div className="section-wrapper relative z-10 max-w-3xl mx-auto">
        {/* Step Progress Bar */}
        <StepProgress currentStep={5} />

        {/* Main Payment Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border-2 border-[var(--color-border)] rounded-3xl p-6 sm:p-10 shadow-xl space-y-8"
        >
          {/* Header & Session Timer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
            <div>
              <span className="section-label">Step 5 of 5 • Payment</span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-fg)] mt-0.5">
                Scan & Complete Payment
              </h1>
              <p className="text-xs sm:text-sm text-[var(--color-muted)] mt-1">
                Project:{" "}
                <strong className="text-stone-800 font-semibold">
                  {intent.project_name}
                </strong>
              </p>
            </div>

            {/* Countdown Badge */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs sm:text-sm font-semibold select-none self-start sm:self-auto ${
                isExpired
                  ? "bg-red-50 border-red-200 text-red-700"
                  : secondsRemaining < 120
                  ? "bg-amber-50 border-amber-200 text-amber-800 animate-pulse"
                  : "bg-emerald-50 border-emerald-200 text-emerald-800"
              }`}
            >
              <span>⏱️</span>
              <span>{isExpired ? "Session Expired" : `Valid for ${timeFormatted}`}</span>
            </div>
          </div>

          {/* Amount Showcase */}
          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[var(--color-muted)] uppercase tracking-wide font-semibold block mb-0.5">
                Amount to Pay
              </span>
              <div className="text-3xl sm:text-4xl font-serif font-bold text-[var(--color-primary)]">
                {formatINR(intent.amount)}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500">Ref:</span>
              <code className="px-2.5 py-1 rounded-md bg-stone-200/80 font-mono font-semibold text-stone-800 text-xs">
                {shortToken(intent.token)}
              </code>
              <button
                type="button"
                onClick={handleCopyReference}
                className="px-2 py-1 rounded text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
                title="Copy full token"
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* QR SLOT Container */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative p-6 sm:p-8 bg-white border-2 border-dashed border-[var(--color-border)] rounded-3xl shadow-sm max-w-sm w-full overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
              {/* Scan-line Animation */}
              {!isExpired && <div className="qr-scan-line" aria-hidden="true" />}

              {!imageError ? (
                <div className="relative flex flex-col items-center">
                  <img
                    src={QR_IMAGE_PATH}
                    alt="Scan UPI QR Code to donate"
                    onError={() => setImageError(true)}
                    className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-xl"
                  />
                  <span className="mt-3 text-[11px] font-medium text-stone-400 uppercase tracking-widest">
                    UPI Payment QR
                  </span>
                </div>
              ) : (
                /* Elegant Fallback Placeholder */
                <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-2xl text-stone-500">
                    📷
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-800 text-sm">
                      QR code goes here
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 max-w-[240px] leading-relaxed">
                      Please place your QR image at:
                      <br />
                      <code className="font-mono text-[11px] bg-stone-100 px-2 py-0.5 rounded text-[var(--color-primary)] font-semibold mt-1 inline-block">
                        public/payment-qr.png
                      </code>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Instruction copy under QR */}
            <p className="text-xs sm:text-sm text-stone-600 mt-4 text-center max-w-md font-medium">
              Scan with any UPI app (GPay, PhonePe, Paytm, BHIM), then tap the button below.
            </p>

            {/* Optional Payee & UPI ID Display */}
            {(PAYEE_NAME !== "" || UPI_ID_DISPLAY !== "") && (
              <div className="mt-2 text-center text-xs text-stone-500 space-x-2">
                {PAYEE_NAME !== "" && (
                  <span>
                    Payee: <strong>{PAYEE_NAME}</strong>
                  </span>
                )}
                {PAYEE_NAME !== "" && UPI_ID_DISPLAY !== "" && <span>•</span>}
                {UPI_ID_DISPLAY !== "" && (
                  <span>
                    UPI ID: <code>{UPI_ID_DISPLAY}</code>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Optional UTR / Reference Field */}
          <div className="max-w-md mx-auto w-full">
            <label
              htmlFor="utr_ref"
              className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5"
            >
              Transaction Reference / UTR (optional)
            </label>
            <input
              id="utr_ref"
              type="text"
              placeholder="e.g. 402918274619 or UPI Ref ID"
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
              disabled={isExpired || isConfirming}
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] text-sm font-medium focus:outline-none focus:border-[var(--color-primary)] disabled:bg-stone-100 disabled:opacity-70 transition-colors"
            />
          </div>

          {/* Error Message if Confirmation Fails */}
          <AnimatePresence mode="wait">
            {confirmError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium flex items-center gap-2.5 max-w-md mx-auto"
                role="alert"
              >
                <span className="text-base select-none">⚠️</span>
                <span>{confirmError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expired State Notice */}
          {isExpired && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-center max-w-md mx-auto space-y-2">
              <p className="text-xs sm:text-sm font-medium">
                This payment session has timed out. For security, payment intents expire after 10 minutes.
              </p>
              <Link
                to="/donate"
                className="inline-block px-6 py-2.5 rounded-full bg-[var(--color-primary)] text-white text-xs font-semibold hover:opacity-95"
              >
                Start Again
              </Link>
            </div>
          )}

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
            <button
              type="button"
              disabled={isConfirming || isCancelling}
              onClick={handleCancel}
              className="px-6 py-3 rounded-full border border-[var(--color-border)] text-stone-700 font-medium text-sm hover:bg-stone-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isCancelling ? "Cancelling..." : "Cancel Payment"}
            </button>

            <button
              type="button"
              disabled={isExpired || isConfirming}
              onClick={handleConfirmPayment}
              className={`px-10 py-3.5 rounded-full font-semibold text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2 min-w-[220px] ${
                isExpired
                  ? "bg-stone-200 text-stone-400 cursor-not-allowed shadow-none"
                  : "bg-[var(--color-primary)] text-white hover:opacity-95"
              }`}
            >
              {isConfirming ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Verifying Payment...</span>
                </>
              ) : (
                <>
                  <span>I have paid</span>
                  <svg
                    className="w-4 h-4 stroke-[2.5]"
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
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Mobile-First Sticky Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur-md border-t border-[var(--color-border)] shadow-lg flex items-center gap-3">
        <button
          type="button"
          disabled={isConfirming || isCancelling}
          onClick={handleCancel}
          className="flex-1 py-3 px-3 rounded-full border border-[var(--color-border)] text-stone-700 font-medium text-xs text-center hover:bg-stone-100 transition-colors"
        >
          {isCancelling ? "Cancelling..." : "Cancel"}
        </button>

        <button
          type="button"
          disabled={isExpired || isConfirming}
          onClick={handleConfirmPayment}
          className={`flex-[2] py-3 px-4 rounded-full font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 ${
            isExpired
              ? "bg-stone-200 text-stone-400 cursor-not-allowed shadow-none"
              : "bg-[var(--color-primary)] text-white active:scale-95"
          }`}
        >
          {isConfirming ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <span>I have paid</span>
              <svg
                className="w-3.5 h-3.5 stroke-[2.5]"
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
            </>
          )}
        </button>
      </div>
    </main>
  );
}

export default function DonateCheckout() {
  return (
    <DonationErrorBoundary fallbackMessage="Unable to load this payment checkout. Please return to the donation page.">
      <DonateCheckoutContent />
    </DonationErrorBoundary>
  );
}
