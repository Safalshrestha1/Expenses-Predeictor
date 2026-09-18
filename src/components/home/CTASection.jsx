import React from 'react';
import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="cta">
      <div className="cta__inner">
        <h2>Ready to understand your expenses?</h2>
        <p>Start tracking your spending and discover what your future expenses could look like.</p>
        <div className="cta__actions">
          <Link to="/signup" className="btn-primary">
            Get started
          </Link>
          <Link to="/login" className="btn-outline btn-outline--on-ink">
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}
