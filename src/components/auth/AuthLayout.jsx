import React from 'react';
import './auth.css';

function MarkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 12L6 7L9 9.5L14 3.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.3" opacity="0.35" />
      <path d="M5 8.2L7.1 10.3L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Two-column authentication shell shared by Login and Signup.
 *
 * @param {string} heading - Left panel headline
 * @param {string} description - Left panel supporting copy
 * @param {string[]} [benefits] - Optional checklist shown under the description
 * @param {React.ReactNode} visual - Illustration rendered in the left panel
 * @param {React.ReactNode} children - The auth card (right panel content)
 */
export default function AuthLayout({ heading, description, benefits, visual, children }) {
  return (
    <div className="auth-shell">
      <section className="auth-shell__brand" aria-hidden="false">
        <div className="brand-mark">
          <span className="brand-mark__mark">
            <MarkIcon />
          </span>
          Expenses Predictor
        </div>

        <div className="brand-copy">
          <h1>{heading}</h1>
          <p>{description}</p>

          {benefits && benefits.length > 0 && (
            <ul className="brand-benefits">
              {benefits.map((item) => (
                <li key={item}>
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="brand-visual">{visual}</div>
        </div>

        <p className="brand-footnote">© {new Date().getFullYear()} Expenses Predictor</p>
      </section>

      <section className="auth-shell__form-side">{children}</section>
    </div>
  );
}
