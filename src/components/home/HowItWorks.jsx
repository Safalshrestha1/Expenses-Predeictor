import React from 'react';

const STEPS = [
  {
    number: '01',
    title: 'Track',
    description: 'Add your income and expenses as they happen.',
  },
  {
    number: '02',
    title: 'Analyze',
    description: 'See where your money goes and understand your spending patterns.',
  },
  {
    number: '03',
    title: 'Predict',
    description: 'Get an estimate of what your expenses will look like next month.',
  },
];

export default function HowItWorks() {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="how-it-works__inner">
        <h2>How it works</h2>
        <div className="how-it-works__steps">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="step">
                <span className="step__number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              {index < STEPS.length - 1 && <span className="step__connector" aria-hidden="true" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
