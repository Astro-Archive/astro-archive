import React from 'react';
import './SciFiLoader.css';

/** Tamaños del kit: [lado en px, grosor de barra] */
const SIZES = {
  xs: [8, 1],
  sm: [16, 2],
  md: [20, 2],
  lg: [24, 2],
  xl: [32, 3],
  '2xl': [40, 4],
};

const DIRECTION = { top: 0, right: 90, bottom: 180, left: 270 };

/**
 * Sci-fi UI Kit (Free) — Loader
 * Figma: 1:21 (ComponentSet "Icon Loader" / "Text Loader")
 *
 * 8 barras radiales con opacidad decreciente, girando en 8 pasos.
 *
 * @param {'xs'|'sm'|'md'|'lg'|'xl'|'2xl'} size
 * @param {'top'|'right'|'bottom'|'left'} direction  Pose inicial
 * @param {string} label  Texto opcional al lado (Text Loader)
 */
export default function SciFiLoader({
  size = 'md',
  direction = 'top',
  label,
  className = '',
  ...props
}) {
  const [side, bar] = SIZES[size] ?? SIZES.md;

  return (
    <span
      className={`sf-loader-wrap ${className}`.trim()}
      role="status"
      aria-live="polite"
      {...props}
    >
      <span
        className="sf-loader"
        aria-hidden="true"
        style={{
          '--sf-size': `${side}px`,
          '--sf-bar': `${bar}px`,
          '--sf-dir': `${DIRECTION[direction] ?? 0}deg`,
        }}
      >
        {Array.from({ length: 8 }, (_, i) => (
          <i key={i} style={{ '--i': String(i), opacity: 1 - i * 0.11 }} />
        ))}
      </span>
      {label && <span className="sf-loader__label">{label}</span>}
    </span>
  );
}
