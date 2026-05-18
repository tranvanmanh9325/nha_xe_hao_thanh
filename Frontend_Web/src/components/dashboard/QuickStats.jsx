import StatCard from '../ui/StatCard';
import {
  TicketIcon,
  BusRouteIcon,
  ChartIcon,
  UsersIcon,
} from '../../assets/icons';

/* Map icon name strings to actual components — avoids storing JSX in data */
const ICON_MAP = {
  TicketIcon: <TicketIcon size={22} />,
  BusRouteIcon: <BusRouteIcon size={22} />,
  ChartIcon: <ChartIcon size={22} />,
  UsersIcon: <UsersIcon size={22} />,
};

/**
 * Renders a responsive grid of StatCard components.
 *
 * @param {Array} stats - Stats data array from mockData
 */
const QuickStats = ({ stats = [] }) => {
  return (
    <div className="dashboard__stats">
      {stats.map((stat) => (
        <StatCard
          key={stat.id}
          icon={ICON_MAP[stat.iconName]}
          label={stat.label}
          value={stat.value}
          trend={stat.trend}
          trendLabel={stat.trendLabel}
          variant={stat.variant}
        />
      ))}
    </div>
  );
};

export default QuickStats;
