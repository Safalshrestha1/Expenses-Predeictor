import React from 'react';

const common = {
  width: 20,
  height: 20,
  viewBox: '0 0 20 20',
  fill: 'none',
  'aria-hidden': true,
};

export function WalletIcon() {
  return (
    <svg {...common}>
      <rect x="2" y="5" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2 8h16" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="14" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function TagIcon() {
  return (
    <svg {...common}>
      <path
        d="M9.2 2.5H4.5a2 2 0 0 0-2 2v4.7c0 .53.21 1.04.59 1.41l7.1 7.1a2 2 0 0 0 2.82 0l4.7-4.7a2 2 0 0 0 0-2.82l-7.1-7.1a2 2 0 0 0-1.41-.59Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="6.5" cy="6.5" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function TrendingIcon() {
  return (
    <svg {...common}>
      <path d="M2.5 14.5 8 9l3 3 6.5-6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 5.5h4v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChartIcon() {
  return (
    <svg {...common}>
      <path d="M3 3v13a1 1 0 0 0 1 1h13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <rect x="6" y="10" width="2.4" height="4.5" rx="0.6" fill="currentColor" />
      <rect x="10" y="7" width="2.4" height="7.5" rx="0.6" fill="currentColor" />
      <rect x="14" y="4.5" width="2.4" height="10" rx="0.6" fill="currentColor" />
    </svg>
  );
}

export function TargetIcon() {
  return (
    <svg {...common}>
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="10" cy="10" r="3.8" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="10" cy="10" r="1" fill="currentColor" />
    </svg>
  );
}

export function ReportIcon() {
  return (
    <svg {...common}>
      <rect x="4" y="2.5" width="12" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 7h6M7 10.2h6M7 13.4h3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
