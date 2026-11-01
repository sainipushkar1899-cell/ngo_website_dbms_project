/* ─────────────────────────────────────────────────────────────────────────────
   Step3Details.tsx — Donor Details
   Field name attributes match MySQL schema: donor_name, email, phone.
   Accessible validation, Indian mobile number (+91 support), inputmode, autocomplete.
   ───────────────────────────────────────────────────────────────────────────── */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Step3DetailsProps {
  initialDetails: {
    donor_name: string;
    email: string;
    phone: string;
  };
  onSubmitDetails: (details: {
    donor_name: string;
    email: string;
    phone: string;
  }) => void;
  onBack: () => void;
}

interface FormErrors {
  donor_name?: string;
  email?: string;
  phone?: string;
}

export function Step3Details({
  initialDetails,
  onSubmitDetails,
  onBack,
}: Step3DetailsProps) {
  const [donor_name, setDonorName] = useState(initialDetails.donor_name || "");
  const [email, setEmail] = useState(initialDetails.email || "");
  const [phone, setPhone] = useState(initialDetails.phone || "");

  const [touched, setTouched] = useState<{ [K in keyof FormErrors]?: boolean }>({});
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (fields: {
    donor_name: string;
    email: string;
    phone: string;
  }): FormErrors => {
    const errs: FormErrors = {};

    // donor_name
    if (!fields.donor_name.trim()) {
      errs.donor_name = "Full name is required.";
    } else if (fields.donor_name.trim().length < 2) {
      errs.donor_name = "Please enter your full legal name.";
    }

    // email
    if (!fields.email.trim()) {
      errs.email = "Email address is required for 80G tax receipt delivery.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
      errs.email = "Please enter a valid email address (e.g., name@example.com).";
    }

    // phone: Indian 10-digit mobile number with optional +91 prefix
    // accepts: +91 9876543210, +91-9876543210, +919876543210, 9876543210
    const cleanPhone = fields.phone.replace(/[\s\-()]/g, "");
    if (!fields.phone.trim()) {
      errs.phone = "Mobile number is required.";
    } else if (!/^(\+?91)?[6-9]\d{9}$/.test(cleanPhone)) {
      errs.phone = "Please enter a valid 10-digit Indian mobile number (e.g. 98765 43210).";
    }

    return errs;
  };

  const handleChange = (
    field: "donor_name" | "email" | "phone",
    value: string
  ) => {
    const updated = {
      donor_name: field === "donor_name" ? value : donor_name,
      email: field === "email" ? value : email,
      phone: field === "phone" ? value : phone,
    };

    if (field === "donor_name") setDonorName(value);
    if (field === "email") setEmail(value);
    if (field === "phone") setPhone(value);

    if (touched[field]) {
      const errs = validate(updated);
      setErrors(errs);
    }
  };

  const handleBlur = (field: keyof FormErrors) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validate({ donor_name, email, phone });
    setErrors(errs);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ donor_name: true, email: true, phone: true });
    const errs = validate({ donor_name, email, phone });
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      onSubmitDetails({
        donor_name: donor_name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6 max-w-xl mx-auto">
      {/* Step Header */}
      <div className="text-center">
        <span className="section-label">Step 3 of 5</span>
        <h2 className="text-2xl md:text-3xl font-serif text-[var(--color-fg)] mt-1 mb-2">
          Your Donor Information
        </h2>
        <p className="text-sm text-[var(--color-muted)]">
          Required for official 80G tax receipt generation and audit compliance.
          No marketing spam, ever.
        </p>
      </div>

      {/* Field: donor_name */}
      <div>
        <label
          htmlFor="donor_name"
          className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-fg)] mb-2"
        >
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="donor_name"
          name="donor_name"
          type="text"
          autoComplete="name"
          required
          placeholder="e.g. Ramesh Chandra Verma"
          value={donor_name}
          onChange={(e) => handleChange("donor_name", e.target.value)}
          onBlur={() => handleBlur("donor_name")}
          aria-invalid={touched.donor_name && !!errors.donor_name}
          aria-describedby={errors.donor_name ? "donor_name-error" : undefined}
          className={`w-full px-4 py-3.5 rounded-xl border-2 bg-white text-stone-900 font-medium text-base focus:outline-none transition-colors ${
            touched.donor_name && errors.donor_name
              ? "border-red-400 focus:border-red-500 bg-red-50/20"
              : "border-[var(--color-border)] focus:border-[var(--color-primary)]"
          }`}
        />
        <AnimatePresence mode="wait">
          {touched.donor_name && errors.donor_name && (
            <motion.p
              id="donor_name-error"
              role="alert"
              aria-live="polite"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1"
            >
              <span>⚠️</span>
              <span>{errors.donor_name}</span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Field: email */}
      <div>
        <label
          htmlFor="email"
          className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-fg)] mb-2"
        >
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="e.g. ramesh.verma@example.com"
          value={email}
          onChange={(e) => handleChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          aria-invalid={touched.email && !!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={`w-full px-4 py-3.5 rounded-xl border-2 bg-white text-stone-900 font-medium text-base focus:outline-none transition-colors ${
            touched.email && errors.email
              ? "border-red-400 focus:border-red-500 bg-red-50/20"
              : "border-[var(--color-border)] focus:border-[var(--color-primary)]"
          }`}
        />
        <AnimatePresence mode="wait">
          {touched.email && errors.email && (
            <motion.p
              id="email-error"
              role="alert"
              aria-live="polite"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1"
            >
              <span>⚠️</span>
              <span>{errors.email}</span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Field: phone */}
      <div>
        <label
          htmlFor="phone"
          className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-fg)] mb-2"
        >
          Phone Number (10-digit Indian Mobile) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="e.g. 98765 43210 or +91 9876543210"
            value={phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            onBlur={() => handleBlur("phone")}
            aria-invalid={touched.phone && !!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className={`w-full px-4 py-3.5 rounded-xl border-2 bg-white text-stone-900 font-medium text-base focus:outline-none transition-colors ${
              touched.phone && errors.phone
                ? "border-red-400 focus:border-red-500 bg-red-50/20"
                : "border-[var(--color-border)] focus:border-[var(--color-primary)]"
            }`}
          />
        </div>
        <AnimatePresence mode="wait">
          {touched.phone && errors.phone && (
            <motion.p
              id="phone-error"
              role="alert"
              aria-live="polite"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1"
            >
              <span>⚠️</span>
              <span>{errors.phone}</span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Privacy note */}
      <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-start gap-2.5">
        <span className="text-base select-none" aria-hidden="true">🔒</span>
        <span>
          <strong>Data Privacy:</strong> Under DBMS Auditor access controls, donor contact info is masked. We never share or sell personal information.
        </span>
      </div>

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
          type="submit"
          className="px-8 py-3.5 rounded-full font-medium text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2 bg-[var(--color-primary)] text-white hover:opacity-95"
        >
          <span>Review Donation</span>
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
    </form>
  );
}

export default Step3Details;
