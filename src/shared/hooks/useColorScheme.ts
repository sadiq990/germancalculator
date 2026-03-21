// ══════════════════════════════════════════════════
// FILE: src/shared/hooks/useColorScheme.ts
// PURPOSE: Resolves theme based on user preference (system/light/dark)
// ══════════════════════════════════════════════════

import { useColorScheme as useRNColorScheme } from 'react-native';
import { useSettingsStore } from '@store/settingsStore';
import { lightTheme, darkTheme } from '@theme/index';
import type { Theme } from '@theme/index';

export function useColorScheme(): Theme {
  const systemScheme = useRNColorScheme();
  const themePreference = useSettingsStore((s) => s.settings.theme);

  if (themePreference === 'dark') return darkTheme;
  if (themePreference === 'light') return lightTheme;
  // 'system' — follow OS
  return systemScheme === 'dark' ? darkTheme : lightTheme;
}

export function useIsDark(): boolean {
  const theme = useColorScheme();
  return theme.isDark;
}
