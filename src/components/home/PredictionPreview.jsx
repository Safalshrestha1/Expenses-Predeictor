import React from 'react';

const HISTORY = [
  { label: 'Jan', amount: 21500 },
  { label: 'Feb', amount: 24200 },
  { label: 'Mar', amount: 26800 },
  { label: 'Apr', amount: 28100 },
];

const PREDICTED = { label: 'May', amount: 30400 };

const MAX = 32000;
const CHART_HEIGHT = 160;

function formatRs(amount) {
  return `Rs. ${amount.toLocaleString('en-IN')}`;
}

export default function PredictionPreview() {
  const bars = [...HISTORY, { ...PREDICTED, predicted: true }];

  return (
    <section className="prediction">
      <div className="prediction__inner">
        <div className="prediction__copy">
          <h2>See where your spending is going</h2>
          <p>
            Expenses Predictor looks at your last few months of spending and estimates what's likely to come
            next — so you can plan ahead instead of being surprised.
          </p>
          <p className="prediction__note">
            <strong>May — {formatRs(PREDICTED.amount)}</strong> is an estimate based on your spending pattern
            from January through April, not a guarantee.
          </p>
        </div>

        <div className="prediction__chart" role="img" aria-label="Monthly expenses from January to April, with a predicted estimate for May">
          <div className="prediction__bars">
            {bars.map((bar) => (
              <div className="prediction__bar-col" key={bar.label}>
                <span className="prediction__bar-value">{formatRs(bar.amount)}</span>
                <div
                  className={`prediction__bar ${bar.predicted ? 'prediction__bar--predicted' : ''}`}
                  style={{ height: `${(bar.amount / MAX) * CHART_HEIGHT}px` }}
                />
                <span className="prediction__bar-label">
                  {bar.label}
                  {bar.predicted && <span className="prediction__bar-tag">Estimate</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
