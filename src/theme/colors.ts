// ══════════════════════════════════════════════════
// FILE: src/theme/colors.ts
// PURPOSE: Complete light and dark mode color system — Sachlichkeit design principles
// ══════════════════════════════════════════════════

export const Colors = {
  // Primary brand
  primary: '#1558C9',
  primaryPressed: '#1244A0',
  primaryDark: '#1244A0',
  primaryLight: '#E8EFFD',
  timerGlow: '#E8EFFD',

  // Semantic
  danger: '#C0392B',
  dangerLight: '#FCECEA',
  success: '#1E7D3E',
  successLight: '#E8F5EC',
  warning: '#B8860B',
  warningLight: '#FEF6E4',

  // Neutrals — light mode
  gray50: '#F9F9F9',
  gray100: '#F0F0F0',
  gray200: '#E0E0E0',
  gray400: '#9E9E9E',
  gray600: '#616161',
  gray800: '#2D2D2D',
  gray900: '#1A1A1A',

  // Absolute
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Employer palette (color-coded session tags)
  employer1: '#1558C9',
  employer2: '#7B2D8B',
  employer3: '#1E7D3E',
  employer4: '#B8860B',
  employer5: '#C0392B',
  employer6: '#2E86AB',
  employer7: '#E67E22',
} as const;

export const DarkColors = {
  // Primary brand (same)
  primary: '#1558C9',
  primaryPressed: '#1244A0',
  primaryDark: '#1244A0',
  primaryLight: '#1C2D4A',
  timerGlow: '#1C2D4A',

  // Semantic (same)
  danger: '#C0392B',
  dangerLight: '#2D1614',
  success: '#1E7D3E',
  successLight: '#0F2618',
  warning: '#B8860B',
  warningLight: '#2A200A',

  // Neutrals — dark mode
  gray50: '#1C1C1E',    // surface
  gray100: '#262626',   // surface raised
  gray200: '#2C2C2E',   // border
  gray400: '#9E9E9E',   // placeholder/disabled
  gray600: '#9E9E9E',   // secondary text
  gray800: '#F5F5F5',   // primary text
  gray900: '#FFFFFF',   // headings

  // Dark mode specific
  background: '#0F0F0F',
  surface: '#1C1C1E',
  surfaceRaised: '#262626',
  border: '#2C2C2E',

  // Absolute
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Employer palette (same)
  employer1: '#1558C9',
  employer2: '#7B2D8B',
  employer3: '#1E7D3E',
  employer4: '#B8860B',
  employer5: '#C0392B',
  employer6: '#2E86AB',
  employer7: '#E67E22',
} as const;

export type ColorKey = keyof typeof Colors;

export const EMPLOYER_COLORS = [
  Colors.employer1,
  Colors.employer2,
  Colors.employer3,
  Colors.employer4,
  Colors.employer5,
  Colors.employer6,
  Colors.employer7,
] as const;
