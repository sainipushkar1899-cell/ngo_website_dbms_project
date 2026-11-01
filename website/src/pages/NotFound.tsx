/* ─────────────────────────────────────────────────────────────────────────────
   NotFound Page — 404
   ───────────────────────────────────────────────────────────────────────────── */

import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center text-center px-4 gap-6"
      aria-label="Page not found"
    >
      {/* Decorative blobs */}
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Emoji illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
          className="text-7xl select-none"
          role="img"
          aria-label="Navigation compass emoji"
        >
          🧭
        </motion.div>

        {/* 404 heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-8xl md:text-9xl font-bold gradient-text"
          aria-label="404 — page not found"
        >
          404
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center gap-2"
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold">Page not found</h2>
          <p className="text-[var(--color-muted)] max-w-md">
            Looks like this page has wandered off. Let's get you back on track.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            to="/"
            className="primary-button primary-button-lg"
            aria-label="Return to homepage"
          >
            ← Go Home
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
