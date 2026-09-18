import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'About', href: '#about' },
];

function MenuIcon({ open }) {
  return open ? (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M5 5L17 17M17 5L5 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M3.5 6.5H18.5M3.5 11H18.5M3.5 15.5H18.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Site navbar for the public Home page. Home links to "/", the other
 * items scroll to sections within the page. Login / Get Started route
 * to the existing auth pages.
 */
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" onClick={() => setMenuOpen(false)}>
          Expenses Predictor
        </Link>

        <nav className="navbar__links" aria-label="Primary">
          {NAV_LINKS.map((link) =>
            link.href.startsWith('/') ? (
              <Link key={link.label} to={link.href} className="navbar__link">
                {link.label}
              </Link>
            ) : (
              <a key={link.label} href={link.href} className="navbar__link">
                {link.label}
              </a>
            )
          )}
        </nav>

        <div className="navbar__actions">
          <Link to="/login" className="link-muted navbar__login">
            Login
          </Link>
          <Link to="/signup" className="btn-primary navbar__cta">
            Get Started
          </Link>
        </div>

        <button
          type="button"
          className="navbar__toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <MenuIcon open={menuOpen} />
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" className="navbar__mobile" aria-label="Mobile">
          {NAV_LINKS.map((link) =>
            link.href.startsWith('/') ? (
              <Link key={link.label} to={link.href} className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ) : (
              <a key={link.label} href={link.href} className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            )
          )}
          <div className="navbar__mobile-actions">
            <Link to="/login" className="btn-outline btn-outline--block" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <Link to="/signup" className="btn-primary btn-primary--block" onClick={() => setMenuOpen(false)}>
              Get Started
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
