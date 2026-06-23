import React from 'react';
import Svg, { Path, Circle, Rect, Line, Polyline, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';

export const LocationIcon = ({ size = 24, color = "currentColor", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    {/* Futuristic pin: disconnected top arc and geometric bottom */}
    <Path d="M12 21.5L8.5 15H15.5L12 21.5Z" fill={color} fillOpacity="0.2" />
    <Path d="M12 21.5L8.5 15" />
    <Path d="M15.5 15L12 21.5" />
    <Path d="M17 10C17 7.23858 14.7614 5 12 5C9.23858 5 7 7.23858 7 10" />
    <Circle cx="12" cy="10" r="2" />
    {/* Tech accents */}
    <Line x1="12" y1="2" x2="12" y2="3" strokeWidth="2" />
    <Line x1="19" y1="10" x2="20" y2="10" strokeWidth="2" />
    <Line x1="4" y1="10" x2="5" y2="10" strokeWidth="2" />
  </Svg>
);

export const DateIcon = ({ size = 24, color = "currentColor", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    {/* Geometric calendar frame with disconnected corners */}
    <Path d="M3 7H21V19H3V7Z" />
    <Line x1="3" y1="11" x2="21" y2="11" />
    {/* Tech nodes for binding */}
    <Rect x="6" y="4" width="2" height="4" fill={color} />
    <Rect x="16" y="4" width="2" height="4" fill={color} />
    {/* Digital grid elements */}
    <Rect x="7" y="14" width="2" height="2" />
    <Rect x="11" y="14" width="2" height="2" />
    <Rect x="15" y="14" width="2" height="2" />
  </Svg>
);

export const BusIcon = ({ size = 24, color = "currentColor", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    {/* Cyber-bus silhouette */}
    <Path d="M4 8L6 4H18L20 8V17H4V8Z" />
    <Path d="M4 12H20" />
    {/* Minimal wheels */}
    <Rect x="6" y="17" width="3" height="3" fill={color} />
    <Rect x="15" y="17" width="3" height="3" fill={color} />
    {/* Futuristic windshield */}
    <Path d="M6 9H18" strokeWidth="2" strokeOpacity="0.5" />
    {/* Headlights */}
    <Line x1="5" y1="15" x2="7" y2="15" strokeWidth="2" />
    <Line x1="17" y1="15" x2="19" y2="15" strokeWidth="2" />
  </Svg>
);

export const PhoneIcon = ({ size = 24, color = "currentColor", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    {/* Angular phone receiver */}
    <Path d="M21 16.5V19.5L19.5 21C14 21 8 18 4 12C3 10 3 8 3 8L6 5H9L11 9L8.5 10.5C9.5 12.5 11.5 14.5 13.5 15.5L15 13L19 15L21 16.5Z" />
    {/* Digital pulse */}
    <Circle cx="17" cy="7" r="1" fill={color} stroke="none" />
    <Path d="M19 5C20.1046 6.10457 20.1046 7.89543 19 9" strokeOpacity="0.5" />
  </Svg>
);

export const LockIcon = ({ size = 24, color = "currentColor", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    {/* Cyber vault style lock */}
    <Rect x="5" y="11" width="14" height="10" />
    <Path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" />
    {/* Core scanner */}
    <Circle cx="12" cy="16" r="1.5" fill={color} />
    <Line x1="12" y1="17.5" x2="12" y2="19" />
  </Svg>
);

export const UserIcon = ({ size = 24, color = "currentColor", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="8" r="4" />
  </Svg>
);

export const EyeIcon = ({ size = 24, color = "currentColor", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    {/* Angular optic sensor */}
    <Path d="M2 12L12 4L22 12L12 20L2 12Z" />
    <Circle cx="12" cy="12" r="3" />
    <Circle cx="12" cy="12" r="1" fill={color} />
  </Svg>
);

export const EyeSlashIcon = ({ size = 24, color = "currentColor", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    <Path d="M9 7L12 4L22 12L19.5 14" />
    <Path d="M4.5 10L2 12L12 20L15 17.5" />
    <Circle cx="12" cy="12" r="3" strokeOpacity="0.5" />
    <Line x1="2" y1="2" x2="22" y2="22" strokeWidth="2" />
  </Svg>
);

export const SearchIcon = ({ size = 24, color = "currentColor", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    {/* Radar / Scanner aesthetic */}
    <Circle cx="10" cy="10" r="6" />
    <Line x1="15" y1="15" x2="21" y2="21" strokeWidth="2" />
    {/* Crosshair accents */}
    <Line x1="10" y1="2" x2="10" y2="4" />
    <Line x1="10" y1="16" x2="10" y2="18" />
    <Line x1="2" y1="10" x2="4" y2="10" />
    <Line x1="16" y1="10" x2="18" y2="10" />
  </Svg>
);

export const ArrowRightIcon = ({ size = 24, color = "currentColor", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    <Line x1="4" y1="12" x2="19" y2="12" />
    <Path d="M13 6L20 12L13 18" />
    <Line x1="20" y1="12" x2="22" y2="12" />
  </Svg>
);

export const WifiIcon = ({ size = 24, color = "currentColor", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    <Path d="M2 8C8 3.5 16 3.5 22 8" strokeDasharray="2 4" />
    <Path d="M6 13C10 9.5 14 9.5 18 13" />
    <Rect x="11" y="17" width="2" height="2" fill={color} stroke="none" />
  </Svg>
);

export const VipSeatIcon = ({ size = 24, color = "currentColor", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    {/* Hover-chair aesthetic */}
    <Path d="M6 19H18V17H6V19Z" />
    <Path d="M7 16V8C7 6.89543 7.89543 6 9 6H15C16.1046 6 17 6.89543 17 8V16" />
    <Path d="M4 16H20" />
    {/* Energy glow */}
    <Line x1="9" y1="21" x2="15" y2="21" strokeOpacity="0.5" />
    <Polygon points="12,10 13,12 15,12 13.5,13.5 14,15.5 12,14.5 10,15.5 10.5,13.5 9,12 11,12" fill={color} fillOpacity="0.3" />
  </Svg>
);

export const StarIcon = ({ size = 24, color = "currentColor", filled = false, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    <Polygon points="12 2 14.5 9 22 9 16 13.5 18 21 12 16.5 6 21 8 13.5 2 9 9.5 9" />
  </Svg>
);

export const SettingsIcon = ({ size = 24, color = "currentColor", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    <Circle cx="12" cy="12" r="3" />
    <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </Svg>
);

export const BellIcon = ({ size = 24, color = "currentColor", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
    <Circle cx="18" cy="8" r="2" fill={color} />
  </Svg>
);

export const ShieldIcon = ({ size = 24, color = "currentColor", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <Path d="M12 8v4" />
    <Path d="M12 16h.01" strokeWidth="2" />
  </Svg>
);

export const HelpIcon = ({ size = 24, color = "currentColor", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    <Circle cx="12" cy="12" r="10" />
    <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <Path d="M12 17h.01" strokeWidth="2" />
  </Svg>
);

export const LogoutIcon = ({ size = 24, color = "currentColor", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <Polyline points="16 17 21 12 16 7" />
    <Line x1="21" y1="12" x2="9" y2="12" />
  </Svg>
);

export const ChevronRightIcon = ({ size = 24, color = "currentColor", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    <Polyline points="9 18 15 12 9 6" />
  </Svg>
);

export const TicketOutlineIcon = ({ size = 24, color = "currentColor", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    <Path d="M15 5H9a2 2 0 0 0-2 2v2a2 2 0 0 1 0 4v2a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2a2 2 0 0 1 0-4V7a2 2 0 0 0-2-2z" />
    <Line x1="12" y1="9" x2="12" y2="15" strokeDasharray="2 2" />
  </Svg>
);

export const MailIcon = ({ size = 24, color = "currentColor", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    <Path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" />
    <Rect x="3" y="5" width="18" height="14" rx="2" />
  </Svg>
);

export const MessageIcon = ({ size = 24, color = "currentColor", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    <Path d="M21 11.5C21 16.75 16.75 21 11.5 21C9.83 21 8.27 20.56 6.94 19.8L3 21L4.2 17.06C3.44 15.73 3 14.17 3 12.5C3 7.25 7.25 3 12.5 3C17.75 3 21 7.25 21 11.5Z" />
    <Path d="M8 12H8.01" strokeWidth="2" strokeLinecap="round" />
    <Path d="M12 12H12.01" strokeWidth="2" strokeLinecap="round" />
    <Path d="M16 12H16.01" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const ChevronDownIcon = ({ size = 24, color = "currentColor", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    <Polyline points="6 9 12 15 18 9" />
  </Svg>
);

export const ArrowLeftIcon = ({ size = 24, color = "currentColor", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    <Path d="M19 12H5" />
    <Path d="M12 19L5 12L12 5" />
  </Svg>
);

export const XIcon = ({ size = 24, color = "currentColor", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    <Line x1="18" y1="6" x2="6" y2="18" />
    <Line x1="6" y1="6" x2="18" y2="18" />
  </Svg>
);

export const GlobeIcon = ({ size = 24, color = "currentColor", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Circle cx="12" cy="12" r="10" />
    <Line x1="2" y1="12" x2="22" y2="12" />
    <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </Svg>
);

export const MoonIcon = ({ size = 24, color = "currentColor", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </Svg>
);

export const TrashIcon = ({ size = 24, color = "currentColor", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Polyline points="3 6 5 6 21 6" />
    <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <Line x1="10" y1="11" x2="10" y2="17" />
    <Line x1="14" y1="11" x2="14" y2="17" />
  </Svg>
);

export const InfoIcon = ({ size = 24, color = "currentColor", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Circle cx="12" cy="12" r="10" />
    <Line x1="12" y1="16" x2="12" y2="12" />
    <Line x1="12" y1="8" x2="12.01" y2="8" />
  </Svg>
);

export const DocumentIcon = ({ size = 24, color = "currentColor", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <Polyline points="14 2 14 8 20 8" />
    <Line x1="16" y1="13" x2="8" y2="13" />
    <Line x1="16" y1="17" x2="8" y2="17" />
    <Polyline points="10 9 9 9 8 9" />
  </Svg>
);

export const CheckCircleIcon = ({ size = 24, color = "currentColor", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <Polyline points="22 4 12 14.01 9 11.01" />
  </Svg>
);

export const FingerprintIcon = ({ size = 24, color = "currentColor", style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12Z" strokeDasharray="4 4" />
    <Path d="M8.5 9.5C9.5 8.5 10.5 8 12 8C13.5 8 14.5 8.5 15.5 9.5" />
    <Path d="M7.5 12.5C8.5 11 10 10 12 10C14 10 15.5 11 16.5 12.5" />
    <Path d="M6.5 16C7.5 14 9.5 12.5 12 12.5C14.5 12.5 16.5 14 17.5 16" />
    <Path d="M12 15C11 15 10 16 10 17" />
  </Svg>
);