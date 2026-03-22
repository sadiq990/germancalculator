import { useEffect } from 'react';
import { useThemeStore } from '../store/useThemeStore';

export function useTheme() {
  const themePreference = useThemeStore(state => state.theme);
  const setTheme = useThemeStore(state => state.setTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = 
      themePreference === 'dark' || 
      (themePreference === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themePreference]);

  return { theme: themePreference, setTheme };
}
