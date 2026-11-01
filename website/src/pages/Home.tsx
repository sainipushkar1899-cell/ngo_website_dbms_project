/* ─────────────────────────────────────────────────────────────────────────────
   Home Page — Aadhara Foundation
   Orchestrated hero sequence, parallax imagery, animated counters,
   pinned/scrubbed storytelling ("How your donation travels"),
   and real WebP photography.
   ───────────────────────────────────────────────────────────────────────────── */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from 'motion/react';
import {
  ScrollReveal,
  TextAnimation,
  LoadingSpinner,
  ErrorMessage,
  OptimizedImage,
  ButtonMagnetic,
} from '../components';
import { getProjects, getTestimonials } from '../api';
import type { Project, Testimonial } from '../api';
import { NGO } from '../config/ngo';

// ─── Animated Counter ────────────────────────────────────────────────────────

interface CounterProps {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

function AnimatedCounter({ target, prefix = '', suffix = '', duration = 2 }: CounterProps) {
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
          {prefix}{count.toLocaleString('en-IN')}{suffix}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function AnimatedProgressBar({ percent }: { percent: number }) {
  return (
    <div
      className="progress-bar"
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${percent}% funded`}
    >
      <motion.div
        className="progress-bar-fill"
        initial={{ width: 0 }}
        whileInView={{ width: `${percent}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </div>
  );
}

// ─── Pinned / Scrubbed Storytelling Component ─────────────────────────────────

const DONATION_JOURNEY_STAGES = [
  {
    step: '01',
    title: 'Cryptographic Intent & Earmarking',
    subtitle: 'Step 1 of 4 · Instant Allocation',
    description:
      'The moment you choose a project, a unique transaction token is generated in the payment intent table with strict row-level locking. 100% of your chosen amount is earmarked exclusively for that field initiative.',
    imageKey: 'step-1',
    metrics: 'Zero diversion · Immutable intent token',
  },
  {
    step: '02',
    title: 'Village & School Committee Validation',
    subtitle: 'Step 2 of 4 · Community Leadership',
    description:
      'We do not impose top-down aid. Trained village water committees, school headmasters, and women-led cooperatives review and authorise expenditure according to local priority checklists.',
    imageKey: 'step-2',
    metrics: '100% Community-co-designed · Local procurement',
  },
  {
    step: '03',
    title: 'Direct Field Execution & Material Delivery',
    subtitle: 'Step 3 of 4 · Transparent Deployment',
    description:
      'Solar panels for desert classrooms, deep borewell rigs in Bundelkhand, or mobile clinic supplies in the Sundarbans arrive directly on site. No middleman agencies or bureaucratic leakage.',
    imageKey: 'step-3',
    metrics: 'Direct on-ground delivery · Verified invoices',
  },
  {
    step: '04',
    title: 'Gapless DBMS Audit & Impact Verification',
    subtitle: 'Step 4 of 4 · Public Accountability',
    description:
      'An automated MySQL stored procedure commits the donation with strict ACID compliance, assigns a gapless 80G tax receipt number, and triggers a public audit entry viewable on the Database Inspector.',
    imageKey: 'step-4',
    metrics: 'ACID transactional guarantee · Gapless receipts',
  },
];

function HowDonationTravels() {
  const [activeStage, setActiveStage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      // Map 0 -> 1 progress to 0 -> 3 indices
      const index = Math.min(
        DONATION_JOURNEY_STAGES.length - 1,
        Math.max(0, Math.floor(latest * DONATION_JOURNEY_STAGES.length))
      );
      setActiveStage(index);
    });
  }, [scrollYProgress]);

  const current = DONATION_JOURNEY_STAGES[activeStage];

  return (
    <section
      ref={containerRef}
      className="py-24 bg-[var(--color-bg)] border-t border-[var(--color-border)] relative"
      aria-label="How your donation travels"
    >
      <div className="section-wrapper">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="section-label">Transparent Journey</span>
            <TextAnimation
              text="How Your Donation Travels"
              tag="h2"
              variant="slide-up"
              gradientText
              className="font-display text-4xl md:text-5xl mt-3 mb-4"
            />
            <p className="text-[var(--color-muted)] text-base md:text-lg">
              From your initial pledge to measurable on-ground empowerment: explore the four rigorous stages
              that protect your generosity and guarantee real-world outcomes.
            </p>
          </div>
        </ScrollReveal>

        {/* Interactive Storyboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Stage Controls & Narrative (Left: 5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {DONATION_JOURNEY_STAGES.map((stage, idx) => {
              const isActive = activeStage === idx;
              return (
                <button
                  key={stage.step}
                  onClick={() => setActiveStage(idx)}
                  className={[
                    'text-left p-5 rounded-[var(--radius)] transition-all duration-300 border flex gap-4 items-start',
                    isActive
                      ? 'bg-[var(--color-card)] border-[var(--color-primary)] shadow-md translate-x-1'
                      : 'bg-transparent border-transparent hover:border-[var(--color-border)] opacity-70 hover:opacity-100',
                  ].join(' ')}
                  aria-pressed={isActive}
                >
                  <span
                    className={[
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors',
                      isActive
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-[color-mix(in_srgb,var(--color-fg)_8%,transparent)] text-[var(--color-muted)]',
                    ].join(' ')}
                  >
                    {stage.step}
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-base md:text-lg text-[var(--color-fg)]">
                      {stage.title}
                    </h3>
                    <p className="text-xs text-[var(--color-muted)] mt-0.5">{stage.subtitle}</p>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 text-sm text-[var(--color-muted)] leading-relaxed"
                      >
                        {stage.description}
                        <div className="mt-3 pt-3 border-t border-[var(--color-border)] flex items-center gap-2 text-xs font-medium text-[var(--color-primary)]">
                          <span>✓</span>
                          <span>{stage.metrics}</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sticky/Pinned Visual Stage (Right: 7 cols) */}
          <div className="lg:col-span-7">
            <div className="relative rounded-[var(--radius-lg)] overflow-hidden shadow-xl border border-[var(--color-border)] bg-[var(--color-card)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStage}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.45 }}
                  className="relative aspect-[16/10] overflow-hidden"
                >
                  <OptimizedImage
                    imageKey={current.imageKey}
                    className="w-full h-full object-cover"
                    containerClassName="w-full h-full"
                    fallbackAlt={current.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-8 text-white">
                    <span className="text-xs font-semibold uppercase tracking-wider text-white/80 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full w-fit mb-2">
                      Stage {activeStage + 1} of 4
                    </span>
                    <h4 className="font-display text-xl md:text-2xl font-bold">{current.title}</h4>
                    <p className="text-xs md:text-sm text-white/90 mt-1 max-w-xl">{current.metrics}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Progress strip at bottom */}
              <div className="h-1.5 bg-[color-mix(in_srgb,var(--color-fg)_10%,transparent)] w-full flex">
                {DONATION_JOURNEY_STAGES.map((_, i) => (
                  <div
                    key={i}
                    className={[
                      'h-full flex-1 transition-all duration-300',
                      i <= activeStage ? 'bg-[var(--color-primary)]' : 'bg-transparent',
                    ].join(' ')}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const blobY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroImageY = useTransform(scrollYProgress, [0, 1], ['0px', '40px']);

  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [errorProjects, setErrorProjects] = useState<string | null>(null);
  const [errorTestimonials, setErrorTestimonials] = useState<string | null>(null);

  useEffect(() => {
    getProjects()
      .then((data) => setProjects(data.slice(0, 3)))
      .catch((e: Error) => setErrorProjects(e.message))
      .finally(() => setLoadingProjects(false));

    getTestimonials()
      .then((data) => setTestimonials(data.slice(0, 3)))
      .catch((e: Error) => setErrorTestimonials(e.message))
      .finally(() => setLoadingTestimonials(false));
  }, []);

  const stats = [
    { label: 'Total Raised', value: 487, prefix: '₹', suffix: ' Cr', description: 'directly invested in field aid' },
    { label: 'Projects', value: 127, prefix: '', suffix: '+', description: 'sustainable programmes' },
    { label: 'Beneficiaries', value: 284000, prefix: '', suffix: '', description: 'lives actively supported' },
    { label: 'Countries', value: 5, prefix: '', suffix: '', description: 'countries across South Asia & Africa' },
  ];

  const steps = [
    { icon: '🎯', title: 'Choose a Cause', desc: 'Browse verified projects across Education, Health, Clean Water, and Livelihoods.' },
    { icon: '💚', title: 'Make a Direct Gift', desc: 'Select any amount, generate an instant transaction QR, and receive an 80G tax receipt.' },
    { icon: '📊', title: 'Track Real Impact', desc: 'Monitor your donation in real time through our database audit trail and field reports.' },
  ];

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[92vh] flex items-center overflow-hidden pt-28 pb-16"
        aria-label="Hero"
      >
        {/* Aurora blobs with parallax */}
        <div className="aurora-bg" aria-hidden="true">
          <motion.div className="aurora-blob aurora-blob-1" style={{ y: blobY }} />
          <div className="aurora-blob aurora-blob-2" />
          <div className="aurora-blob aurora-blob-3" />
        </div>

        <div className="section-wrapper relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="section-label flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
              {NGO.name} · Est. {NGO.founding_year}
            </motion.div>

            <TextAnimation
              text="Dignity in Every Action. Impact That Endures."
              tag="h1"
              variant="slide-up"
              gradientText
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight"
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-lg md:text-xl text-[var(--color-muted)] max-w-2xl leading-relaxed"
            >
              We restore dignity and expand opportunity for India's most marginalised
              communities by delivering sustainable, community-led programmes across
              education, healthcare, clean water, and livelihoods.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <ButtonMagnetic>
                <Link
                  to="/donate"
                  className="primary-button primary-button-lg shadow-lg hover:shadow-xl transition-all"
                  aria-label="Donate now to make a difference"
                >
                  Make a Difference
                </Link>
              </ButtonMagnetic>
              <ButtonMagnetic>
                <Link
                  to="/projects"
                  className="secondary-button primary-button-lg"
                  aria-label="Explore our work and projects"
                >
                  Our Active Work
                </Link>
              </ButtonMagnetic>
            </motion.div>

            {/* Credibility badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="flex flex-wrap items-center gap-6 pt-4 text-xs text-[var(--color-muted)] border-t border-[var(--color-border)] w-full"
            >
              <div className="flex items-center gap-1.5 font-medium">
                <span className="text-[var(--color-primary)] font-bold">✓</span> Section 80G Tax Exemption
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <span className="text-[var(--color-primary)] font-bold">✓</span> FCRA Registered
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <span className="text-[var(--color-primary)] font-bold">✓</span> 100% Direct Allocation
              </div>
            </motion.div>
          </div>

          {/* Right Parallax Imagery Column */}
          <div className="lg:col-span-5 relative">
            <motion.div
              style={{ y: heroImageY }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              <div className="relative rounded-[var(--radius-xl)] overflow-hidden shadow-2xl border-2 border-white/60 aspect-[4/5]">
                <OptimizedImage
                  imageKey="hero"
                  className="w-full h-full object-cover"
                  containerClassName="w-full h-full"
                  fallbackAlt="Classroom students learning with dignity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="font-display text-xl font-bold leading-snug">
                    "When children learn without hunger, lasting change begins."
                  </p>
                  <p className="text-xs text-white/80 mt-1">Shiksha Kiran Digital Classroom · Barmer</p>
                </div>
              </div>

              {/* Floating Stat Widget */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="card absolute -bottom-6 -left-6 md:-left-8 p-4 shadow-xl border border-[var(--color-border)] rounded-[var(--radius)] flex items-center gap-3 bg-[var(--color-card)]/95 backdrop-blur-md"
              >
                <div className="w-11 h-11 rounded-full bg-[color-mix(in_srgb,var(--color-primary)_15%,transparent)] text-[var(--color-primary)] flex items-center justify-center text-xl shrink-0">
                  👥
                </div>
                <div>
                  <p className="font-display font-bold text-lg text-[var(--color-fg)] leading-none">
                    284,000+
                  </p>
                  <p className="text-xs text-[var(--color-muted)] mt-0.5">Lives Empowered Directly</p>
                </div>
              </motion.div>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.65 }}
                className="card absolute -top-4 -right-4 p-3 shadow-lg border border-[var(--color-border)] rounded-[var(--radius)] flex items-center gap-2 bg-[var(--color-card)]/95 backdrop-blur-md text-xs font-semibold text-[var(--color-primary)]"
              >
                <span>🛡️</span> 100% Gapless Audit Trail
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Impact Strip ──────────────────────────────────────────────────── */}
      <section
        aria-label="Impact statistics"
        className="bg-[var(--color-card)] border-y border-[var(--color-border)] relative z-20 shadow-sm"
      >
        <div className="section-wrapper py-12">
          <div className="overflow-x-auto -mx-4 px-4 pb-2 md:pb-0">
            <div className="flex gap-8 min-w-max md:min-w-0 md:grid md:grid-cols-4">
              {stats.map((stat, i) => (
                <ScrollReveal key={stat.label} delay={i * 0.1} className="flex-shrink-0 text-center md:text-left">
                  <p className="font-display text-4xl md:text-5xl font-bold text-[var(--color-primary)] leading-none">
                    <AnimatedCounter
                      target={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  </p>
                  <p className="mt-2 text-sm font-semibold tracking-wide text-[var(--color-fg)] uppercase">
                    {stat.label}
                  </p>
                  <p className="text-xs text-[var(--color-muted)] mt-0.5">{stat.description}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Projects ─────────────────────────────────────────────── */}
      <section aria-label="Featured projects" className="py-24">
        <div className="section-wrapper">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <span className="section-label">Featured Projects</span>
                <TextAnimation
                  text="Stories of Change in Action"
                  tag="h2"
                  variant="slide-up"
                  gradientText
                  className="font-display text-4xl md:text-5xl mt-2 mb-3"
                />
                <p className="text-[var(--color-muted)] max-w-2xl text-base md:text-lg">
                  Every rupee you donate directly funds certified equipment, local teams, and community maintenance.
                </p>
              </div>
              <Link
                to="/projects"
                className="outline-button shrink-0 hidden md:inline-flex"
              >
                View All 8 Projects →
              </Link>
            </div>
          </ScrollReveal>

          {loadingProjects && (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" message="Loading projects…" />
            </div>
          )}

          {errorProjects && (
            <ErrorMessage message={errorProjects} retry={() => window.location.reload()} />
          )}

          {!loadingProjects && !errorProjects && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects.map((project, i) => (
                <ScrollReveal key={project.project_id} delay={i * 0.12}>
                  <article className="card p-0 overflow-hidden flex flex-col h-full hover:-translate-y-1.5 transition-all duration-300 shadow-md hover:shadow-xl group">
                    <div className="relative h-48 overflow-hidden rounded-t-[var(--radius)] flex-shrink-0">
                      <OptimizedImage
                        imageKey={project.image_slot}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        containerClassName="w-full h-full"
                        fallbackAlt={project.project_name}
                      />
                      <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full bg-white/95 text-[var(--color-primary)] shadow-sm">
                        {project.category}
                      </span>
                    </div>

                    <div className="p-6 flex flex-col flex-1 gap-3">
                      <p className="text-xs text-[var(--color-muted)] flex items-center gap-1 font-medium">
                        📍 {project.location}
                      </p>
                      <h3 className="font-display font-bold text-xl leading-snug group-hover:text-[var(--color-primary)] transition-colors">
                        {project.project_name}
                      </h3>
                      <p className="text-sm text-[var(--color-muted)] line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>

                      <div className="mt-auto space-y-2 pt-3 border-t border-[var(--color-border)]">
                        <div className="flex justify-between text-xs text-[var(--color-muted)]">
                          <span className="font-semibold text-[var(--color-fg)]">
                            ₹{(project.raised / 100000).toFixed(1)}L raised
                          </span>
                          <span className="font-bold text-[var(--color-primary)]">
                            {project.percent_funded}% funded
                          </span>
                        </div>
                        <AnimatedProgressBar percent={project.percent_funded} />
                        <div className="flex justify-between text-xs text-[var(--color-muted)]">
                          <span>Target: ₹{(project.budget / 100000).toFixed(1)} Lakhs</span>
                        </div>
                      </div>

                      <Link
                        to={`/donate?project=${project.project_id}`}
                        className="primary-button primary-button-sm w-full text-center mt-3"
                        aria-label={`Donate to ${project.project_name}`}
                      >
                        Donate to this Project
                      </Link>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          )}

          <div className="mt-10 text-center md:hidden">
            <Link to="/projects" className="outline-button w-full">
              View All 8 Projects →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pinned/Scrubbed Storytelling Section ───────────────────────────── */}
      <HowDonationTravels />

      {/* ── How It Works in 3 Steps ───────────────────────────────────────── */}
      <section aria-label="How it works" className="py-24 bg-[var(--color-secondary)]">
        <div className="section-wrapper">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-label">Straightforward Giving</span>
              <TextAnimation
                text="Three Simple Steps to Support"
                tag="h2"
                variant="slide-up"
                gradientText
                className="font-display text-4xl md:text-5xl mt-2 mb-4"
              />
              <p className="text-[var(--color-muted)]">
                Our donation workflow is designed for maximum security, instantaneous tax receipts, and full tracking transparency.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <ScrollReveal key={step.title} delay={i * 0.15}>
                <div className="card p-8 text-center flex flex-col items-center gap-4 h-full relative group hover:-translate-y-1 transition-transform">
                  <div className="w-16 h-16 rounded-full bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)] text-[var(--color-primary)] flex items-center justify-center text-3xl mb-2">
                    {step.icon}
                  </div>
                  <span className="w-7 h-7 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <h3 className="font-display text-xl font-bold">{step.title}</h3>
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section aria-label="Testimonials" className="py-24">
        <div className="section-wrapper">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-label">Voices of Impact</span>
              <TextAnimation
                text="From the Communities We Serve"
                tag="h2"
                variant="slide-up"
                gradientText
                className="font-display text-4xl md:text-5xl mt-2 mb-4"
              />
              <p className="text-[var(--color-muted)]">
                Hear firsthand from teachers, artisans, community volunteers, and supporters who make this journey possible.
              </p>
            </div>
          </ScrollReveal>

          {loadingTestimonials && (
            <div className="flex justify-center py-12">
              <LoadingSpinner message="Loading testimonials…" />
            </div>
          )}

          {errorTestimonials && (
            <ErrorMessage message={errorTestimonials} />
          )}

          {!loadingTestimonials && !errorTestimonials && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <ScrollReveal key={t.id} delay={i * 0.15}>
                  <blockquote className="card p-8 flex flex-col gap-6 hover:-translate-y-1 transition-transform duration-300 h-full">
                    <div className="text-3xl text-[var(--color-primary)] font-serif leading-none" aria-hidden="true">
                      “
                    </div>
                    <p className="text-base leading-relaxed text-[var(--color-fg)] italic flex-1">
                      {t.quote}
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
          )}
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <section
        aria-label="Call to action"
        className="py-24 bg-[var(--color-primary)] text-white relative overflow-hidden"
      >
        <div
          className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div className="section-wrapper text-center relative z-10">
          <ScrollReveal>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Restore Dignity and Opportunity?
            </h2>
            <p className="text-white/85 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
              Every single gift — whether ₹500 for mid-day meals or ₹50,000 for a solar classroom kit — is recorded with an immutable receipt and verified impact reports.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4">
              <ButtonMagnetic>
                <Link
                  to="/donate"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[var(--color-primary)] font-bold rounded-[var(--radius)] hover:bg-white/90 shadow-xl hover:-translate-y-0.5 transition-all text-base"
                  aria-label="Donate now to our causes"
                >
                  💚 Donate Now
                </Link>
              </ButtonMagnetic>
              <ButtonMagnetic>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-[var(--radius)] border border-white/30 transition-all text-base backdrop-blur-sm"
                  aria-label="Learn more about our mission"
                >
                  Read Our Mission
                </Link>
              </ButtonMagnetic>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
