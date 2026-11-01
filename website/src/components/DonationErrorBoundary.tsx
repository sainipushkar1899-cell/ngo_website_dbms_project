/* ─────────────────────────────────────────────────────────────────────────────
   DonationErrorBoundary.tsx — Catches unexpected rendering errors in the donation flow.
   Provides a human-friendly fallback UI with recovery actions.
   ───────────────────────────────────────────────────────────────────────────── */

import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class DonationErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error cleanly for debugging
    console.error("DonationErrorBoundary caught:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="section-wrapper py-24 flex items-center justify-center min-h-[60vh]">
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-8 md:p-12 max-w-lg w-full text-center shadow-lg">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 mx-auto flex items-center justify-center text-3xl mb-6">
              ⚠️
            </div>
            <h2 className="text-2xl font-serif text-[var(--color-fg)] mb-3">
              Something went wrong
            </h2>
            <p className="text-[var(--color-muted)] text-sm mb-6 leading-relaxed">
              {this.props.fallbackMessage ||
                this.state.error?.message ||
                "An unexpected error occurred in the donation process. Your funds have not been debited."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[var(--color-primary)] text-white font-medium text-sm transition-transform active:scale-95 cursor-pointer"
              >
                Try Again
              </button>
              <Link
                to="/donate"
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-[var(--color-border)] text-[var(--color-fg)] font-medium text-sm hover:bg-[var(--color-secondary)] transition-colors text-center"
              >
                Restart Donation
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default DonationErrorBoundary;
