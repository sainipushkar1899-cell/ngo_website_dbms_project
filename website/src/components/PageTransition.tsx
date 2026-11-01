import { type ReactNode, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Hook that returns a stable key that changes on route change.
 * Use as the key for AnimatePresence children.
 */
export function usePageTransition() {
  const location = useLocation();
  const [key, setKey] = useState(location.pathname);

  useEffect(() => {
    setKey(location.pathname + location.search);
  }, [location.pathname, location.search]);

  return { key };
}

/**
 * Wrap your route outlet or page component with this to get
 * fade + subtle slide-up transitions on every route change.
 *
 * Usage in App.tsx:
 *   <PageTransition>
 *     <Outlet />
 *   </PageTransition>
 */
export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname + location.search}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        // Ensure the wrapper doesn't clip or constrain layout
        style={{ width: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default PageTransition;
