export const lightColors = {
  brand: {
    50: '#FFF5F2',
    100: '#FFE6DF',
    400: '#FF7B54',
    500: '#F05123', // Primary Orange
    600: '#CC4018',
    700: '#A83210',
  },
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  white: '#FFFFFF',
  transparent: 'transparent',
  glass: {
    light: 'rgba(255, 255, 255, 0.7)',
    medium: 'rgba(255, 255, 255, 0.5)',
    heavy: 'rgba(255, 255, 255, 0.2)',
    dark: 'rgba(17, 24, 39, 0.6)',
  },
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#DC2626',
    info: '#2563EB',
  }
};

export const darkColors = {
  brand: {
    50: '#3A150A',
    100: '#541D0D',
    400: '#E06540',
    500: '#F05123',
    600: '#FF7B54',
    700: '#FF9E80',
  },
  neutral: {
    50: '#111827', // App background
    100: '#1F2937', // Card background
    200: '#374151', // Borders, inactive toggles
    300: '#4B5563',
    400: '#6B7280',
    500: '#9CA3AF', // Subtitles
    600: '#D1D5DB',
    700: '#E5E7EB',
    800: '#F3F4F6',
    900: '#F9FAFB', // Primary text
  },
  white: '#1F2937', // Dark card replacement
  transparent: 'transparent',
  glass: {
    light: 'rgba(17, 24, 39, 0.7)',
    medium: 'rgba(17, 24, 39, 0.5)',
    heavy: 'rgba(17, 24, 39, 0.2)',
    dark: 'rgba(255, 255, 255, 0.1)',
  },
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
  }
};

// Backward compatibility for existing screens that import COLORS statically
export const COLORS = lightColors;

export const TYPOGRAPHY = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  }
};

export const RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  brand: {
    shadowColor: '#F05123',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  futuristic: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
  },
  glow: {
    shadowColor: '#F05123',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  }
};