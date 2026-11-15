import React from 'react';
import './SciFiSearch.css';

/**
 * Sci-fi UI Kit (Free) — Search bar
 * Figma: 1:22 (ComponentSet "Search Button": Minimised 68×32 / Expanded 601×32)
 *
 * Compone el Text field del kit (borde #A3A3A3, icono a la izquierda) con un
 * botón oscuro "SEARCH" pegado a la derecha.
 */
export default function SciFiSearch({
  placeholder = 'Type somthing...',
  buttonLabel = 'SEARCH',
  onSearch,
  value,
  onChange,
  icon = null,
  micIcon = null,
  className = '',
  ...props
}) {
  return (
    <form
      className={`sf-search ${className}`.trim()}
      onSubmit={(e) => {
        e.preventDefault();
        onSearch?.(value);
      }}
      {...props}
    >
      <span className="sf-search__field">
        {icon && <span className="sf-search__icon">{icon}</span>}
        <input
          className="sf-search__input"
          type="search"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-label={placeholder}
        />
        {micIcon && <span className="sf-search__icon sf-search__icon--end">{micIcon}</span>}
      </span>

      <button type="submit" className="sf-search__button">
        {buttonLabel}
      </button>
    </form>
  );
}
