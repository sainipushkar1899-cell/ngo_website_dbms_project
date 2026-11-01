import { useEffect, useState, type ElementType } from 'react';
import { motion } from 'motion/react';

type Variant = 'slide-up' | 'fade-blur' | 'fade';
type Tag = 'h1' | 'h2' | 'h3' | 'h4' | 'p';

interface TextAnimationProps {
  text: string;
  tag?: Tag;
  variant?: Variant;
  className?: string;
  gradientText?: boolean;
}

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

function getWordVariants(variant: Variant) {
  switch (variant) {
    case 'slide-up':
      return {
        hidden: { y: '50%', opacity: 0 },
        visible: {
          y: '0%',
          opacity: 1,
          transition: { duration: 0.6, ease: EASE },
        },
      };
    case 'fade-blur':
      return {
        hidden: { opacity: 0, filter: 'blur(10px)' },
        visible: {
          opacity: 1,
          filter: 'blur(0px)',
          transition: { duration: 0.6, ease: EASE },
        },
      };
    case 'fade':
      return {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: 0.6, ease: EASE },
        },
      };
  }
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

export function TextAnimation({
  text,
  tag: Tag = 'h2',
  variant = 'slide-up',
  className = '',
  gradientText = false,
}: TextAnimationProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const gradientClass = gradientText
    ? 'bg-gradient-to-r from-[var(--color-fg)] to-[var(--color-primary)] bg-clip-text text-transparent'
    : '';

  const combinedClass = [className, gradientClass].filter(Boolean).join(' ');

  if (reducedMotion) {
    const PlainTag = Tag as ElementType;
    return <PlainTag className={combinedClass}>{text}</PlainTag>;
  }

  const words = text.split(' ');
  const wordVariants = getWordVariants(variant);

  // motion.h1, motion.h2, etc. — cast via as any for dynamic tag
  const MotionTag = motion[Tag as keyof typeof motion] as typeof motion.div;

  return (
    <MotionTag
      className={combinedClass}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-20%' }}
      variants={containerVariants}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden"
          aria-hidden="true"
        >
          <motion.span
            className="inline-block"
            variants={wordVariants}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

export default TextAnimation;
