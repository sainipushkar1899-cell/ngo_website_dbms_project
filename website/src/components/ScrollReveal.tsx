import { useEffect, useState, type ReactNode } from 'react';
import { motion } from 'motion/react';

type Variant = 'slide-up' | 'fade' | 'fade-blur';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  variant?: Variant;
  className?: string;
}

function getVariants(variant: Variant) {
  switch (variant) {
    case 'slide-up':
      return {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      };
    case 'fade':
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };
    case 'fade-blur':
      return {
        hidden: { opacity: 0, filter: 'blur(10px)' },
        visible: { opacity: 1, filter: 'blur(0px)' },
      };
  }
}

export function ScrollReveal({
  children,
  delay = 0,
  variant = 'slide-up',
  className,
}: ScrollRevealProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const variants = getVariants(variant);

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-20%' }}
      variants={variants}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export default ScrollReveal;
