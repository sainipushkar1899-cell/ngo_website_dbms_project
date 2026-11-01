/* ─────────────────────────────────────────────────────────────────────────────
   Projects Page — Aadhara Foundation
   8 sample project cards with category filter, animated progress bars,
   budget vs raised breakdown, and real WebP imagery.
   ───────────────────────────────────────────────────────────────────────────── */

import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  ScrollReveal,
  TextAnimation,
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
  OptimizedImage,
} from '../components';
import { getProjects } from '../api';
import type { Project, ProjectCategory } from '../api';

// ─── Animated Progress Bar ────────────────────────────────────────────────────

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

// ─── Category filter tabs ──────────────────────────────────────────────────────

const CATEGORIES: Array<ProjectCategory | 'All'> = [
  'All',
  'Education',
  'Healthcare',
  'Clean Water',
  'Livelihood',
  'Environment',
  'Disaster Relief',
];

const CATEGORY_COLORS: Record<string, string> = {
  Education: '#2d5a27',
  Healthcare: '#c0392b',
  'Clean Water': '#1a6ea8',
  Livelihood: '#8B6914',
  Environment: '#4a8c3f',
  'Disaster Relief': '#7c3aed',
};

// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({ project }: { project: Project }) {
  const color = CATEGORY_COLORS[project.category] ?? '#2d5a27';

  return (
    <article className="card p-0 overflow-hidden flex flex-col h-full hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-xl group">
      <div className="relative h-48 overflow-hidden rounded-t-[var(--radius)] flex-shrink-0">
        <OptimizedImage
          imageKey={project.image_slot}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          containerClassName="w-full h-full"
          fallbackAlt={project.project_name}
        />
        {/* Category badge */}
        <span
          className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full text-white shadow-sm"
          style={{ backgroundColor: color }}
        >
          {project.category}
        </span>
      </div>

      <div className="p-6 flex flex-col gap-3 flex-1">
        <h3 className="font-display font-bold text-lg leading-snug group-hover:text-[var(--color-primary)] transition-colors">
          {project.project_name}
        </h3>

        <p className="text-xs text-[var(--color-muted)] flex items-center gap-1 font-medium">
          <span aria-hidden="true">📍</span> {project.location}
        </p>

        <p className="text-sm text-[var(--color-muted)] leading-relaxed line-clamp-3 flex-1">
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
            <span>Goal: ₹{(project.budget / 100000).toFixed(1)} Lakhs</span>
            <span>Rem: ₹{((project.budget - project.raised) / 100000).toFixed(1)}L</span>
          </div>
        </div>

        <Link
          to={`/donate?project=${project.project_id}`}
          className="primary-button primary-button-sm w-full text-center mt-2"
          aria-label={`Donate to ${project.project_name}`}
        >
          Donate to this Project
        </Link>
      </div>
    </article>
  );
}

// ─── Projects Page ────────────────────────────────────────────────────────────

export default function Projects() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const blobY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = (searchParams.get('category') as ProjectCategory) ?? 'All';

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProjects()
      .then((data) => setProjects(data))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCategoryChange = (category: ProjectCategory | 'All') => {
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[60vh] flex items-center overflow-hidden pt-32 pb-16"
        aria-label="Projects hero"
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
            Verified Field Initiatives
          </motion.div>
          <TextAnimation
            text="Active Projects"
            tag="h1"
            variant="slide-up"
            gradientText
            className="font-display text-5xl md:text-7xl font-bold max-w-3xl leading-tight"
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 text-lg md:text-xl text-[var(--color-muted)] max-w-2xl leading-relaxed"
          >
            Explore our 8 sample projects across India's most climate-vulnerable and underserved regions.
            Every donation is logged to the MySQL audit database with zero dilution.
          </motion.p>
        </div>
      </section>

      {/* ── Filter & Projects Section ─────────────────────────────────────── */}
      <section aria-label="Projects listing" className="py-16 bg-[var(--color-bg)]">
        <div className="section-wrapper">
          {/* Category Filter Tabs */}
          <div
            className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 -mx-4 px-4 scrollbar-none"
            role="tablist"
            aria-label="Filter projects by category"
          >
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleCategoryChange(category)}
                  className={[
                    'px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 shrink-0 cursor-pointer',
                    isActive
                      ? 'bg-[var(--color-primary)] text-white shadow-md'
                      : 'bg-[var(--color-card)] text-[var(--color-muted)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-fg)]',
                  ].join(' ')}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" message="Loading projects from database…" />
            </div>
          )}

          {/* Error state */}
          {error && (
            <ErrorMessage
              message={error}
              retry={() => {
                setLoading(true);
                setError(null);
                getProjects()
                  .then(setProjects)
                  .catch((e: Error) => setError(e.message))
                  .finally(() => setLoading(false));
              }}
            />
          )}

          {/* Empty state */}
          {!loading && !error && filteredProjects.length === 0 && (
            <EmptyState
              title={`No projects in "${activeCategory}" yet`}
              message="New programmes are being prepared by our ground teams. Try choosing another category."
              actionLabel="View All Projects"
              onAction={() => handleCategoryChange('All')}
            />
          )}

          {/* Projects Grid */}
          {!loading && !error && filteredProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProjects.map((project, i) => (
                <ScrollReveal key={project.project_id} delay={i * 0.08}>
                  <ProjectCard project={project} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
