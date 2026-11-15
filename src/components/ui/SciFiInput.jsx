import React, { useId } from 'react';
import './SciFiInput.css';

/**
 * Sci-fi UI Kit (Free) — Text field
 * Figma: 1:7 (ComponentSet "Text field")
 *
 * Estados: default | focus | active | hover | error | disable
 * Tamaños: md (32px de alto) | lg (42px)
 *
 * Colores del kit: borde #A3A3A3, focus #000, error #E6004C,
 * título #171717 (disabled #D4D4D4), placeholder/ayuda #A3A3A3.
 */
export default function SciFiInput({
  label,
  hint,
  error,
  state = 'default',
  size = 'md',
  required = false,
  icon = null,
  id,
  className = '',
  ...props
}) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const isError = state === 'error' || Boolean(error);
  const isDisabled = state === 'disable' || props.disabled;

  return (
    <div
      className={`sf-field sf-field--${size} ${className}`.trim()}
      data-state={isDisabled ? 'disable' : isError ? 'error' : state}
    >
      {label && (
        <label className="sf-field__title" htmlFor={inputId}>
          {label}
          {required && <span className="sf-field__required">*</span>}
        </label>
      )}

      <span className="sf-field__box">
        {icon && <span className="sf-field__icon">{icon}</span>}
        <input
          id={inputId}
          className="sf-field__input"
          disabled={isDisabled}
          aria-invalid={isError || undefined}
          {...props}
        />
      </span>

      {(error || hint) && (
        <span className="sf-field__hint">{error || hint}</span>
      )}
    </div>
  );
}
