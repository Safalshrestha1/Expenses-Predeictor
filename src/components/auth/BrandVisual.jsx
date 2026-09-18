import React from 'react';

/**
 * A restrained line-chart + floating card illustration used on the
 * brand side of the auth layout. Pure SVG, no external assets.
 */
export default function BrandVisual() {
  return (
    <svg
      width="360"
      height="220"
      viewBox="0 0 360 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration of an expense chart with a predicted spending trend"
    >
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e7c6b" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#0e7c6b" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* baseline grid */}
      <line x1="0" y1="170" x2="360" y2="170" stroke="#3a4358" strokeWidth="1" />
      <line x1="0" y1="120" x2="360" y2="120" stroke="#2e3750" strokeWidth="1" />
      <line x1="0" y1="70" x2="360" y2="70" stroke="#2e3750" strokeWidth="1" />

      {/* actual spend area */}
      <path
        d="M0 150 L40 140 L80 155 L120 118 L160 132 L200 96 V170 H0 Z"
        fill="url(#areaFill)"
      />
      <path
        d="M0 150 L40 140 L80 155 L120 118 L160 132 L200 96"
        stroke="#3fb6a1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* predicted trend, dashed */}
      <path
        d="M200 96 L240 84 L280 60 L320 66 L356 42"
        stroke="#a7ade0"
        strokeWidth="2"
        strokeDasharray="2 6"
        strokeLinecap="round"
      />
      <circle cx="200" cy="96" r="4" fill="#3fb6a1" />
      <circle cx="356" cy="42" r="4" fill="#a7ade0" />

      {/* floating expense card */}
      <g transform="translate(18,18)">
        <rect width="118" height="52" rx="10" fill="#242c40" stroke="#3a4358" />
        <text x="14" y="22" fill="#a7ade0" fontSize="9" fontFamily="IBM Plex Sans, sans-serif">
          This month
        </text>
        <text x="14" y="40" fill="#f4f2ec" fontSize="15" fontFamily="IBM Plex Mono, monospace">
          $2,184
        </text>
      </g>

      {/* floating prediction card */}
      <g transform="translate(226,140)">
        <rect width="128" height="52" rx="10" fill="#242c40" stroke="#3a4358" />
        <text x="14" y="22" fill="#a7ade0" fontSize="9" fontFamily="IBM Plex Sans, sans-serif">
          Predicted next
        </text>
        <text x="14" y="40" fill="#3fb6a1" fontSize="15" fontFamily="IBM Plex Mono, monospace">
          $1,960
        </text>
      </g>
    </svg>
  );
}
