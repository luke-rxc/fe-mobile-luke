import theme from '@styles/theme';
import darkTheme from '@styles/darkTheme';
import { useEffect, useState } from 'react';
import { useMatchMedia } from './useMatchMedia';

export const ThemeMode = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ThemeMode = typeof ThemeMode[keyof typeof ThemeMode];

export const useTheme = () => {
  const { isMatches: isDarkMode, removeListener: matchMediaRemoveListener } =
    useMatchMedia('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<ThemeMode>(isDarkMode ? ThemeMode.DARK : ThemeMode.LIGHT);

  useEffect(() => {
    setMode(isDarkMode ? ThemeMode.DARK : ThemeMode.LIGHT);
  }, [mode, isDarkMode, matchMediaRemoveListener]);

  const includeTheme = {
    dark: { color: darkTheme.color },
    light: { color: theme.color },
  };

  return {
    mode,
    theme: mode === ThemeMode.DARK ? { ...darkTheme, ...includeTheme } : { ...theme, ...includeTheme },
  };
};
