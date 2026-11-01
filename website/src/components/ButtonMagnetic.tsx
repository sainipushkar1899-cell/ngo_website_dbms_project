import { useRef, type ReactNode, type MouseEvent } from 'react';
import { motion, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';

type AsType = 'button' | 'a' | 'link';

interface ButtonMagneticProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  as?: AsType;
}

const springConfig = { stiffness: 150, damping: 15 };

export function ButtonMagnetic({
  children,
  className = '',
  onClick,
  href,
  as: asProp = 'button',
}: ButtonMagneticProps) {
  const ref = useRef<HTMLElement>(null);
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const isDesktop = () =>
    typeof window !== 'undefined' && window.innerWidth >= 768;

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!isDesktop() || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };


  if (asProp === 'link' && href) {
    return (
      <motion.div
        style={{ x, y, display: 'inline-block' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Link to={href} className={className} onClick={onClick}>
          {children}
        </Link>
      </motion.div>
    );
  }

  if (asProp === 'a' && href) {
    return (
      <motion.a
        ref={ref as unknown as React.Ref<HTMLAnchorElement>}
        style={{ x, y }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={className}
        href={href}
        onClick={onClick}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as unknown as React.Ref<HTMLButtonElement>}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      onClick={onClick}
      type="button"
    >
      {children}
    </motion.button>
  );
}

export default ButtonMagnetic;
