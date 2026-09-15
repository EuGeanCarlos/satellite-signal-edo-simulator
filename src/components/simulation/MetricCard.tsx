import type { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  description: string;
  icon: ReactNode;
  accent?: 'cyan' | 'blue' | 'amber';
}

function MetricCard({
  label,
  value,
  unit,
  description,
  icon,
  accent = 'cyan',
}: MetricCardProps) {
  return (
    <article
      className={`metric-card metric-card--${accent}`}
    >
      <div className="metric-card__top">
        <span>{label}</span>

        <div className="metric-card__icon">
          {icon}
        </div>
      </div>

      <div className="metric-card__value">
        {value}

        {unit && (
          <span>{unit}</span>
        )}
      </div>

      <div className="metric-card__description">
        {description}
      </div>
    </article>
  );
}

export default MetricCard;