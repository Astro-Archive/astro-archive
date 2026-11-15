import React from 'react';
import arrowRight from './sci-fi-assets/arrow-right.svg?url';
import './SciFiTag.css';

/**
 * Sci-fi UI Kit (Free) — Tag
 * Figma: 4037:8 (ComponentSet "Tag")
 *
 * Variantes: Type × Size × Style × Stroke × On Dark
 *  - Type:   primary | neutral | error | warning | information | success
 *  - Size:   md (86×28) | lg (96×32)
 *  - Style:  cut-edge (esquinas biseladas 4px) | rectangle | rounded
 *  - Stroke: borde de 1px en el color del tipo
 *  - On Dark: fondo al 35% + texto blanco (si no, 5% + texto sólido)
 */
export default function SciFiTag({
  children,
  type = 'primary',
  size = 'md',
  shape = 'cut-edge',
  stroke = false,
  onDark = true,
  showArrow = true,
  className = '',
  ...props
}) {
  return (
    <span
      className={`sf-tag sf-tag--${size} sf-tag--${shape} ${className}`.trim()}
      data-type={type}
      data-stroke={stroke ? 'true' : 'false'}
      data-dark={onDark ? 'true' : 'false'}
      {...props}
    >
      <span className="sf-tag__square" aria-hidden="true" />
      <span className="sf-tag__label">{children}</span>
      {showArrow && (
        <span className="sf-tag__arrow" aria-hidden="true">
          <span className="sf-tag__arrow-icon" style={{ '--sf-mask': `url("${arrowRight}")` }} />
        </span>
      )}
      <span className="sf-tag__dashes" aria-hidden="true" />
    </span>
  );
}
