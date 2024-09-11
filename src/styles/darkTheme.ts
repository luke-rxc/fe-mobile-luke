import merge from 'lodash/merge';
import { colorToken, theme as baseTheme, Theme } from './theme';

type Color = typeof baseTheme['color'];

const color: Color = {
  ...baseTheme.color,

  // overriding colors
  white: 'rgba(0, 0, 0, 1)',
  gray3: 'rgba(255, 255, 255, 0.06)',
  gray8: 'rgba(255, 255, 255, 0.1)',
  gray20: 'rgba(255, 255, 255, 0.16)',
  gray50: 'rgba(255, 255, 255, 0.5)',
  gray70: 'rgba(255, 255, 255, 0.7)',
  black: 'rgba(255, 255, 255, 1)',
  whiteVariant2: 'rgba(45, 45, 45, 1)',
  whiteVariant1: 'rgba(32, 32, 32, 1)',
  grayBg: 'rgba(23, 23, 23, 1)',
  gray8Filled: 'rgba(65, 65, 65, 1)',
  white20: 'rgba(0, 0, 0, 0.2)',
  white70: 'rgba(0, 0, 0, 0.7)',

  /** @deprecated */
  tint: 'rgba(255, 255, 255, 1)',
  /** @deprecated */
  tint3: 'rgba(255, 255, 255, 0.06)',
  /** @deprecated */
  surface: '#202020',
  /** @deprecated */
  bg: '#171717',
  /** @deprecated */
  dimmed: '#414141',
  /** @deprecated */
  surfaceVariant: '#2D2D2D',
  /** @deprecated */
  webHeader: 'rgba(32 , 32, 32, 0.6)',
  /** @deprecated */
  themeColor: '#171717',
};

/** 다크모드 여부 */
const isDarkMode = true;

const darkColorToken = () => {
  return merge<ReturnType<typeof colorToken>, Partial<ReturnType<typeof colorToken>>>(
    colorToken(color),
    {}, // <= light color와 다른 foundation color 값을 참조 하는 경우 오브젝트 내에 정의
  );
};

const theme = {
  color: { ...color, ...darkColorToken() },
  isDarkMode,
};

export const darkTheme: Theme = { ...baseTheme, ...theme };

export default darkTheme;
