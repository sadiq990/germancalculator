// ══════════════════════════════════════════════════
// FILE: src/theme/index.ts
// PURPOSE: Unified theme export with light/dark variant builder
// ══════════════════════════════════════════════════

import { Colors, DarkColors } from './colors';
import { Spacing, BorderRadius, Layout } from './spacing';
import { Typography, FontWeight } from './typography';
import { Shadows, getShadow } from './shadows';

export interface Theme {
  colors: typeof Colors;
  spacing: typeof Spacing;
  borderRadius: typeof BorderRadius;
  layout: typeof Layout;
  typography: typeof Typography;
  fontWeight: typeof FontWeight;
  shadows: typeof Shadows;
  getShadow: typeof getShadow;
  isDark: boolean;
}

export const lightTheme: Theme = {
  colors: Colors,
  spacing: Spacing,
  borderRadius: BorderRadius,
  layout: Layout,
  typography: Typography,
  fontWeight: FontWeight,
  shadows: Shadows,
  getShadow,
  isDark: false,
};

export const darkTheme: Theme = {
  colors: DarkColors,
  spacing: Spacing,
  borderRadius: BorderRadius,
  layout: Layout,
  typography: Typography,
  fontWeight: FontWeight,
  shadows: Shadows,
  getShadow,
  isDark: true,
};

export { Colors, DarkColors } from './colors';
export { Spacing, BorderRadius, Layout } from './spacing';
export { Typography, FontWeight } from './typography';
export { Shadows, getShadow } from './shadows';
