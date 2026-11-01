/* ─────────────────────────────────────────────────────────────────────────────
   Contact Page — Aadhara Foundation
   ───────────────────────────────────────────────────────────────────────────── */

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ScrollReveal, TextAnimation } from '../components';
import { NGO } from '../config/ngo';

// ─── Form validation ──────────────────────────────────────────────────────────

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

function validateContact(form: ContactForm): ContactErrors {
  const errors: ContactErrors = {};
  if (!form.name.trim()) errors.name = 'Name is required.';
  if (!form.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!form.subject.trim()) errors.subject = 'Subject is required.';
  if (!form.message.trim()) errors.message = 'Message is required.';
  else if (form.message.trim().length < 20) errors.message = 'Message must be at least 20 characters.';
  return errors;
}

// ─── Social icon components ───────────────────────────────────────────────────

function SocialLinks() {
  const links = [
    { label: 'Twitter', url: NGO.social.twitter, icon: '𝕏' },
    { label: 'Instagram', url: NGO.social.instagram, icon: '📸' },
    { label: 'Facebook', url: NGO.social.facebook, icon: '🔵' },
    { label: 'LinkedIn', url: NGO.social.linkedin, icon: '💼' },
    { label: 'YouTube', url: NGO.social.youtube, icon: '▶️' },
  ];

  return (
    <div className="flex flex-wrap gap-3" aria-label="Social media links">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Follow us on ${link.label}`}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-border)] text-sm hover:border-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_5%,transparent)] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2"
        >
          <span aria-hidden="true">{link.icon}</span>
          {link.label}
        </a>
      ))}
    </div>
  );
}

// ─── Contact Page ─────────────────────────────────────────────────────────────

export default function Contact() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const blobY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

  const [form, setForm] = useState<ContactForm>({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof ContactForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateContact(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[55vh] flex items-center overflow-hidden"
        aria-label="Contact hero"
      >
        <div className="aurora-bg" aria-hidden="true">
          <motion.div className="aurora-blob aurora-blob-1" style={{ y: blobY }} />
          <div className="aurora-blob aurora-blob-2" />
        </div>
        <div className="section-wrapper relative z-10 pt-32 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="section-label mb-4"
          >
            Reach Us
          </motion.div>
          <TextAnimation
            text="Get in Touch"
            tag="h1"
            variant="slide-up"
            gradientText
            className="font-display text-6xl md:text-8xl font-bold"
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-lg text-[var(--color-muted)] max-w-2xl"
          >
            Have a question, want to partner with us, or looking to volunteer? We'd love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* ── Contact split layout ──────────────────────────────────────────── */}
      <section aria-label="Contact form and information" className="py-20">
        <div className="section-wrapper">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* ── Left: Contact Form ────────────────────────────────────── */}
            <ScrollReveal>
              {submitted ? (
                <div className="card p-10 flex flex-col items-center gap-4 text-center">
                  <span className="text-5xl" role="img" aria-label="Message sent">✉️</span>
                  <h2 className="font-display text-2xl font-bold">Message Sent!</h2>
                  <p className="text-sm text-[var(--color-muted)]">
                    Thank you for reaching out. Our team will get back to you within 2 business days.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                    className="secondary-button"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  aria-label="Contact form"
                  className="card p-8 flex flex-col gap-5"
                >
                  <h2 className="font-display text-2xl font-bold">Send a Message</h2>

                  {/* Name */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="contact_name" className="text-sm font-medium">
                      Name <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="contact_name"
                      type="text"
                      value={form.name}
                      onChange={handleChange('name')}
                      required
                      aria-required="true"
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      placeholder="Your full name"
                      autoComplete="name"
                      className={[
                        'w-full px-3 py-2.5 rounded-[var(--radius)] border bg-[var(--color-bg)] text-sm',
                        'focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2',
                        errors.name ? 'border-red-400' : 'border-[var(--color-border)]',
                      ].join(' ')}
                    />
                    {errors.name && <p id="name-error" className="text-xs text-red-500" role="alert">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="contact_email" className="text-sm font-medium">
                      Email <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="contact_email"
                      type="email"
                      value={form.email}
                      onChange={handleChange('email')}
                      required
                      aria-required="true"
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className={[
                        'w-full px-3 py-2.5 rounded-[var(--radius)] border bg-[var(--color-bg)] text-sm',
                        'focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2',
                        errors.email ? 'border-red-400' : 'border-[var(--color-border)]',
                      ].join(' ')}
                    />
                    {errors.email && <p id="contact-email-error" className="text-xs text-red-500" role="alert">{errors.email}</p>}
                  </div>

                  {/* Subject */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="contact_subject" className="text-sm font-medium">
                      Subject <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="contact_subject"
                      type="text"
                      value={form.subject}
                      onChange={handleChange('subject')}
                      required
                      aria-required="true"
                      aria-describedby={errors.subject ? 'subject-error' : undefined}
                      placeholder="What is this about?"
                      className={[
                        'w-full px-3 py-2.5 rounded-[var(--radius)] border bg-[var(--color-bg)] text-sm',
                        'focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2',
                        errors.subject ? 'border-red-400' : 'border-[var(--color-border)]',
                      ].join(' ')}
                    />
                    {errors.subject && <p id="subject-error" className="text-xs text-red-500" role="alert">{errors.subject}</p>}
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="contact_message" className="text-sm font-medium">
                      Message <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="contact_message"
                      value={form.message}
                      onChange={handleChange('message')}
                      required
                      aria-required="true"
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      rows={5}
                      placeholder="Tell us more…"
                      className={[
                        'w-full px-3 py-2.5 rounded-[var(--radius)] border bg-[var(--color-bg)] text-sm resize-y',
                        'focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2',
                        errors.message ? 'border-red-400' : 'border-[var(--color-border)]',
                      ].join(' ')}
                    />
                    {errors.message && <p id="message-error" className="text-xs text-red-500" role="alert">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    aria-disabled={submitting}
                    className="primary-button primary-button-lg w-full flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                        Sending…
                      </>
                    ) : 'Send Message'}
                  </button>
                </form>
              )}
            </ScrollReveal>

            {/* ── Right: Contact Info ───────────────────────────────────── */}
            <div className="flex flex-col gap-6">
              <ScrollReveal delay={0.1}>
                <h2 className="font-display text-2xl font-bold mb-4">Contact Information</h2>

                <div className="flex flex-col gap-4">
                  {/* Address */}
                  <div className="card p-5 flex gap-4 items-start">
                    <span className="text-2xl flex-shrink-0" role="img" aria-label="Address">📍</span>
                    <div>
                      <h3 className="font-semibold text-sm mb-1">Office Address</h3>
                      <p className="text-sm text-[var(--color-muted)]">{NGO.contact.address}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="card p-5 flex gap-4 items-start">
                    <span className="text-2xl flex-shrink-0" role="img" aria-label="Email">✉️</span>
                    <div>
                      <h3 className="font-semibold text-sm mb-1">Email</h3>
                      <a href={`mailto:${NGO.contact.email}`} className="text-sm text-[var(--color-primary)] hover:underline focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2">
                        {NGO.contact.email}
                      </a>
                      <br />
                      <a href={`mailto:${NGO.contact.donations_email}`} className="text-sm text-[var(--color-primary)] hover:underline focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2">
                        {NGO.contact.donations_email}
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="card p-5 flex gap-4 items-start">
                    <span className="text-2xl flex-shrink-0" role="img" aria-label="Phone">📞</span>
                    <div>
                      <h3 className="font-semibold text-sm mb-1">Phone</h3>
                      <a href={`tel:${NGO.contact.phone}`} className="text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors">
                        {NGO.contact.phone}
                      </a>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="card p-5 flex gap-4 items-start">
                    <span className="text-2xl flex-shrink-0" role="img" aria-label="WhatsApp">💬</span>
                    <div>
                      <h3 className="font-semibold text-sm mb-1">WhatsApp</h3>
                      <a
                        href={`https://wa.me/${NGO.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                      >
                        {NGO.contact.whatsapp}
                      </a>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Social links */}
              <ScrollReveal delay={0.2}>
                <div className="card-static p-6">
                  <h3 className="font-semibold text-sm mb-3">Follow Us</h3>
                  <SocialLinks />
                </div>
              </ScrollReveal>

              {/* Registration */}
              <ScrollReveal delay={0.3}>
                <div className="card-static p-6">
                  <h3 className="font-semibold text-sm mb-3">Registrations & Compliance</h3>
                  <dl className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-[var(--color-muted)]">NGO Darpan</dt>
                      <dd className="font-mono font-semibold text-right">{NGO.registration.ngo_darpan}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-[var(--color-muted)]">FCRA</dt>
                      <dd className="font-mono font-semibold text-right">{NGO.registration.fcra}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-[var(--color-muted)]">80G Certificate</dt>
                      <dd className="font-mono font-semibold text-right text-xs">{NGO.registration.section_80g}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-[var(--color-muted)]">PAN</dt>
                      <dd className="font-mono font-semibold text-right">{NGO.registration.pan}</dd>
                    </div>
                  </dl>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Map placeholder */}
          <ScrollReveal delay={0.2} className="mt-12">
            <div
              className="w-full h-64 rounded-[var(--radius)] border-2 border-dashed border-[var(--color-border)] bg-[var(--color-card)] flex flex-col items-center justify-center gap-2 text-[var(--color-muted)]"
              role="img"
              aria-label="Map placeholder"
            >
              <span className="text-4xl" aria-hidden="true">🗺️</span>
              <p className="text-sm font-medium">Map placeholder: {NGO.contact.map_url}</p>
              <a
                href={NGO.contact.map_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[var(--color-primary)] underline"
                aria-label="Open map in Google Maps"
              >
                Open in Google Maps ↗
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
