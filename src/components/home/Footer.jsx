import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer" id="about">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <span className="site-footer__title">Expenses Predictor</span>
          <p>A simple way to track your spending and see what's coming next.</p>
        </div>

        <div className="site-footer__columns">
          <div className="site-footer__col">
            <span className="site-footer__heading">Product</span>
            <Link to="/">Home</Link>
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#about">About</a>
          </div>

          <div className="site-footer__col">
            <span className="site-footer__heading">Account</span>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign up</Link>
          </div>

          <div className="site-footer__col">
            <span className="site-footer__heading">Legal</span>
            <a href="#privacy">Privacy policy</a>
            <a href="#terms">Terms of service</a>
          </div>
        </div>
      </div>

      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} Expenses Predictor. All rights reserved.</span>
      </div>
    </footer>
  );
}
