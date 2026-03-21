// ══════════════════════════════════════════════════
// FILE: src/theme/shadows.ts
// PURPOSE: Platform-aware shadow tokens for cards and elevation
// ══════════════════════════════════════════════════

import { Platform } from 'react-native';
import type { ViewStyle } from 'react-native';

interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number; // Android only
}

const createShadow = (
  height: number,
  radius: number,
  opacity: number,
  elevation: number,
): ShadowStyle => ({
  shadowColor: '#000000',
  shadowOffset: { width: 0, height },
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation,
});

export const Shadows = {
  none: createShadow(0, 0, 0, 0),
  xs: createShadow(1, 2, 0.04, 1),
  sm: createShadow(2, 4, 0.06, 2),
  md: createShadow(4, 8, 0.08, 4),
  lg: createShadow(8, 16, 0.1, 8),
} as const;

export type ShadowKey = keyof typeof Shadows;

// Cross-platform shadow helper
export function getShadow(key: ShadowKey): ViewStyle {
  return Platform.OS === 'ios'
    ? {
        shadowColor: Shadows[key].shadowColor,
        shadowOffset: Shadows[key].shadowOffset,
        shadowOpacity: Shadows[key].shadowOpacity,
        shadowRadius: Shadows[key].shadowRadius,
      }
    : {
        elevation: Shadows[key].elevation,
      };
}
