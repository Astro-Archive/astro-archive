import React from 'react';
import tri6 from './sci-fi-assets/tri-6.svg?url';
import tri4 from './sci-fi-assets/tri-4.svg?url';
import tri3 from './sci-fi-assets/tri-3.svg?url';
import notch from './sci-fi-assets/notch-8x3.svg?url';
import wallMd from './sci-fi-assets/wall-md.svg?url';
import wallLg from './sci-fi-assets/wall-lg.svg?url';
import arrowRight from './sci-fi-assets/arrow-right.svg?url';
import frameRing from './sci-fi-assets/frame-ring.svg?url';
import frameKeystone from './sci-fi-assets/frame-keystone.svg?url';
import './SciFiButton.css';

/**
 * Pieza vectorial del kit. Se pinta como máscara para heredar --sf-fill,
 * así un mismo SVG sirve para default / hover / pressed / disabled.
 */
function Shape({ src, className = '', style }) {
  return (
    <span
      aria-hidden="true"
      className={`sf-shape ${className}`.trim()}
      style={{ '--sf-mask': `url("${src}")`, ...style }}
    />
  );
}

/** Contenido compartido: label + flecha del kit. */
function Content({ children, showArrow, icon }) {
  return (
    <>
      <span className="sf-label">{children}</span>
      {showArrow &&
        (icon ?? (
          <span className="sf-arrow" aria-hidden="true">
            <Shape src={arrowRight} className="sf-arrow-icon" />
          </span>
        ))}
    </>
  );
}

/**
 * Sci-fi UI Kit (Free) — Button
 *
 * Variantes (todas onDark):
 *  - primary      relleno sólido (Button/filled-*-on-dark)
 *  - secondary    contorno 1px (Button/stroke-*-on-dark)
 *  - single-stroke solo label + flecha + subrayado
 *  - transparent  solo label + flecha
 *
 * @param {'primary'|'secondary'|'single-stroke'|'transparent'} variant
 * @param {'md'|'lg'} size      Medium (32px) | Large (42px)
 * @param {boolean}   showArrow Muestra la flecha del kit
 * @param {ReactNode} icon      Reemplaza la flecha por un icono propio
 */
export default function SciFiButton({
  children,
  variant = 'primary',
  size = 'md',
  showArrow = true,
  icon = null,
  className = '',
  type = 'button',
  ...props
}) {
  const isLarge = size === 'lg';
  const content = (
    <Content showArrow={showArrow} icon={icon}>
      {children}
    </Content>
  );

  const classes = `sf-btn sf-btn--${variant} sf-btn--${size} ${className}`.trim();

  if (variant === 'secondary') {
    return (
      <button type={type} className={classes} {...props}>
        {/* Contorno en 3 tramos: las esquinas no se deforman al estirar el ancho */}
        <span className="sf-ring" aria-hidden="true">
          <i className="sf-ring-cap sf-ring-cap--l" style={{ '--sf-mask': `url("${frameRing}")` }} />
          <i className="sf-ring-cap sf-ring-cap--m" style={{ '--sf-mask': `url("${frameRing}")` }} />
          <i className="sf-ring-cap sf-ring-cap--r" style={{ '--sf-mask': `url("${frameRing}")` }} />
          <i className="sf-keystone" style={{ '--sf-mask': `url("${frameKeystone}")` }} />
        </span>
        <span className="sf-body-fill">{content}</span>
      </button>
    );
  }

  if (variant === 'single-stroke' || variant === 'transparent') {
    return (
      <button type={type} className={classes} {...props}>
        <span className="sf-body-fill">{content}</span>
        {variant === 'single-stroke' && <span className="sf-underline" aria-hidden="true" />}
      </button>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {/* Lateral izquierdo (el kit lo espeja en horizontal) */}
      <span className="sf-side sf-side--left" aria-hidden="true">
        <span className="sf-fill" />
        <Shape src={tri6} className="sf-flip-y" />
      </span>

      <span className="sf-body">
        {/* Borde superior: recorte central con laterales en diagonal */}
        <span className="sf-top" aria-hidden="true">
          <span className="sf-fill" />
          <Shape src={tri4} />
          <span className="sf-gap" />
          <span className="sf-flip">
            <Shape src={tri4} />
          </span>
          <span className="sf-fill" />
        </span>

        <span className="sf-body-fill">{content}</span>

        {/* Borde inferior: recorte central */}
        <span className="sf-bottom" aria-hidden="true">
          <span className="sf-fill" />
          <span className="sf-flip-y">
            <Shape src={tri3} />
          </span>
          <Shape src={notch} className="sf-notch" />
          <span className="sf-flip-y">
            <Shape src={tri3} />
          </span>
          <span className="sf-fill" />
        </span>
      </span>

      {/* Lateral derecho (el kit lo espeja en vertical) */}
      <span className="sf-side sf-side--right" aria-hidden="true">
        <Shape src={isLarge ? wallLg : wallMd} className="sf-wall" />
        <Shape src={tri6} className="sf-flip-y" />
      </span>
    </button>
  );
}
