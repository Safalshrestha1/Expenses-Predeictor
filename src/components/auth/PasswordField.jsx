import React, { useId, useState } from 'react';
import FormError from './FormError.jsx';

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function EyeIcon({ hidden }) {
  return hidden ? (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M2.5 9C3.8 6 6.2 4.3 9 4.3s5.2 1.7 6.5 4.7c-1.3 3-3.7 4.7-6.5 4.7S3.8 12 2.5 9Z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle cx="9" cy="9" r="2.1" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M2.5 9C3.8 6 6.2 4.3 9 4.3s5.2 1.7 6.5 4.7c-1.3 3-3.7 4.7-6.5 4.7S3.8 12 2.5 9Z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle cx="9" cy="9" r="2.1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M3 3.5L15 14.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Password input with a show/hide toggle. Pass `children` to render
 * a strength meter or other helper content beneath the field.
 */
export default function PasswordField({ id, label, error, value, onChange, autoComplete, children }) {
  const [visible, setVisible] = useState(false);
  const toggleId = useId();
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="field-control">
        <span className="field-control__icon">
          <LockIcon />
        </span>
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          placeholder="••••••••"
        />
        <button
          type="button"
          className="field-control__toggle"
          onClick={() => setVisible((v) => !v)}
          aria-pressed={visible}
          aria-controls={id}
          aria-label={visible ? 'Hide password' : 'Show password'}
          id={toggleId}
        >
          <EyeIcon hidden={visible} />
        </button>
      </div>
      {children}
      <FormError id={errorId}>{error}</FormError>
    </div>
  );
}
