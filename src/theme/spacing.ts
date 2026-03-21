// ══════════════════════════════════════════════════
// FILE: src/theme/spacing.ts
// PURPOSE: 8pt grid spacing system and border radius tokens
// ══════════════════════════════════════════════════

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const BorderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
} as const;

export const Layout = {
  // Minimum touch target per Apple HIG
  minTouchTarget: 44,
  // Timer button height
  timerButtonHeight: 72,
  // Session card left accent
  sessionAccentWidth: 4,
  // Tab bar height
  tabBarHeight: 83,
  // Screen horizontal padding
  screenPadding: Spacing.md,
  // Header height
  headerHeight: 44,
} as const;

export type SpacingKey = keyof typeof Spacing;
export type BorderRadiusKey = keyof typeof BorderRadius;
