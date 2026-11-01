/* ─────────────────────────────────────────────────────────────────────────────
   Donate Page — Aadhara Foundation
   Route: /donate
   Choose project, amount (quick-pick + custom), donor details,
   "Generate QR" button, and a clearly marked slot where the QR code renders.
   The QR opens /pay/:token (mock payment gateway).
   ───────────────────────────────────────────────────────────────────────────── */

import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import {
  ScrollReveal,
  TextAnimation,
  LoadingSpinner,
  OptimizedImage,
  ButtonMagnetic,
} from '../components';
import { getProjects, createPaymentIntent } from '../api';
import type { Project } from '../api';

// ─── Quick-pick amounts ───────────────────────────────────────────────────────

const QUICK_AMOUNTS = [500, 1000, 2500, 5000];

// ─── Form validation ──────────────────────────────────────────────────────────

interface FormErrors {
  donor_name?: string;
  email?: string;
  phone?: string;
  amount?: string;
  project_id?: string;
}

function validateForm(fields: {
  donor_name: string;
  email: string;
  phone: string;
  amount: string;
  project_id: string;
}): FormErrors {
  const errors: FormErrors = {};

  if (!fields.donor_name.trim()) errors.donor_name = 'Full name is required.';
  if (!fields.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!fields.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!/^\+?[\d\s\-()]{7,15}$/.test(fields.phone)) {
    errors.phone = 'Please enter a valid phone number.';
  }
  if (!fields.amount) {
    errors.amount = 'Please select or enter an amount.';
  } else if (Number(fields.amount) < 100) {
    errors.amount = 'Minimum donation is ₹100.';
  }
  if (!fields.project_id) errors.project_id = 'Please select a project.';

  return errors;
}

// ─── Dynamic QR SVG Generator ────────────────────────────────────────────────

function MockQRCode({ url }: { url: string }) {
  // Deterministic pattern generator based on URL string
  const hash = url.split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 1000000, 7);

  return (
    <div className="relative p-4 bg-white rounded-xl shadow-inner border border-stone-200">
      <svg
        width="180"
        height="180"
        viewBox="0 0 29 29"
        className="w-44 h-44 mx-auto"
        shapeRendering="crispEdges"
        aria-label={`QR code for payment at ${url}`}
        role="img"
      >
        {/* Background */}
        <rect width="29" height="29" fill="#ffffff" />

        {/* Position Detection Patterns (Top-Left, Top-Right, Bottom-Left) */}
        {/* Top-Left */}
        <rect x="2" y="2" width="7" height="7" fill="#1c1c1c" />
        <rect x="3" y="3" width="5" height="5" fill="#ffffff" />
        <rect x="4" y="4" width="3" height="3" fill="#1c1c1c" />

        {/* Top-Right */}
        <rect x="20" y="2" width="7" height="7" fill="#1c1c1c" />
        <rect x="21" y="3" width="5" height="5" fill="#ffffff" />
        <rect x="22" y="4" width="3" height="3" fill="#1c1c1c" />

        {/* Bottom-Left */}
        <rect x="2" y="20" width="7" height="7" fill="#1c1c1c" />
        <rect x="3" y="21" width="5" height="5" fill="#ffffff" />
        <rect x="4" y="22" width="3" height="3" fill="#1c1c1c" />

        {/* Timing Patterns */}
        <g fill="#1c1c1c">
          <rect x="10" y="5" width="1" height="1" />
          <rect x="12" y="5" width="1" height="1" />
          <rect x="14" y="5" width="1" height="1" />
          <rect x="16" y="5" width="1" height="1" />
          <rect x="18" y="5" width="1" height="1" />

          <rect x="5" y="10" width="1" height="1" />
          <rect x="5" y="12" width="1" height="1" />
          <rect x="5" y="14" width="1" height="1" />
          <rect x="5" y="16" width="1" height="1" />
          <rect x="5" y="18" width="1" height="1" />
        </g>

        {/* Stylized Data Cells based on hash */}
        <g fill="#2d5a27">
          {Array.from({ length: 48 }).map((_, i) => {
            const x = 10 + ((i * 7 + (hash % 13)) % 17);
            const y = 8 + ((i * 11 + (hash % 19)) % 19);
            // Don't collide with corner markers
            if ((x < 10 && y < 10) || (x > 18 && y < 10) || (x < 10 && y > 18)) return null;
            return <rect key={i} x={x} y={y} width="1" height="1" />;
          })}
        </g>
      </svg>
      <div className="absolute inset-0 border border-green-600/10 pointer-events-none rounded-xl" />
    </div>
  );
}

// ─── Donate Page ─────────────────────────────────────────────────────────────

export default function Donate() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const blobY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

  const [searchParams] = useSearchParams();
  const preselectedProjectId = searchParams.get('project') ?? '';

  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Form State (Field names matching MySQL schema)
  const [donor_name, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [project_id, setProjectId] = useState(preselectedProjectId);
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom'>(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Generated QR Token
  const [token, setToken] = useState<string | null>(null);

  const selectedProject = projects.find((p) => p.project_id === Number(project_id)) ?? projects[0];
  const amount = selectedAmount === 'custom' ? customAmount : selectedAmount?.toString() ?? '';

  useEffect(() => {
    getProjects()
      .then((data) => {
        setProjects(data);
        if (!project_id && data.length > 0) {
          setProjectId(data[0].project_id.toString());
        }
      })
      .catch((e: Error) => setSubmitError(e.message))
      .finally(() => setLoadingProjects(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentFields = {
      donor_name,
      email,
      phone,
      amount,
      project_id: project_id || (projects[0] ? projects[0].project_id.toString() : ''),
    };

    const validationErrors = validateForm(currentFields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const intent = await createPaymentIntent({
        donor_name: currentFields.donor_name,
        email: currentFields.email,
        phone: currentFields.phone,
        project_id: Number(currentFields.project_id),
        amount: Number(currentFields.amount),
      });

      setToken(intent.token);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create payment intent');
    } finally {
      setSubmitting(false);
    }
  };

  const paymentUrl = token ? `${window.location.origin}/pay/${token}` : '';

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[50vh] flex items-center overflow-hidden pt-32 pb-12"
        aria-label="Donate hero"
      >
        <div className="aurora-bg" aria-hidden="true">
          <motion.div className="aurora-blob aurora-blob-1" style={{ y: blobY }} />
          <div className="aurora-blob aurora-blob-2" />
        </div>
        <div className="section-wrapper relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="section-label mb-3"
          >
            Direct Community Contribution
          </motion.div>
          <TextAnimation
            text="Make a Difference Today"
            tag="h1"
            variant="slide-up"
            gradientText
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold max-w-2xl leading-tight"
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-4 text-base md:text-lg text-[var(--color-muted)] max-w-xl"
          >
            Choose a verified initiative, specify your gift, and generate an instant payment QR code. 100% of your funds are logged to our transparent DBMS audit trail.
          </motion.p>
        </div>
      </section>

      {/* ── Main Donation Form & Slot ───────────────────────────────────────── */}
      <section aria-label="Donation form and QR generator" className="py-12 pb-24 bg-[var(--color-bg)]">
        <div className="section-wrapper">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Donation Form or QR Slot (7 cols) */}
            <div className="lg:col-span-7">
              <ScrollReveal>
                {token ? (
                  /* ── Clearly Marked QR Slot ── */
                  <div
                    className="card p-8 md:p-10 flex flex-col items-center gap-6 text-center border-2 border-[var(--color-primary)] bg-[var(--color-card)] shadow-xl relative overflow-hidden"
                    role="region"
                    aria-label="Payment QR code and gateway link"
                  >
                    <div className="w-14 h-14 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-2xl shadow-sm">
                      📱
                    </div>

                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)] px-3 py-1 rounded-full">
                        Clearly Marked QR Slot
                      </span>
                      <h2 className="font-display text-2xl md:text-3xl font-bold mt-3 text-[var(--color-fg)]">
                        Scan Payment QR Code
                      </h2>
                      <p className="text-sm text-[var(--color-muted)] mt-1 max-w-md mx-auto">
                        Your payment intent for <strong className="text-[var(--color-fg)]">₹{Number(amount).toLocaleString('en-IN')}</strong> is active and locked with token <code className="text-xs bg-stone-100 px-1 py-0.5 rounded font-mono text-[var(--color-primary)]">{token.slice(0, 12)}…</code>
                      </p>
                    </div>

                    {/* QR Display Container */}
                    <div className="p-4 border-2 border-dashed border-[var(--color-primary)] rounded-[var(--radius-lg)] bg-[color-mix(in_srgb,var(--color-primary)_3%,transparent)] shadow-sm">
                      <MockQRCode url={paymentUrl} />
                      <p className="text-xs font-mono text-[var(--color-muted)] mt-3">
                        UPI Payee: aadhara.foundation@bank
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 w-full max-w-sm">
                      <ButtonMagnetic>
                        <Link
                          to={`/pay/${token}`}
                          className="primary-button primary-button-lg w-full text-center flex items-center justify-center gap-2"
                          aria-label="Open mock payment gateway"
                        >
                          <span>Open Mock Payment Gateway</span>
                          <span aria-hidden="true">→</span>
                        </Link>
                      </ButtonMagnetic>

                      <button
                        type="button"
                        onClick={() => {
                          setToken(null);
                        }}
                        className="text-xs text-[var(--color-muted)] hover:text-[var(--color-fg)] underline transition-colors py-1 cursor-pointer"
                      >
                        Modify Details / Generate Another QR
                      </button>
                    </div>

                    <div className="text-xs text-stone-500 bg-stone-50 border border-stone-200 rounded-lg p-3 w-full max-w-md">
                      ⚠️ <strong>Demo payment, no real money:</strong> Scanning this QR or clicking the button directs to the simulated gateway at <code>/pay/{token}</code>.
                    </div>
                  </div>
                ) : (
                  /* ── Donation Form ── */
                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="card p-8 md:p-10 flex flex-col gap-6 shadow-md"
                    aria-label="Donation form"
                  >
                    <div className="border-b border-[var(--color-border)] pb-4">
                      <h2 className="font-display text-2xl font-bold text-[var(--color-fg)]">
                        Your Contribution Details
                      </h2>
                      <p className="text-xs text-[var(--color-muted)] mt-1">
                        Select a field initiative, contribution tier, and receipt information.
                      </p>
                    </div>

                    {/* Project Selector */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="project_id" className="text-sm font-semibold text-[var(--color-fg)]">
                        Select Project <span className="text-red-500" aria-hidden="true">*</span>
                      </label>
                      {loadingProjects ? (
                        <div className="flex items-center gap-2 text-sm text-[var(--color-muted)] p-2.5">
                          <LoadingSpinner size="sm" /> Loading projects…
                        </div>
                      ) : (
                        <select
                          id="project_id"
                          name="project_id"
                          value={project_id}
                          onChange={(e) => {
                            setProjectId(e.target.value);
                            setErrors((prev) => ({ ...prev, project_id: undefined }));
                          }}
                          required
                          className={[
                            'w-full px-3.5 py-2.5 rounded-[var(--radius)] border bg-[var(--color-bg)] text-sm font-medium',
                            'focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2',
                            errors.project_id ? 'border-red-400' : 'border-[var(--color-border)]',
                          ].join(' ')}
                        >
                          {projects.map((p) => (
                            <option key={p.project_id} value={p.project_id}>
                              {p.project_name} ({p.category})
                            </option>
                          ))}
                        </select>
                      )}
                      {errors.project_id && (
                        <p className="text-xs text-red-500" role="alert">{errors.project_id}</p>
                      )}
                    </div>

                    {/* Amount Selector */}
                    <fieldset className="flex flex-col gap-2.5">
                      <legend className="text-sm font-semibold text-[var(--color-fg)]">
                        Contribution Amount (INR) <span className="text-red-500" aria-hidden="true">*</span>
                      </legend>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {QUICK_AMOUNTS.map((amt) => {
                          const isSelected = selectedAmount === amt;
                          return (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => {
                                setSelectedAmount(amt);
                                setErrors((prev) => ({ ...prev, amount: undefined }));
                              }}
                              className={[
                                'py-2.5 px-3 rounded-[var(--radius)] text-sm font-bold border transition-all duration-200 cursor-pointer',
                                isSelected
                                  ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm'
                                  : 'bg-[var(--color-card)] text-[var(--color-fg)] border-[var(--color-border)] hover:border-[var(--color-primary)]',
                              ].join(' ')}
                            >
                              ₹{amt.toLocaleString('en-IN')}
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={() => setSelectedAmount('custom')}
                          className={[
                            'text-xs font-semibold px-3 py-1.5 rounded-full border mb-2 cursor-pointer transition-colors',
                            selectedAmount === 'custom'
                              ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                              : 'bg-transparent text-[var(--color-muted)] border-[var(--color-border)]',
                          ].join(' ')}
                        >
                          Or enter custom amount
                        </button>

                        {selectedAmount === 'custom' && (
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--color-muted)]">
                              ₹
                            </span>
                            <input
                              type="number"
                              id="amount"
                              name="amount"
                              value={customAmount}
                              onChange={(e) => {
                                setCustomAmount(e.target.value);
                                setErrors((prev) => ({ ...prev, amount: undefined }));
                              }}
                              min={100}
                              placeholder="Enter amount (min ₹100)"
                              className={[
                                'w-full pl-8 pr-3.5 py-2.5 rounded-[var(--radius)] border bg-[var(--color-bg)] text-sm font-bold',
                                'focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2',
                                errors.amount ? 'border-red-400' : 'border-[var(--color-border)]',
                              ].join(' ')}
                            />
                          </div>
                        )}
                      </div>

                      {errors.amount && (
                        <p className="text-xs text-red-500" role="alert">{errors.amount}</p>
                      )}
                    </fieldset>

                    {/* Donor Details */}
                    <div className="flex flex-col gap-4 pt-2 border-t border-[var(--color-border)]">
                      <h3 className="text-sm font-semibold text-[var(--color-fg)]">
                        Donor & 80G Receipt Details
                      </h3>

                      <div className="flex flex-col gap-1">
                        <label htmlFor="donor_name" className="text-xs font-semibold text-[var(--color-fg)]">
                          Full Name <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                          id="donor_name"
                          name="donor_name"
                          type="text"
                          value={donor_name}
                          onChange={(e) => {
                            setDonorName(e.target.value);
                            setErrors((prev) => ({ ...prev, donor_name: undefined }));
                          }}
                          required
                          placeholder="e.g. Ramesh Kumar"
                          className={[
                            'w-full px-3.5 py-2.5 rounded-[var(--radius)] border bg-[var(--color-bg)] text-sm',
                            errors.donor_name ? 'border-red-400' : 'border-[var(--color-border)]',
                          ].join(' ')}
                        />
                        {errors.donor_name && (
                          <p className="text-xs text-red-500" role="alert">{errors.donor_name}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label htmlFor="email" className="text-xs font-semibold text-[var(--color-fg)]">
                            Email <span className="text-red-500" aria-hidden="true">*</span>
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setErrors((prev) => ({ ...prev, email: undefined }));
                            }}
                            required
                            placeholder="you@domain.com"
                            className={[
                              'w-full px-3.5 py-2.5 rounded-[var(--radius)] border bg-[var(--color-bg)] text-sm',
                              errors.email ? 'border-red-400' : 'border-[var(--color-border)]',
                            ].join(' ')}
                          />
                          {errors.email && (
                            <p className="text-xs text-red-500" role="alert">{errors.email}</p>
                          )}
                        </div>

                        <div className="flex flex-col gap-1">
                          <label htmlFor="phone" className="text-xs font-semibold text-[var(--color-fg)]">
                            Phone <span className="text-red-500" aria-hidden="true">*</span>
                          </label>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value);
                              setErrors((prev) => ({ ...prev, phone: undefined }));
                            }}
                            required
                            placeholder="+91 98765 43210"
                            className={[
                              'w-full px-3.5 py-2.5 rounded-[var(--radius)] border bg-[var(--color-bg)] text-sm',
                              errors.phone ? 'border-red-400' : 'border-[var(--color-border)]',
                            ].join(' ')}
                          />
                          {errors.phone && (
                            <p className="text-xs text-red-500" role="alert">{errors.phone}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {submitError && (
                      <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded p-2.5" role="alert">
                        {submitError}
                      </p>
                    )}

                    <ButtonMagnetic>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="primary-button primary-button-lg w-full flex items-center justify-center gap-2 cursor-pointer"
                        aria-label="Generate payment QR code"
                      >
                        {submitting ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Creating Intent…
                          </>
                        ) : (
                          <>📱 Generate Payment QR</>
                        )}
                      </button>
                    </ButtonMagnetic>
                  </form>
                )}
              </ScrollReveal>
            </div>

            {/* Right: Selected Project Preview (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {selectedProject && (
                <ScrollReveal delay={0.1}>
                  <div className="card p-6 flex flex-col gap-4 shadow-sm border border-[var(--color-border)]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                      Designated Initiative
                    </span>
                    <div className="relative h-44 rounded-[var(--radius)] overflow-hidden">
                      <OptimizedImage
                        imageKey={selectedProject.image_slot}
                        className="w-full h-full object-cover"
                        containerClassName="w-full h-full"
                        fallbackAlt={selectedProject.project_name}
                      />
                      <span className="absolute top-2.5 left-2.5 text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/95 text-[var(--color-primary)]">
                        {selectedProject.category}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-lg text-[var(--color-fg)]">
                        {selectedProject.project_name}
                      </h3>
                      <p className="text-xs text-[var(--color-muted)] mt-0.5">
                        📍 {selectedProject.location}
                      </p>
                      <p className="text-xs text-[var(--color-muted)] leading-relaxed mt-2 line-clamp-3">
                        {selectedProject.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[var(--color-border)] space-y-2">
                      <div className="flex justify-between text-xs text-[var(--color-muted)] font-medium">
                        <span>Raised: ₹{(selectedProject.raised / 100000).toFixed(1)}L</span>
                        <span className="font-bold text-[var(--color-primary)]">
                          {selectedProject.percent_funded}% funded
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${selectedProject.percent_funded}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Tax & Auditing Card */}
              <ScrollReveal delay={0.2}>
                <div className="card p-6 flex flex-col gap-3 shadow-sm bg-[var(--color-secondary)] border border-[var(--color-border)]">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📜</span>
                    <h4 className="font-display font-bold text-base text-[var(--color-fg)]">
                      Section 80G Tax Exemption
                    </h4>
                  </div>
                  <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                    Under Indian Income Tax Act regulations, 50% of your gift is eligible for deduction. An official gapless receipt is issued immediately upon transaction confirmation.
                  </p>
                  <div className="text-[11px] text-[var(--color-primary)] font-semibold pt-2 border-t border-[var(--color-border)]">
                    Registration No: DIT(E)/2009/RA/JAIPUR/258
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
