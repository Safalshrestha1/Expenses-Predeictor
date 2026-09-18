import React from 'react';

/**
 * Inline field-level error message. Rendered below the relevant input
 * and referenced via aria-describedby for screen readers.
 */
export default function FormError({ id, children }) {
  if (!children) return null;

  return (
    <p className="field-error" id={id} role="alert">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="6.25" stroke="currentColor" strokeWidth="1.3" />
        <path d="M7 4v3.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="7" cy="9.6" r="0.9" fill="currentColor" />
      </svg>
      <span>{children}</span>
    </p>
  );
}
