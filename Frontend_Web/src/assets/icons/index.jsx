/* ==========================================================================
   Custom SVG Icon Components — Nhà Xe Hào Thanh
   
   Design language:
   - Stroke-based, stroke-width: 1.75
   - ViewBox: 0 0 24 24
   - stroke-linecap: round, stroke-linejoin: round
   - Uses currentColor for easy CSS color inheritance
   ========================================================================== */

/* Shared base props for all icons */
const baseProps = (size, className) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className,
});

/* ---- Dashboard / Overview — 2x2 grid squares ---- */
export const DashboardIcon = ({ size = 22, className = '' }) => (
  <svg {...baseProps(size, className)}>
    <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
  </svg>
);

/* ---- Bus Route — curved path with endpoints ---- */
export const BusRouteIcon = ({ size = 22, className = '' }) => (
  <svg {...baseProps(size, className)}>
    <circle cx="5" cy="5" r="2" />
    <circle cx="19" cy="19" r="2" />
    <path d="M7 5h3c4 0 4 4 4 7s0 7 4 7h1" />
  </svg>
);

/* ---- Bus Seat — reclining sleeper seat ---- */
export const BusSeatIcon = ({ size = 22, className = '' }) => (
  <svg {...baseProps(size, className)}>
    <path d="M5 19v-6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6" />
    <path d="M5 13V8a2 2 0 0 1 2-2h2" />
    <rect x="7" y="3" width="6" height="5" rx="1.5" />
    <line x1="3" y1="19" x2="21" y2="19" />
  </svg>
);

/* ---- Ticket — ticket with dashed tear line ---- */
export const TicketIcon = ({ size = 22, className = '' }) => (
  <svg {...baseProps(size, className)}>
    <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7z" />
    <line x1="9" y1="5" x2="9" y2="7" />
    <line x1="9" y1="9" x2="9" y2="11" />
    <line x1="9" y1="13" x2="9" y2="15" />
    <line x1="9" y1="17" x2="9" y2="19" />
  </svg>
);

/* ---- Chart — bar chart with 3 bars ---- */
export const ChartIcon = ({ size = 22, className = '' }) => (
  <svg {...baseProps(size, className)}>
    <rect x="4" y="12" width="4" height="8" rx="1" />
    <rect x="10" y="6" width="4" height="14" rx="1" />
    <rect x="16" y="9" width="4" height="11" rx="1" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);

/* ---- Settings — gear cog ---- */
export const SettingsIcon = ({ size = 22, className = '' }) => (
  <svg {...baseProps(size, className)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1.08z" />
  </svg>
);

/* ---- Search — magnifying glass ---- */
export const SearchIcon = ({ size = 22, className = '' }) => (
  <svg {...baseProps(size, className)}>
    <circle cx="11" cy="11" r="7" />
    <line x1="16.5" y1="16.5" x2="21" y2="21" />
  </svg>
);

/* ---- Bell — notification bell ---- */
export const BellIcon = ({ size = 22, className = '' }) => (
  <svg {...baseProps(size, className)}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

/* ---- User — single person avatar ---- */
export const UserIcon = ({ size = 22, className = '' }) => (
  <svg {...baseProps(size, className)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M20 21a8 8 0 0 0-16 0" />
  </svg>
);

/* ---- Chevron Down — dropdown arrow ---- */
export const ChevronDownIcon = ({ size = 22, className = '' }) => (
  <svg {...baseProps(size, className)}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* ---- Menu — hamburger menu ---- */
export const MenuIcon = ({ size = 22, className = '' }) => (
  <svg {...baseProps(size, className)}>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

/* ---- Logout — exit door arrow ---- */
export const LogoutIcon = ({ size = 22, className = '' }) => (
  <svg {...baseProps(size, className)}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

/* ---- Calendar — calendar page ---- */
export const CalendarIcon = ({ size = 22, className = '' }) => (
  <svg {...baseProps(size, className)}>
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="16" y1="2" x2="16" y2="6" />
  </svg>
);

/* ---- Clock — simple clock ---- */
export const ClockIcon = ({ size = 22, className = '' }) => (
  <svg {...baseProps(size, className)}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15.5 14" />
  </svg>
);

/* ---- Trend Up — upward trending arrow ---- */
export const TrendUpIcon = ({ size = 22, className = '' }) => (
  <svg {...baseProps(size, className)}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

/* ---- Users — group of people ---- */
export const UsersIcon = ({ size = 22, className = '' }) => (
  <svg {...baseProps(size, className)}>
    <circle cx="9" cy="7" r="3.5" />
    <path d="M2 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1" />
    <circle cx="17.5" cy="8" r="2.5" />
    <path d="M20 21v-.5a3.5 3.5 0 0 0-3-3.47" />
  </svg>
);

/* ---- Trend Down — downward trending arrow ---- */
export const TrendDownIcon = ({ size = 22, className = '' }) => (
  <svg {...baseProps(size, className)}>
    <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
    <polyline points="16 17 22 17 22 11" />
  </svg>
);
