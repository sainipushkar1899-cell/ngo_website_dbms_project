/* ─────────────────────────────────────────────────────────────────────────────
   Causes Page — Aadhara Foundation
   Six core programmes: Education, Healthcare, Clean Water,
   Livelihood, Environment, Disaster Relief.
   ───────────────────────────────────────────────────────────────────────────── */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { ScrollReveal, TextAnimation, LoadingSpinner, ErrorMessage, OptimizedImage, ButtonMagnetic } from '../components';
import { getCauses } from '../api';
import type { Cause } from '../api';

const iconMap: Record<string, string> = {
  BookOpen: '📚',
  HeartPulse: '🏥',
  Droplets: '💧',
  Sprout: '🌱',
  TreePine: '🌳',
  ShieldAlert: '🛡️',
};

function CauseCard({ cause }: { cause: Cause }) {
  return (
    <article className="card p-0 overflow-hidden flex flex-col h-full group hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-xl">
      {/* Real photograph with hover zoom */}
      <div className="relative h-56 overflow-hidden rounded-t-[var(--radius)]">
        <OptimizedImage
          imageKey={cause.image_slot}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          containerClassName="w-full h-full"
          fallbackAlt={cause.title}
        />
        {/* Category icon badge */}
        <div
          className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-md bg-white/95 backdrop-blur-sm"
          aria-hidden="true"
        >
          {iconMap[cause.icon_name] ?? '✦'}
        </div>
      </div>

      <div className="p-7 flex flex-col gap-4 flex-1">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
            style={{ backgroundColor: `${cause.color}15`, color: cause.color }}
          >
            {cause.category}
          </span>
        </div>

        <h3 className="font-display text-2xl font-bold leading-snug group-hover:text-[var(--color-primary)] transition-colors">
          {cause.title}
        </h3>

        <p className="text-sm text-[var(--color-muted)] leading-relaxed flex-1">
          {cause.description}
        </p>

        {/* Programme metrics */}
        <div className="grid grid-cols-2 gap-4 py-3 border-y border-[var(--color-border)] text-center">
          <div>
            <p className="font-display text-2xl font-bold text-[var(--color-primary)]">
              {cause.project_count}
            </p>
            <p className="text-xs text-[var(--color-muted)] font-medium uppercase tracking-wider">
              Active Projects
            </p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-[var(--color-primary)]">
              {cause.beneficiary_count.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-[var(--color-muted)] font-medium uppercase tracking-wider">
              Beneficiaries
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <Link
            to={`/projects?category=${encodeURIComponent(cause.category)}`}
            className="outline-button flex-1 text-center text-sm"
            aria-label={`View projects under ${cause.category}`}
          >
            View Projects
          </Link>
          <Link
            to={`/donate?category=${encodeURIComponent(cause.category)}`}
            className="primary-button primary-button-sm text-center px-4"
            aria-label={`Donate directly to ${cause.category}`}
          >
            Donate
          </Link>
        </div>
      </div>
    </article>
  );
}

// ─── Causes Page ─────────────────────────────────────────────────────────────

export default function Causes() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const blobY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

  const [causes, setCauses] = useState<Cause[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCauses()
      .then((data) => setCauses(data))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[65vh] flex items-center overflow-hidden pt-32 pb-16"
        aria-label="Causes hero"
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
            className="section-label mb-4"
          >
            Pillars of Intervention
          </motion.div>
          <TextAnimation
            text="Our Core Causes"
            tag="h1"
            variant="slide-up"
            gradientText
            className="font-display text-5xl md:text-7xl font-bold max-w-3xl leading-tight"
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 text-lg md:text-xl text-[var(--color-muted)] max-w-3xl leading-relaxed"
          >
            True dignity spans the whole human condition. We channel resources across six interconnected
            programmes — so clean water empowers education, healthcare protects livelihoods, and ecology builds generational resilience.
          </motion.p>
        </div>
      </section>

      {/* ── Causes Grid ──────────────────────────────────────────────────── */}
      <section aria-label="Causes list" className="py-20 bg-[var(--color-bg)]">
        <div className="section-wrapper">
          {loading && (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" message="Loading causes…" />
            </div>
          )}

          {error && (
            <ErrorMessage message={error} retry={() => window.location.reload()} />
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {causes.map((cause, i) => (
                <ScrollReveal key={cause.id} delay={i * 0.1}>
                  <CauseCard cause={cause} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-[var(--color-primary)] text-white text-center">
        <div className="section-wrapper">
          <ScrollReveal>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-white">
              Can't Decide Which Cause to Support?
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8 text-base md:text-lg">
              Donate to our general emergency and priority fund, where field leadership allocates funds to the area of highest urgent necessity.
            </p>
            <ButtonMagnetic>
              <Link
                to="/donate"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-[var(--color-primary)] font-bold rounded-[var(--radius)] hover:bg-white/90 shadow-lg text-base"
              >
                Donate Where Needed Most
              </Link>
            </ButtonMagnetic>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
