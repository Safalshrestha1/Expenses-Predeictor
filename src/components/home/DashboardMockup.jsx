import React from 'react';

const STATS = [
  { label: 'Total income', value: 'Rs. 62,000', tone: 'neutral' },
  { label: 'Total expenses', value: 'Rs. 28,100', tone: 'neutral' },
  { label: 'Current balance', value: 'Rs. 33,900', tone: 'accent' },
  { label: 'Predicted next month', value: 'Rs. 30,400', tone: 'muted' },
];

const CATEGORIES = [
  { label: 'Food', percent: 32 },
  { label: 'Transport', percent: 18 },
  { label: 'Bills', percent: 24 },
  { label: 'Shopping', percent: 16 },
  { label: 'Other', percent: 10 },
];

const TRANSACTIONS = [
  { name: 'Grocery store', category: 'Food', amount: '– Rs. 1,240' },
  { name: 'Electricity bill', category: 'Bills', amount: '– Rs. 3,600' },
  { name: 'Salary', category: 'Income', amount: '+ Rs. 62,000' },
  { name: 'Bus pass', category: 'Transport', amount: '– Rs. 800' },
];

function MiniChart() {
  return (
    <svg viewBox="0 0 220 90" width="100%" height="90" role="img" aria-label="Monthly spending trend">
      <polyline
        points="0,64 32,58 64,68 96,44 128,50 160,30 192,36 220,18"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="192,36 220,18"
        fill="none"
        stroke="#a7ade0"
        strokeWidth="2.5"
        strokeDasharray="1 6"
        strokeLinecap="round"
      />
      <circle cx="192" cy="36" r="3.5" fill="var(--color-accent)" />
      <circle cx="220" cy="18" r="3.5" fill="#a7ade0" />
    </svg>
  );
}

/**
 * A stylized dashboard preview — not the real Dashboard page, just a
 * visual mockup used to connect the marketing Home page to the app.
 *
 * @param {'compact'|'full'} variant - compact is used in the hero, full in the dedicated preview section
 */
export default function DashboardMockup({ variant = 'compact' }) {
  const isFull = variant === 'full';

  return (
    <div className={`dash-mock ${isFull ? 'dash-mock--full' : 'dash-mock--compact'}`}>
      <div className="dash-mock__chrome">
        <span className="dash-mock__dot" />
        <span className="dash-mock__dot" />
        <span className="dash-mock__dot" />
        <span className="dash-mock__chrome-title">Dashboard overview</span>
      </div>

      <div className="dash-mock__stats">
        {STATS.map((stat) => (
          <div key={stat.label} className={`dash-mock__stat dash-mock__stat--${stat.tone}`}>
            <span className="dash-mock__stat-label">{stat.label}</span>
            <span className="dash-mock__stat-value">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="dash-mock__row">
        <div className="dash-mock__panel dash-mock__panel--chart">
          <span className="dash-mock__panel-title">Spending trend</span>
          <MiniChart />
        </div>

        <div className="dash-mock__panel dash-mock__panel--categories">
          <span className="dash-mock__panel-title">By category</span>
          <div className="dash-mock__categories">
            {CATEGORIES.map((cat) => (
              <div key={cat.label} className="dash-mock__category">
                <div className="dash-mock__category-labels">
                  <span>{cat.label}</span>
                  <span>{cat.percent}%</span>
                </div>
                <div className="dash-mock__category-track">
                  <div className="dash-mock__category-fill" style={{ width: `${cat.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isFull && (
        <div className="dash-mock__panel dash-mock__panel--transactions">
          <span className="dash-mock__panel-title">Recent transactions</span>
          <ul className="dash-mock__transactions">
            {TRANSACTIONS.map((tx) => (
              <li key={tx.name}>
                <div>
                  <span className="dash-mock__tx-name">{tx.name}</span>
                  <span className="dash-mock__tx-category">{tx.category}</span>
                </div>
                <span className={tx.amount.startsWith('+') ? 'dash-mock__tx-amount--positive' : 'dash-mock__tx-amount'}>
                  {tx.amount}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
