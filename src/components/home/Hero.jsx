import React from 'react';
import { Link } from 'react-router-dom';
import DashboardMockup from './DashboardMockup.jsx';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__inner">
        <div className="hero__copy">
          <h1>Understand your expenses. Predict your future.</h1>
          <p>
            Expenses Predictor helps you track everyday spending, see the patterns behind it, and get a clear
            picture of what your finances will look like next month — not just this one.
          </p>
          <div className="hero__actions">
            <Link to="/signup" className="btn-primary">
              Get started
            </Link>
            <Link to="/login" className="btn-outline">
              Login
            </Link>
          </div>
        </div>

        <div className="hero__visual">
          <DashboardMockup variant="compact" />
        </div>
      </div>
    </section>
  );
}
