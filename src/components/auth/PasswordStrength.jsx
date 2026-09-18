import React from 'react';
import { getPasswordStrength } from '../../utils/auth.js';

/**
 * Four-segment strength meter driven by getPasswordStrength().
 * Renders nothing until the user starts typing a password.
 */
export default function PasswordStrength({ password }) {
  if (!password) return null;

  const { score, label } = getPasswordStrength(password);
  const segments = [0, 1, 2, 3];

  return (
    <div className="password-strength" aria-live="polite">
      <div className="password-strength__bars">
        {segments.map((segment) => (
          <span
            key={segment}
            className={
              segment < score
                ? `password-strength__bar password-strength__bar--filled-${score - 1}`
                : 'password-strength__bar'
            }
          />
        ))}
      </div>
      <span className="password-strength__label">Password strength: {label}</span>
    </div>
  );
}
