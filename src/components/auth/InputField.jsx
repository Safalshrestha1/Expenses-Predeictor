import React from 'react';
import FormError from './FormError.jsx';

/**
 * Labeled text input with a leading icon and inline validation message.
 * Used for anything that isn't a password field (email, name, etc).
 */
export default function InputField({
  id,
  label,
  icon,
  error,
  type = 'text',
  ...inputProps
}) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="field-control">
        <span className="field-control__icon">{icon}</span>
        <input
          id={id}
          type={type}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          {...inputProps}
        />
      </div>
      <FormError id={errorId}>{error}</FormError>
    </div>
  );
}
