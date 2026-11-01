/* ─────────────────────────────────────────────────────────────────────────────
   Step1Project.tsx — Choose a Project
   Fed by getProjectsForDonation() with budget, raised, remaining & percent funded.
   Supports ?project=ID preselection and clear disabled state for fully funded projects.
   ───────────────────────────────────────────────────────────────────────────── */

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { getProjectsForDonation, type ProjectForDonation } from "../../api";
import { CATEGORY_META, formatINR } from "../../mock/donation";
import { LoadingSpinner } from "../../components";

interface Step1ProjectProps {
  selectedProject: ProjectForDonation | null;
  onSelectProject: (project: ProjectForDonation) => void;
  onNext: () => void;
  preselectedId?: number | null;
}

export function Step1Project({
  selectedProject,
  onSelectProject,
  onNext,
  preselectedId,
}: Step1ProjectProps) {
  const [projects, setProjects] = useState<ProjectForDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getProjectsForDonation()
      .then((data) => {
        if (!mounted) return;
        setProjects(data);

        // Preselect from URL if matching and not fully funded
        if (preselectedId) {
          const match = data.find((p) => p.project_id === preselectedId);
          if (match && match.remaining > 0) {
            onSelectProject(match);
          }
        }
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load projects.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [preselectedId]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="mt-4 text-sm text-[var(--color-muted)]">
          Loading vetted active causes...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center">
        <p className="text-red-800 text-sm font-medium">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-3 px-4 py-2 bg-red-800 text-white text-xs rounded-full cursor-pointer hover:bg-red-900"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="text-center max-w-xl mx-auto">
        <span className="section-label">Step 1 of 5</span>
        <h2 className="text-2xl md:text-3xl font-serif text-[var(--color-fg)] mt-1 mb-2">
          Select a project to support
        </h2>
        <p className="text-sm text-[var(--color-muted)]">
          Every contribution goes directly toward certified, audited milestones.
          Select where your impact begins.
        </p>
      </div>

      {/* Projects Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5"
        role="radiogroup"
        aria-label="Available projects for donation"
      >
        {projects.map((project) => {
          const isSelected = selectedProject?.project_id === project.project_id;
          const isFullyFunded = project.remaining <= 0;
          const meta = CATEGORY_META[project.category] || {
            emoji: "✨",
            color: "#2d5a27",
            bg: "#f0f7ee",
          };

          return (
            <motion.div
              key={project.project_id}
              whileHover={!isFullyFunded ? { y: -3 } : undefined}
              transition={{ duration: 0.2 }}
              onClick={() => {
                if (!isFullyFunded) {
                  onSelectProject(project);
                }
              }}
              role="radio"
              aria-checked={isSelected}
              aria-disabled={isFullyFunded}
              tabIndex={isFullyFunded ? -1 : 0}
              onKeyDown={(e) => {
                if (!isFullyFunded && (e.key === " " || e.key === "Enter")) {
                  e.preventDefault();
                  onSelectProject(project);
                }
              }}
              className={`relative rounded-2xl p-6 border-2 transition-all duration-200 cursor-pointer text-left select-none ${
                isFullyFunded
                  ? "bg-stone-50 border-stone-200 opacity-60 cursor-not-allowed"
                  : isSelected
                  ? "bg-white border-[var(--color-primary)] shadow-lg ring-2 ring-[var(--color-primary)]/20"
                  : "bg-white border-[var(--color-border)] hover:border-stone-400 hover:shadow-md"
              }`}
            >
              {/* Category Badge & Status */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: meta.bg, color: meta.color }}
                >
                  <span>{meta.emoji}</span>
                  <span>{project.category}</span>
                </span>

                {isFullyFunded ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                    Fully funded
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-[var(--color-primary)]">
                    {project.percent_funded}% funded
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="font-serif text-lg font-bold text-[var(--color-fg)] mb-3 leading-snug line-clamp-2">
                {project.project_name}
              </h3>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, project.percent_funded)}%`,
                    backgroundColor: isFullyFunded
                      ? "#d97706"
                      : "var(--color-primary)",
                  }}
                />
              </div>

              {/* Budget Metrics */}
              <div className="grid grid-cols-3 gap-2 text-xs pt-3 border-t border-[var(--color-border)]">
                <div>
                  <span className="block text-[var(--color-muted)] text-[10px] uppercase font-semibold">
                    Target
                  </span>
                  <span className="font-semibold text-stone-800">
                    {formatINR(project.budget)}
                  </span>
                </div>
                <div>
                  <span className="block text-[var(--color-muted)] text-[10px] uppercase font-semibold">
                    Raised
                  </span>
                  <span className="font-semibold text-stone-800">
                    {formatINR(project.raised)}
                  </span>
                </div>
                <div>
                  <span className="block text-[var(--color-muted)] text-[10px] uppercase font-semibold">
                    Remaining
                  </span>
                  <span
                    className={`font-semibold ${
                      isFullyFunded
                        ? "text-stone-400"
                        : "text-[var(--color-primary)]"
                    }`}
                  >
                    {isFullyFunded ? "₹0" : formatINR(project.remaining)}
                  </span>
                </div>
              </div>

              {/* Selection Radio Circle Indicator */}
              <div
                className={`absolute top-5 right-5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isFullyFunded
                    ? "border-stone-300 bg-stone-100"
                    : isSelected
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                    : "border-stone-300 bg-white"
                }`}
              >
                {isSelected && (
                  <svg
                    className="w-3 h-3 stroke-[3]"
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
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action footer */}
      <div className="flex items-center justify-end pt-4">
        <button
          type="button"
          disabled={!selectedProject || selectedProject.remaining <= 0}
          onClick={onNext}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-full font-medium text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${
            selectedProject && selectedProject.remaining > 0
              ? "bg-[var(--color-primary)] text-white hover:opacity-95"
              : "bg-stone-200 text-stone-400 cursor-not-allowed shadow-none"
          }`}
        >
          <span>Continue to Amount</span>
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
    </div>
  );
}

export default Step1Project;
