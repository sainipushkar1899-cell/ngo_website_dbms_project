/* ─────────────────────────────────────────────────────────────────────────────
   OptimizedImage.tsx — Reusable performant image component
   Loads local WebP assets with explicit dimensions, lazy loading,
   layout-shift prevention, and dignified photography aesthetics.
   ───────────────────────────────────────────────────────────────────────────── */

import React, { useState } from 'react';
import { getImage } from '../config/images';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  imageKey?: string;
  fallbackAlt?: string;
  containerClassName?: string;
}

export function OptimizedImage({
  imageKey,
  src: propSrc,
  alt: propAlt,
  width: propWidth,
  height: propHeight,
  className = '',
  containerClassName = '',
  fallbackAlt = 'Aadhara Foundation initiative',
  ...rest
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const asset = imageKey ? getImage(imageKey, fallbackAlt) : null;
  const src = propSrc || asset?.src || '/images/hero.webp';
  const alt = propAlt || asset?.alt || fallbackAlt;
  const width = propWidth || asset?.width || 800;
  const height = propHeight || asset?.height || 600;

  return (
    <div
      className={`relative overflow-hidden bg-[color-mix(in_srgb,var(--color-fg)_4%,transparent)] ${containerClassName}`}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setHasError(true)}
        className={[
          'transition-all duration-500 ease-out object-cover',
          loaded ? 'opacity-100 scale-100 filter-none' : 'opacity-0 scale-[1.02] blur-sm',
          className,
        ].join(' ')}
        {...rest}
      />
      {!loaded && !hasError && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/5 via-black/10 to-black/5 animate-pulse"
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export default OptimizedImage;
