/* ─────────────────────────────────────────────────────────────────────────────
   Impact Page — Aadhara Foundation
   Countries we work in (India, Nepal, Kenya, Bangladesh, Philippines),
   animated beneficiaries-per-country visualization, "how your money is used"
   breakdown, and verified community testimonials with real photography.
   ───────────────────────────────────────────────────────────────────────────── */

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'motion/react';
import {
  ScrollReveal,
  TextAnimation,
  LoadingSpinner,
  ErrorMessage,
  OptimizedImage,
} from '../components';
import {
  getImpactStats,
  getBeneficiariesByCountry,
  getHowMoneyUsed,
  getTestimonials,
} from '../api';
import type {
  ImpactStats,
  BeneficiaryByCountry,
  HowMoneyUsed,
  Testimonial,
} from '../api';

// ─── Animated Counter ────────────────────────────────────────────────────────

function AnimatedCounter({
  target,
  prefix = '',
  suffix = '',
  duration = 2,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const steps = 60;
    const increment = target / steps;
    const stepTime = (duration * 1000) / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <span ref={ref} aria-label={`${prefix}${target}${suffix}`}>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={count}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          className="tabular-nums"
        >
          {prefix}
          {count.toLocaleString('en-IN')}
          {suffix}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// ─── Segment colors for money used ───────────────────────────────────────────

const SEGMENT_COLORS = ['#2d5a27', '#4a8c3f', '#8B6914', '#1a6ea8', '#7c3aed'];

const COUNTRY_IMAGE_MAP: Record<string, string> = {
  India: 'impact-india',
  Nepal: 'impact-nepal',
  Bangladesh: 'impact-bangladesh',
  Kenya: 'impact-kenya',
  Philippines: 'impact-philippines',
};

// ─── Impact Page ─────────────────────────────────────────────────────────────

export default function Impact() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const blobY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

  const [impactStats, setImpactStats] = useState<ImpactStats | null>(null);
  const [countries, setCountries] = useState<BeneficiaryByCountry[]>([]);
  const [moneyUsed, setMoneyUsed] = useState<HowMoneyUsed[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      getImpactStats(),
      getBeneficiariesByCountry(),
      getHowMoneyUsed(),
      getTestimonials(),
    ])
      .then(([stats, ctry, money, testi]) => {
        setImpactStats(stats);
        setCountries(ctry);
        setMoneyUsed(money);
        setTestimonials(testi.slice(0, 2));
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const maxCount = countries.reduce((m, c) => Math.max(m, c.beneficiary_count), 1);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading impact data…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message={error} retry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[65vh] flex items-center overflow-hidden pt-32 pb-16"
        aria-label="Impact hero"
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
            Verified Outcomes & Auditing
          </motion.div>
          <TextAnimation
            text="Measurable Global Impact"
            tag="h1"
            variant="slide-up"
            gradientText
            className="font-display text-5xl md:text-7xl font-bold max-w-4xl leading-tight"
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 text-lg md:text-xl text-[var(--color-muted)] max-w-2xl leading-relaxed"
          >
            We measure every rupee and every life touched. From Rajasthan desert classrooms to Marsabit water wells, explore our verified beneficiaries and fund allocations.
          </motion.p>
        </div>
      </section>

      {/* ── Stats Strip ──────────────────────────────────────────────────── */}
      {impactStats && (
        <section aria-label="Impact statistics" className="bg-[var(--color-card)] border-y border-[var(--color-border)] shadow-sm">
          <div className="section-wrapper py-12">
            <div className="overflow-x-auto -mx-4 px-4 pb-2 md:pb-0">
              <div className="flex gap-8 min-w-max md:min-w-0 md:grid md:grid-cols-5">
                {[
                  { label: 'Total Raised', value: Math.round(impactStats.total_raised / 10000000), prefix: '₹', suffix: ' Cr' },
                  { label: 'Projects Completed', value: impactStats.total_projects, prefix: '', suffix: '+' },
                  { label: 'Lives Impacted', value: impactStats.total_beneficiaries, prefix: '', suffix: '' },
                  { label: 'Countries Reached', value: impactStats.countries_count, prefix: '', suffix: '' },
                  { label: 'Years of Service', value: impactStats.years_active, prefix: '', suffix: ' Yrs' },
                ].map((stat, i) => (
                  <ScrollReveal key={stat.label} delay={i * 0.1} className="flex-shrink-0 text-center md:text-left">
                    <p className="font-display text-4xl font-bold text-[var(--color-primary)] leading-none">
                      <AnimatedCounter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                    </p>
                    <p className="mt-2 text-xs font-bold tracking-wider text-[var(--color-fg)] uppercase">
                      {stat.label}
                    </p>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Country Breakdown ────────────────────────────────────────────── */}
      <section aria-label="Impact by country" className="py-24">
        <div className="section-wrapper">
          <ScrollReveal>
            <div className="max-w-2xl mb-16">
              <span className="section-label">International Presence</span>
              <TextAnimation
                text="Beneficiaries Across 5 Nations"
                tag="h2"
                variant="slide-up"
                gradientText
                className="font-display text-4xl md:text-5xl mt-2 mb-4"
              />
              <p className="text-[var(--color-muted)] text-lg">
                Independent field audits and local governance committees track direct beneficiaries across all five active partner countries.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {countries.map((country, i) => {
              const barPercent = Math.round((country.beneficiary_count / maxCount) * 100);
              const imgKey = COUNTRY_IMAGE_MAP[country.country] || 'impact-india';

              return (
                <ScrollReveal key={country.country} delay={i * 0.1}>
                  <div className="card p-0 overflow-hidden flex flex-col h-full hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-xl group">
                    <div className="relative h-44 overflow-hidden">
                      <OptimizedImage
                        imageKey={imgKey}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        containerClassName="w-full h-full"
                        fallbackAlt={`${country.country} community programmes`}
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                        <span className="text-xl" role="img" aria-label={`${country.country} flag`}>
                          {country.flag_emoji}
                        </span>
                        <span className="font-display font-bold text-sm text-[var(--color-fg)]">
                          {country.country}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col gap-3 flex-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-[var(--color-muted)] font-semibold uppercase tracking-wider">
                          Direct Beneficiaries
                        </span>
                        <p className="font-display text-xl font-bold text-[var(--color-primary)]">
                          <AnimatedCounter target={country.beneficiary_count} />
                        </p>
                      </div>

                      {/* Animated Progress Bar */}
                      <div className="h-2.5 bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)] rounded-full overflow-hidden" aria-hidden="true">
                        <motion.div
                          className="h-full bg-[var(--color-primary)] rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${barPercent}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                        />
                      </div>

                      <p className="text-sm text-[var(--color-muted)] leading-relaxed mt-2 flex-1">
                        {country.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How Money Is Used ────────────────────────────────────────────── */}
      <section aria-label="How donations are used" className="py-24 bg-[var(--color-secondary)]">
        <div className="section-wrapper">
          <ScrollReveal>
            <div className="max-w-3xl mb-16">
              <span className="section-label">Fiscal Accountability</span>
              <TextAnimation
                text="How Every Rupee Is Used"
                tag="h2"
                variant="slide-up"
                gradientText
                className="font-display text-4xl md:text-5xl mt-2 mb-4"
              />
              <p className="text-[var(--color-muted)] text-lg">
                We maintain an industry-leading programme expenditure ratio. 72% directly funds physical project assets and frontline staff salaries.
              </p>
            </div>
          </ScrollReveal>

          {/* Stacked visualization bar */}
          <ScrollReveal>
            <div className="card p-6 md:p-8 mb-10 shadow-sm">
              <h3 className="font-display font-bold text-lg mb-4 text-[var(--color-fg)]">
                Programme Expenditure Allocation
              </h3>
              <div className="flex h-12 rounded-full overflow-hidden shadow-inner p-1 bg-[color-mix(in_srgb,var(--color-fg)_6%,transparent)]" role="img" aria-label="Fund allocation breakdown">
                {moneyUsed.map((item, i) => (
                  <motion.div
                    key={item.category}
                    className="h-full relative group first:rounded-l-full last:rounded-r-full"
                    style={{ backgroundColor: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.percent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: i * 0.1 }}
                    title={`${item.category}: ${item.percent}%`}
                  >
                    <span className="sr-only">{item.category}: {item.percent}%</span>
                  </motion.div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-[var(--color-border)]">
                {moneyUsed.map((item, i) => (
                  <div key={item.category} className="flex items-center gap-2 text-xs">
                    <span
                      className="w-3.5 h-3.5 rounded-sm shrink-0"
                      style={{ backgroundColor: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }}
                      aria-hidden="true"
                    />
                    <span className="font-bold text-[var(--color-fg)]">{item.percent}%</span>
                    <span className="text-[var(--color-muted)]">{item.category}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Breakdown cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {moneyUsed.map((item, i) => (
              <ScrollReveal key={item.category} delay={i * 0.08}>
                <div className="card p-6 flex flex-col gap-3 h-full shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span
                      className="w-3.5 h-3.5 rounded-sm"
                      style={{ backgroundColor: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }}
                      aria-hidden="true"
                    />
                    <span className="font-display text-3xl font-bold text-[var(--color-primary)]">
                      {item.percent}%
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-[var(--color-fg)]">
                    {item.category}
                  </h3>
                  <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Impact Stories ────────────────────────────────────────────────── */}
      <section aria-label="Impact stories" className="py-24">
        <div className="section-wrapper">
          <ScrollReveal>
            <div className="max-w-2xl mb-16">
              <span className="section-label">Field Testimonials</span>
              <TextAnimation
                text="Real Voices from the Ground"
                tag="h2"
                variant="slide-up"
                gradientText
                className="font-display text-4xl md:text-5xl mt-2 mb-4"
              />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.id} delay={i * 0.15}>
                <blockquote className="card p-8 flex flex-col gap-6 hover:-translate-y-1 transition-transform duration-300 h-full shadow-sm">
                  <div className="text-3xl text-[var(--color-primary)] font-serif leading-none" aria-hidden="true">
                    “
                  </div>
                  <p className="text-base leading-relaxed italic text-[var(--color-fg)] flex-1">
                    "{t.quote}"
                  </p>
                  <footer className="flex items-center gap-4 mt-auto pt-4 border-t border-[var(--color-border)]">
                    <OptimizedImage
                      imageKey={t.avatar_slot}
                      className="w-12 h-12 rounded-full object-cover shrink-0"
                      containerClassName="w-12 h-12 rounded-full shrink-0"
                      fallbackAlt={t.name}
                    />
                    <div>
                      <p className="font-semibold text-sm leading-tight text-[var(--color-fg)]">{t.name}</p>
                      <p className="text-xs text-[var(--color-primary)] font-medium mt-0.5">{t.role}</p>
                      <p className="text-xs text-[var(--color-muted)]">{t.location}</p>
                    </div>
                  </footer>
                </blockquote>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
