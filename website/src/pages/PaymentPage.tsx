/* ─────────────────────────────────────────────────────────────────────────────
   Payment Page — Aadhara Foundation
   Route: /pay/:token
   ───────────────────────────────────────────────────────────────────────────── */

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { LoadingSpinner } from '../components';
import { getPaymentIntent, confirmPayment } from '../api';
import type { PaymentIntent } from '../api';
import { NGO } from '../config/ngo';

// ─── Types ────────────────────────────────────────────────────────────────────

type PaymentMethod = 'upi' | 'card';
type PageState = 'loading' | 'error' | 'form' | 'processing' | 'success' | 'failure';

interface CardFields {
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardName: string;
}

interface FormErrors {
  upiId?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  cardName?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCardNumber(v: string): string {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(v: string): string {
  const clean = v.replace(/\D/g, '').slice(0, 4);
  if (clean.length > 2) return `${clean.slice(0, 2)}/${clean.slice(2)}`;
  return clean;
}

function validateUpi(upiId: string): boolean {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/.test(upiId.trim());
}

// ─── Payment Page ─────────────────────────────────────────────────────────────

export default function PaymentPage() {
  const { token } = useParams<{ token: string }>();

  const [pageState, setPageState] = useState<PageState>('loading');
  const [intent, setIntent] = useState<PaymentIntent | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Payment method
  const [method, setMethod] = useState<PaymentMethod>('upi');

  // UPI
  const [upiId, setUpiId] = useState('');

  // Card fields
  const [card, setCard] = useState<CardFields>({ cardNumber: '', expiry: '', cvv: '', cardName: '' });

  // Errors
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [payError, setPayError] = useState<string | null>(null);

  // Success/failure
  const [resultIntent, setResultIntent] = useState<PaymentIntent | null>(null);

  useEffect(() => {
    if (!token) {
      setFetchError('Invalid payment link — no token provided.');
      setPageState('error');
      return;
    }

    getPaymentIntent(token)
      .then((data) => {
        if (!data) {
          setFetchError('Payment link not found or has expired. Please generate a new one from the donation page.');
          setPageState('error');
          return;
        }
        if (data.status === 'paid') {
          setIntent(data);
          setResultIntent(data);
          setPageState('success');
          return;
        }
        if (data.status === 'failed' || data.status === 'expired') {
          setIntent(data);
          setFetchError(`This payment link is ${data.status}. Please try again from the donation page.`);
          setPageState('error');
          return;
        }
        setIntent(data);
        setPageState('form');
      })
      .catch((e: Error) => {
        setFetchError(e.message);
        setPageState('error');
      });
  }, [token]);

  const validate = (): boolean => {
    const errors: FormErrors = {};
    if (method === 'upi') {
      if (!upiId.trim()) errors.upiId = 'UPI ID is required.';
      else if (!validateUpi(upiId)) errors.upiId = 'Invalid UPI ID format (e.g. name@upi).';
    } else {
      const digits = card.cardNumber.replace(/\s/g, '');
      if (digits.length !== 16) errors.cardNumber = 'Enter a valid 16-digit card number.';
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) errors.expiry = 'Enter expiry as MM/YY.';
      if (!/^\d{3}$/.test(card.cvv)) errors.cvv = 'Enter a valid 3-digit CVV.';
      if (!card.cardName.trim()) errors.cardName = 'Cardholder name is required.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePay = async () => {
    if (!token || !intent) return;
    if (!validate()) return;

    setPayError(null);
    setPageState('processing');

    try {
      const result = await confirmPayment({
        token,
        payment_method: method,
        upi_id: method === 'upi' ? upiId : undefined,
      });

      setResultIntent(result.intent);
      setPageState(result.success ? 'success' : 'failure');
    } catch (err) {
      setPayError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
      setPageState('failure');
    }
  };

  const handleRetry = () => {
    setPayError(null);
    setFormErrors({});
    setPageState('form');
  };

  // ── Render: Loading ───────────────────────────────────────────────────────

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <LoadingSpinner size="lg" message="Loading payment details…" />
      </div>
    );
  }

  // ── Render: Error ─────────────────────────────────────────────────────────

  if (pageState === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
        <div className="card p-10 max-w-md w-full text-center flex flex-col items-center gap-6">
          <span className="text-5xl" role="img" aria-label="Error">❌</span>
          <h1 className="font-display text-2xl font-bold">Payment Link Invalid</h1>
          <p className="text-sm text-[var(--color-muted)] leading-relaxed">{fetchError}</p>
          <Link to="/donate" className="primary-button">Back to Donate</Link>
          <Link to="/" className="text-sm text-[var(--color-muted)] underline">Go Home</Link>
        </div>
      </div>
    );
  }

  // ── Render: Processing ────────────────────────────────────────────────────

  if (pageState === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="card p-12 max-w-sm w-full text-center flex flex-col items-center gap-6">
          <LoadingSpinner size="lg" />
          <h2 className="font-display text-xl font-bold">Processing Payment…</h2>
          <p className="text-sm text-[var(--color-muted)]">Please do not close this window.</p>
        </div>
      </div>
    );
  }

  // ── Render: Success ───────────────────────────────────────────────────────

  if (pageState === 'success' && resultIntent) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="card p-10 max-w-md w-full text-center flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <div>
            <h1 className="font-display text-3xl font-bold text-green-700">Payment Successful!</h1>
            <p className="text-sm text-[var(--color-muted)] mt-2">
              Thank you for your generous donation.
            </p>
          </div>

          {/* Receipt */}
          <div className="card-static w-full p-5 text-left flex flex-col gap-2 text-sm">
            <h2 className="font-semibold text-base mb-1">Receipt</h2>
            <div className="flex justify-between">
              <span className="text-[var(--color-muted)]">Project</span>
              <span className="font-medium text-right max-w-[60%]">{resultIntent.project_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-muted)]">Amount</span>
              <span className="font-bold text-[var(--color-primary)]">₹{resultIntent.amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-muted)]">Status</span>
              <span className="text-green-600 font-semibold">Paid ✓</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-muted)]">Token</span>
              <span className="font-mono text-xs truncate max-w-[55%]">{resultIntent.token}</span>
            </div>
          </div>

          <p className="text-xs text-[var(--color-muted)]">
            A tax receipt (80G) will be emailed to you within 24 hours.
          </p>

          <div className="flex flex-col gap-3 w-full">
            <Link to="/projects" className="primary-button w-full text-center">View Projects</Link>
            <Link to="/" className="secondary-button w-full text-center">Go Home</Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // ── Render: Failure ───────────────────────────────────────────────────────

  if (pageState === 'failure') {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="card p-10 max-w-md w-full text-center flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>

          <div>
            <h1 className="font-display text-3xl font-bold text-red-600">Payment Failed</h1>
            <p className="text-sm text-[var(--color-muted)] mt-2">
              {payError ?? 'Your payment could not be processed. Please try again.'}
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button type="button" onClick={handleRetry} className="primary-button w-full">
              Try Again
            </button>
            <Link to="/" className="secondary-button w-full text-center">Go Home</Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // ── Render: Form ──────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-start justify-center py-24 px-4">
      <div className="w-full max-w-lg">
        {/* Header: logo + secure badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-display font-bold text-[var(--color-primary)]">{NGO.name}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Secure Payment
          </div>
        </div>

        <div className="card p-0 overflow-hidden">
          {/* Order summary */}
          <div className="bg-[var(--color-secondary)] p-6 border-b border-[var(--color-border)]">
            <h2 className="font-display text-lg font-bold mb-3">Order Summary</h2>
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Project</span>
                <span className="font-medium text-right max-w-[65%]">{intent?.project_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Amount</span>
                <span className="font-bold text-lg text-[var(--color-primary)]">
                  ₹{intent?.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1.5">
              ⚠️ Demo payment — no real money will be charged.
            </p>
          </div>

          <div className="p-6 flex flex-col gap-6">
            {/* Payment method tabs */}
            <div>
              <p className="text-sm font-semibold mb-3">Payment Method</p>
              <div className="flex gap-2" role="tablist" aria-label="Payment method">
                {(['upi', 'card'] as PaymentMethod[]).map((m) => (
                  <button
                    key={m}
                    role="tab"
                    aria-selected={method === m}
                    onClick={() => { setMethod(m); setFormErrors({}); }}
                    className={[
                      'flex-1 py-2.5 text-sm font-semibold rounded-[var(--radius)] border transition-all duration-200',
                      method === m
                        ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                        : 'bg-transparent text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-primary)]',
                    ].join(' ')}
                  >
                    {m === 'upi' ? '📱 UPI' : '💳 Card'}
                  </button>
                ))}
              </div>
            </div>

            {/* UPI fields */}
            <AnimatePresence mode="wait">
              {method === 'upi' && (
                <motion.div
                  key="upi"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-2"
                >
                  <label htmlFor="upi_id" className="text-sm font-medium">
                    UPI ID <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="upi_id"
                    type="text"
                    value={upiId}
                    onChange={(e) => { setUpiId(e.target.value); setFormErrors((prev) => ({ ...prev, upiId: undefined })); }}
                    placeholder="yourname@upi"
                    aria-describedby={formErrors.upiId ? 'upi-error' : undefined}
                    className={[
                      'w-full px-3 py-2.5 rounded-[var(--radius)] border bg-[var(--color-bg)] text-sm',
                      'focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2',
                      formErrors.upiId ? 'border-red-400' : 'border-[var(--color-border)]',
                    ].join(' ')}
                  />
                  {formErrors.upiId && (
                    <p id="upi-error" className="text-xs text-red-500" role="alert">{formErrors.upiId}</p>
                  )}
                  <p className="text-xs text-[var(--color-muted)]">Format: yourname@bankname (e.g. rajan@okaxis)</p>
                </motion.div>
              )}

              {method === 'card' && (
                <motion.div
                  key="card"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-4"
                >
                  {/* Card number */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="card_number" className="text-sm font-medium">Card Number</label>
                    <input
                      id="card_number"
                      type="text"
                      value={card.cardNumber}
                      onChange={(e) => setCard((prev) => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      inputMode="numeric"
                      aria-describedby={formErrors.cardNumber ? 'card-num-error' : undefined}
                      className={[
                        'w-full px-3 py-2.5 rounded-[var(--radius)] border bg-[var(--color-bg)] text-sm font-mono',
                        'focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2',
                        formErrors.cardNumber ? 'border-red-400' : 'border-[var(--color-border)]',
                      ].join(' ')}
                    />
                    {formErrors.cardNumber && (
                      <p id="card-num-error" className="text-xs text-red-500" role="alert">{formErrors.cardNumber}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Expiry */}
                    <div className="flex flex-col gap-1">
                      <label htmlFor="expiry" className="text-sm font-medium">Expiry (MM/YY)</label>
                      <input
                        id="expiry"
                        type="text"
                        value={card.expiry}
                        onChange={(e) => setCard((prev) => ({ ...prev, expiry: formatExpiry(e.target.value) }))}
                        placeholder="MM/YY"
                        maxLength={5}
                        inputMode="numeric"
                        aria-describedby={formErrors.expiry ? 'expiry-error' : undefined}
                        className={[
                          'w-full px-3 py-2.5 rounded-[var(--radius)] border bg-[var(--color-bg)] text-sm font-mono',
                          'focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2',
                          formErrors.expiry ? 'border-red-400' : 'border-[var(--color-border)]',
                        ].join(' ')}
                      />
                      {formErrors.expiry && (
                        <p id="expiry-error" className="text-xs text-red-500" role="alert">{formErrors.expiry}</p>
                      )}
                    </div>

                    {/* CVV */}
                    <div className="flex flex-col gap-1">
                      <label htmlFor="cvv" className="text-sm font-medium">CVV</label>
                      <input
                        id="cvv"
                        type="password"
                        value={card.cvv}
                        onChange={(e) => setCard((prev) => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
                        placeholder="•••"
                        maxLength={3}
                        inputMode="numeric"
                        aria-describedby={formErrors.cvv ? 'cvv-error' : undefined}
                        className={[
                          'w-full px-3 py-2.5 rounded-[var(--radius)] border bg-[var(--color-bg)] text-sm font-mono',
                          'focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2',
                          formErrors.cvv ? 'border-red-400' : 'border-[var(--color-border)]',
                        ].join(' ')}
                      />
                      {formErrors.cvv && (
                        <p id="cvv-error" className="text-xs text-red-500" role="alert">{formErrors.cvv}</p>
                      )}
                    </div>
                  </div>

                  {/* Cardholder name */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="card_name" className="text-sm font-medium">Name on Card</label>
                    <input
                      id="card_name"
                      type="text"
                      value={card.cardName}
                      onChange={(e) => setCard((prev) => ({ ...prev, cardName: e.target.value }))}
                      placeholder="Full name as on card"
                      autoComplete="cc-name"
                      aria-describedby={formErrors.cardName ? 'card-name-error' : undefined}
                      className={[
                        'w-full px-3 py-2.5 rounded-[var(--radius)] border bg-[var(--color-bg)] text-sm',
                        'focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2',
                        formErrors.cardName ? 'border-red-400' : 'border-[var(--color-border)]',
                      ].join(' ')}
                    />
                    {formErrors.cardName && (
                      <p id="card-name-error" className="text-xs text-red-500" role="alert">{formErrors.cardName}</p>
                    )}
                  </div>

                  <p className="text-xs text-[var(--color-muted)] bg-amber-50 border border-amber-200 rounded px-3 py-2">
                    🔒 This is a demo — no card data is stored or transmitted.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pay button */}
            <button
              type="button"
              onClick={handlePay}
              className="primary-button primary-button-lg w-full"
              aria-label={`Pay ₹${intent?.amount.toLocaleString('en-IN')} now`}
            >
              Pay ₹{intent?.amount.toLocaleString('en-IN')}
            </button>

            <p className="text-xs text-center text-[var(--color-muted)] flex items-center justify-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Payments are simulated · No real money is charged
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
