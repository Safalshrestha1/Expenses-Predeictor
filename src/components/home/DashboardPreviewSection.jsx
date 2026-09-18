import React from 'react';
import { Link } from 'react-router-dom';
import DashboardMockup from './DashboardMockup.jsx';

export default function DashboardPreviewSection() {
  return (
    <section className="dashboard-preview">
      <div className="dashboard-preview__inner">
        <div className="dashboard-preview__copy">
          <h2>Your whole financial picture, in one dashboard</h2>
          <p>
            Once you're signed in, everything you've tracked comes together — income, expenses, balance, and
            predictions, updated as you go.
          </p>
          <Link to="/login" className="btn-primary">
            Explore your dashboard
          </Link>
        </div>

        <div className="dashboard-preview__visual">
          <DashboardMockup variant="full" />
        </div>
      </div>
    </section>
  );
}
