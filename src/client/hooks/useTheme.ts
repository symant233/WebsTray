import { useEffect, useState } from 'react';
import type { ThemeMode } from '@client/types';

/**
 * Custom hook for managing theme with system detection support
 * @param themeMode - The theme mode to apply ('light' | 'dark' | 'system')
 * @returns The resolved theme ('light' | 'dark')
 */
export function useTheme(themeMode: ThemeMode = 'system'): 'light' | 'dark' {
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    if (themeMode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return themeMode;
  });

  useEffect(() => {
    const applyTheme = (theme: 'light' | 'dark') => {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      setResolvedTheme(theme);
    };

    if (themeMode === 'system') {
      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
        applyTheme(e.matches ? 'dark' : 'light');
      };

      // Initial application
      handleChange(mediaQuery);

      // Add listener for changes
      mediaQuery.addEventListener('change', handleChange);

      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    } else {
      // Apply manual theme
      applyTheme(themeMode);
    }
  }, [themeMode]);

  return resolvedTheme;
}

/**
 * Get the next theme mode in the cycle: system -> light -> dark -> system
 */
export function getNextThemeMode(current: ThemeMode): ThemeMode {
  const cycle: ThemeMode[] = ['system', 'light', 'dark'];
  const currentIndex = cycle.indexOf(current);
  return cycle[(currentIndex + 1) % cycle.length];
}
