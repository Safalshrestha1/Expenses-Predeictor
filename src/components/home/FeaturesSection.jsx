import React from 'react';
import { WalletIcon, TagIcon, TrendingIcon, ChartIcon, TargetIcon, ReportIcon } from './FeatureIcons.jsx';

const FEATURES = [
  {
    icon: WalletIcon,
    title: 'Expense tracking',
    description: 'Record and organize your daily expenses in seconds.',
  },
  {
    icon: TagIcon,
    title: 'Smart categories',
    description: 'Keep spending organized by category — Food, Transport, Shopping, Bills, and Entertainment.',
  },
  {
    icon: TrendingIcon,
    title: 'Expense prediction',
    description: 'Use your previous spending patterns to estimate what next month will cost.',
  },
  {
    icon: ChartIcon,
    title: 'Financial analytics',
    description: 'Visualize your income and expenses with clear, readable charts.',
  },
  {
    icon: TargetIcon,
    title: 'Budget monitoring',
    description: 'Set budgets for each category and keep an eye on how close you are.',
  },
  {
    icon: ReportIcon,
    title: 'Reports',
    description: 'View simple summaries of your financial activity whenever you need them.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="features" id="features">
      <div className="features__inner">
        <h2>Everything in one place</h2>
        <div className="features__grid">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div className="feature-card" key={title}>
              <span className="feature-card__icon">
                <Icon />
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
