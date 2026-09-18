import React from 'react';
import { TrendingIcon, TargetIcon, TagIcon, ChartIcon } from './FeatureIcons.jsx';

const POINTS = [
  { icon: TagIcon, text: 'Track expenses easily' },
  { icon: ChartIcon, text: 'Understand spending habits' },
  { icon: TrendingIcon, text: 'Predict future expenses' },
  { icon: TargetIcon, text: 'Make better financial decisions' },
];

export default function TrustSection() {
  return (
    <section className="trust">
      <div className="trust__inner">
        <h2>Everything you need to understand your spending</h2>
        <div className="trust__points">
          {POINTS.map(({ icon: Icon, text }) => (
            <div className="trust__point" key={text}>
              <span className="trust__point-icon">
                <Icon />
              </span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
