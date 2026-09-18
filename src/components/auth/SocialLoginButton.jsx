import React from 'react';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.6 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.66-3.87 2.66-6.62Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.95 10.7a5.4 5.4 0 0 1 0-3.4V4.97H.96a9 9 0 0 0 0 8.06l2.99-2.33Z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.42 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M9 0a9 9 0 0 0-2.85 17.54c.45.08.62-.2.62-.44v-1.7c-2.5.55-3.03-1.06-3.03-1.06-.41-1.04-1-1.32-1-1.32-.82-.56.06-.55.06-.55.9.06 1.38.93 1.38.93.8 1.38 2.11.98 2.63.75.08-.58.32-.98.57-1.2-2-.23-4.1-1-4.1-4.45 0-.98.35-1.79.92-2.42-.09-.23-.4-1.15.09-2.4 0 0 .76-.24 2.47.92a8.5 8.5 0 0 1 4.5 0c1.7-1.16 2.46-.92 2.46-.92.5 1.25.18 2.17.1 2.4.57.63.92 1.44.92 2.42 0 3.46-2.11 4.22-4.12 4.44.33.29.62.85.62 1.72v2.55c0 .25.17.53.63.44A9 9 0 0 0 9 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

const ICONS = {
  google: GoogleIcon,
  github: GitHubIcon,
};

const LABELS = {
  google: 'Continue with Google',
  github: 'Continue with GitHub',
};

const LOADING_LABELS = {
  google: 'Connecting to Google…',
  github: 'Connecting to GitHub…',
};

/**
 * Social auth button. `provider` selects the icon and default label.
 * Pass `loading` to show a spinner + "Connecting…" state, and
 * `disabled` to block clicks (e.g. while another submit is in flight).
 */
export default function SocialLoginButton({ provider, onClick, loading = false, disabled = false }) {
  const Icon = ICONS[provider];

  return (
    <button type="button" className="btn-social" onClick={onClick} disabled={disabled || loading}>
      {loading ? <span className="spinner spinner--dark" aria-hidden="true" /> : <Icon />}
      {loading ? LOADING_LABELS[provider] : LABELS[provider]}
    </button>
  );
}
