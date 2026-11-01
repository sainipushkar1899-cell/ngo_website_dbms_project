/* ─────────────────────────────────────────────────────────────────────────────
   About Page — Aadhara Foundation
   Mission, vision, grounds of work, core values, timeline, and leadership.
   ───────────────────────────────────────────────────────────────────────────── */

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ScrollReveal, TextAnimation, OptimizedImage, ButtonMagnetic } from '../components';
import { Link } from 'react-router-dom';
import { NGO } from '../config/ngo';

// ─── Milestones ───────────────────────────────────────────────────────────────

const milestones = [
  {
    year: '2008',
    title: 'Aadhara Foundation Inception',
    desc: 'Registered in Jaipur with an initial cohort of 12 educators and social workers addressing girl-child literacy in desert districts.',
  },
  {
    year: '2014',
    title: 'Clean Water & Health Expansion',
    desc: 'Commissioned our first 25 solar-powered deep borewells in drought-prone Bundelkhand and launched Sundarbans boat clinics.',
  },
  {
    year: '2019',
    title: 'International Disaster Resilience',
    desc: 'Expanded cross-border humanitarian and reconstruction support into Nepal following seismic disasters and coastal Bangladesh.',
  },
  {
    year: '2022',
    title: 'Arid Lands Water Initiative in Kenya',
    desc: 'Began installing sustainable groundwater networks for pastoralist families in Marsabit County, Kenya.',
  },
  {
    year: '2025',
    title: '284,000 Lives Empowered Milestone',
    desc: 'Crossed 127 completed capital projects with 100% open DBMS auditing and community co-ownership across South Asia and East Africa.',
  },
];

// ─── Team Members ─────────────────────────────────────────────────────────────

const teamMembers = [
  {
    name: 'Priya Sharma',
    role: 'Executive Director & Founder',
    imageKey: 'team-priya',
    bio: 'Former rural development fellow with 18 years dedicated to community-owned education systems.',
  },
  {
    name: 'Rajan Verma',
    role: 'Chief Programme Officer',
    imageKey: 'team-rajan',
    bio: 'Civil engineer turned humanitarian coordinator overseeing ground logistics across 5 nations.',
  },
  {
    name: 'Anika Patel',
    role: 'Head of Finance & Compliance',
    imageKey: 'team-anika',
    bio: 'Chartered accountant leading our gapless DBMS audit trail, 80G governance, and FCRA transparency.',
  },
  {
    name: 'Deepak Nair',
    role: 'Director of Partnerships & CSR',
    imageKey: 'team-deepak',
    bio: 'Facilitating collaborative institutional grants and technological partnerships with IITs and global charities.',
  },
];

// ─── Value Icon Map ───────────────────────────────────────────────────────────

const iconMap: Record<string, string> = {
  Heart: '❤️',
  Users: '👥',
  Eye: '👁️',
  Layers: '📐',
  BarChart2: '📊',
  Anchor: '⚓',
};

// ─── Grounds of Work ──────────────────────────────────────────────────────────

const groundsOfWork = [
  {
    region: 'Thar Desert Corridor, Rajasthan',
    focus: 'Digital Primary Classrooms & Solar Energy',
    presence: '48 School Hubs · 12,000+ Students',
    desc: 'Overcoming geographic isolation with self-sustaining solar classrooms in remote desert hamlets where grid electricity is unreliable.',
  },
  {
    region: 'Sundarbans Mangrove Delta, West Bengal',
    focus: 'Mobile Boat Clinics & Maternal Care',
    presence: '6 Medical Boats · 42 Island Communities',
    desc: 'Navigating tidal river networks to provide weekly clinical examinations, vaccinations, and emergency transport for remote island villages.',
  },
  {
    region: 'Bundelkhand Plateau, Madhya Pradesh',
    focus: 'Deep Borewells & Gravity Water Grids',
    presence: '18 Borewells · 11,400 Beneficiaries',
    desc: 'Recharging depleted aquifers and installing solar water pumping stations maintained by certified women-led village water committees.',
  },
  {
    region: 'Eastern Ghats Tribal Belt, Odisha',
    focus: 'Forest Custodianship & Regenerative Farming',
    presence: '28 Tribal Villages · 1,200 Hectares',
    desc: 'Partnering with indigenous forest communities to restore native flora while securing bamboo harvesting and craft marketing rights.',
  },
];

// ─── About Page ───────────────────────────────────────────────────────────────

export default function About() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const blobY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[75vh] flex items-center overflow-hidden pt-32 pb-20"
        aria-label="About hero"
      >
        <div className="aurora-bg" aria-hidden="true">
          <motion.div className="aurora-blob aurora-blob-1" style={{ y: blobY }} />
          <div className="aurora-blob aurora-blob-2" />
        </div>
        <div className="section-wrapper relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col items-start gap-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="section-label"
            >
              Who We Are & What Drives Us
            </motion.div>
            <TextAnimation
              text="Built on Dignity. Driven by Lasting Community Impact."
              tag="h1"
              variant="slide-up"
              gradientText
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
            />
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-lg text-[var(--color-muted)] leading-relaxed max-w-2xl"
            >
              Founded in 2008, {NGO.name} operates on a simple conviction: lasting development is never given from the outside — it is unlocked from within the community.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex gap-4 pt-2"
            >
              <ButtonMagnetic>
                <Link to="/donate" className="primary-button">
                  Support Our Mission
                </Link>
              </ButtonMagnetic>
              <ButtonMagnetic>
                <Link to="/causes" className="secondary-button">
                  Explore Causes
                </Link>
              </ButtonMagnetic>
            </motion.div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-[var(--radius-lg)] overflow-hidden shadow-2xl border-2 border-white/60 aspect-[4/3]">
              <OptimizedImage
                imageKey="about-hero"
                className="w-full h-full object-cover"
                containerClassName="w-full h-full"
                fallbackAlt="Field planning session with local leaders"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ──────────────────────────────────────────────── */}
      <section aria-label="Mission and Vision" className="py-20 bg-[var(--color-card)] border-y border-[var(--color-border)]">
        <div className="section-wrapper">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScrollReveal delay={0}>
              <div className="card p-8 md:p-10 h-full flex flex-col justify-between">
                <div>
                  <span className="text-4xl mb-4 block" role="img" aria-label="Mission">🎯</span>
                  <h2 className="font-display text-2xl md:text-3xl font-bold mb-4 text-[var(--color-primary)]">
                    Our Mission
                  </h2>
                  <p className="text-[var(--color-muted)] text-base md:text-lg leading-relaxed">
                    {NGO.mission}
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-[var(--color-border)] text-xs text-[var(--color-muted)]">
                  Guiding principle: Aid is a fundamental human right, not a discretionary favour.
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="card p-8 md:p-10 h-full flex flex-col justify-between">
                <div>
                  <span className="text-4xl mb-4 block" role="img" aria-label="Vision">🌟</span>
                  <h2 className="font-display text-2xl md:text-3xl font-bold mb-4 text-[var(--color-primary)]">
                    Our Vision
                  </h2>
                  <p className="text-[var(--color-muted)] text-base md:text-lg leading-relaxed">
                    {NGO.vision}
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-[var(--color-border)] text-xs text-[var(--color-muted)]">
                  Strategic target: 100% community self-sufficiency with verified zero dependency.
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Grounds of Work ───────────────────────────────────────────────── */}
      <section aria-label="Grounds of work" className="py-24">
        <div className="section-wrapper">
          <ScrollReveal>
            <div className="max-w-3xl mb-16">
              <span className="section-label">Where We Work</span>
              <TextAnimation
                text="Our Grounds of Work"
                tag="h2"
                variant="slide-up"
                gradientText
                className="font-display text-4xl md:text-5xl mt-2 mb-4"
              />
              <p className="text-[var(--color-muted)] text-lg">
                We establish deep, multi-year operating bases in regions defined by severe environmental challenges and historic exclusion.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {groundsOfWork.map((ground, i) => (
              <ScrollReveal key={ground.region} delay={i * 0.1}>
                <div className="card p-8 h-full flex flex-col justify-between hover:-translate-y-1 transition-transform">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] px-3 py-1 rounded-full">
                      {ground.focus}
                    </span>
                    <h3 className="font-display text-xl md:text-2xl font-bold mt-4 mb-2 text-[var(--color-fg)]">
                      {ground.region}
                    </h3>
                    <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-4">
                      {ground.desc}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-xs font-semibold text-[var(--color-fg)]">
                    <span>Presence:</span>
                    <span className="text-[var(--color-primary)]">{ground.presence}</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Values ───────────────────────────────────────────────────── */}
      <section aria-label="Our values" className="py-24 bg-[var(--color-secondary)]">
        <div className="section-wrapper">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-label">Ethical Foundation</span>
              <TextAnimation
                text="Our Core Values"
                tag="h2"
                variant="slide-up"
                gradientText
                className="font-display text-4xl md:text-5xl mt-2 mb-4"
              />
              <p className="text-[var(--color-muted)]">
                Six non-negotiable principles that shape every budget, project decision, and community partnership.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {NGO.values.map((value, i) => (
              <ScrollReveal key={value.title} delay={i * 0.08}>
                <div className="card p-6 h-full flex flex-col gap-3 hover:-translate-y-1 transition-transform duration-300">
                  <span className="text-3xl" role="img" aria-label={value.icon}>
                    {iconMap[value.icon] ?? '✦'}
                  </span>
                  <h3 className="font-display text-xl font-bold">{value.title}</h3>
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed">{value.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────────────────────── */}
      <section aria-label="Our journey" className="py-24">
        <div className="section-wrapper">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-label">Evolution Over Time</span>
              <TextAnimation
                text="Milestones of Impact"
                tag="h2"
                variant="slide-up"
                gradientText
                className="font-display text-4xl md:text-5xl mt-2 mb-4"
              />
              <p className="text-[var(--color-muted)]">
                From a small cohort in Jaipur to cross-continental clean water and education grids.
              </p>
            </div>
          </ScrollReveal>

          <div className="relative max-w-4xl mx-auto">
            {/* Animated vertical line */}
            <motion.div
              className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-[var(--color-border)] -translate-x-1/2"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{ transformOrigin: 'top' }}
              aria-hidden="true"
            />

            <div className="space-y-12">
              {milestones.map((m, i) => (
                <ScrollReveal key={m.year} delay={i * 0.1}>
                  <div className={`relative flex flex-col md:flex-row gap-6 md:gap-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className="flex items-start gap-4 md:gap-0 md:w-1/2 md:justify-end">
                      <div
                        className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-[var(--color-primary)] border-4 border-[var(--color-bg)] -translate-x-1/2 mt-2 z-10 shadow"
                        aria-hidden="true"
                      />
                      <div className={`pl-12 md:pl-0 ${i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'} md:w-full`}>
                        <div className="card p-6 shadow-sm">
                          <span className="font-display text-3xl font-bold text-[var(--color-primary)]">{m.year}</span>
                          <h3 className="font-display text-xl font-bold mt-1 mb-2">{m.title}</h3>
                          <p className="text-sm text-[var(--color-muted)] leading-relaxed">{m.desc}</p>
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block md:w-1/2" />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Leadership Team ───────────────────────────────────────────────── */}
      <section aria-label="Our team" className="py-24 bg-[var(--color-secondary)]">
        <div className="section-wrapper">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-label">Field & Governance</span>
              <TextAnimation
                text="Leadership Team"
                tag="h2"
                variant="slide-up"
                gradientText
                className="font-display text-4xl md:text-5xl mt-2 mb-4"
              />
              <p className="text-[var(--color-muted)]">
                Our directors bring decades of grassroots field experience, engineering competence, and rigorous financial compliance.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, i) => (
              <ScrollReveal key={member.name} delay={i * 0.1}>
                <div className="card p-6 text-center flex flex-col items-center gap-4 hover:-translate-y-1.5 transition-all duration-300 h-full shadow-sm hover:shadow-md">
                  <OptimizedImage
                    imageKey={member.imageKey}
                    className="w-28 h-28 rounded-full object-cover shadow-inner"
                    containerClassName="w-28 h-28 rounded-full shadow"
                    fallbackAlt={member.name}
                  />
                  <div>
                    <h3 className="font-display font-bold text-lg">{member.name}</h3>
                    <p className="text-xs font-semibold text-[var(--color-primary)] mt-0.5">{member.role}</p>
                    <p className="text-xs text-[var(--color-muted)] mt-2 leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
