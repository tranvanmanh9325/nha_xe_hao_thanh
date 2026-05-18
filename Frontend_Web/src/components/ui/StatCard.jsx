import { TrendUpIcon, TrendDownIcon } from '../../assets/icons';
import '../../styles/stat-card.css';

/**
 * Reusable stat card for displaying KPI metrics.
 *
 * @param {ReactNode} icon - SVG icon component
 * @param {string} label - Metric label text
 * @param {string|number} value - Metric value
 * @param {number} trend - Percentage change (positive = up, negative = down)
 * @param {string} trendLabel - Description of the comparison period
 * @param {string} variant - Color variant: 'brand' | 'success' | 'warning' | 'info'
 */
const StatCard = ({ icon, label, value, trend, trendLabel = 'so với hôm qua', variant = 'brand' }) => {
  const isPositive = trend >= 0;

  return (
    <div className="stat-card">
      <div className={`stat-card__icon stat-card__icon--${variant}`}>
        {icon}
      </div>
      <div className="stat-card__content">
        <div className="stat-card__label">{label}</div>
        <div className="stat-card__value">{value}</div>
        {trend !== undefined && (
          <div className={`stat-card__trend stat-card__trend--${isPositive ? 'up' : 'down'}`}>
            {isPositive ? <TrendUpIcon size={14} /> : <TrendDownIcon size={14} />}
            {Math.abs(trend)}%
            <span className="stat-card__trend-text">{trendLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
