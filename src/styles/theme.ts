import omit from 'lodash/omit';
import * as contentStyle from './contentStyle';
import * as mixin from './mixin';

export const fontFamily = 'SF Pro Display, -apple-system, Helvetica Neue, Helvetica, Arial, sans-serif';

const color = {
  // Neutral
  white: 'rgba(255, 255, 255, 1)',
  gray3: 'rgba(0, 0, 0, 0.03)',
  gray8: 'rgba(0, 0, 0, 0.08)',
  gray20: 'rgba(0, 0, 0, 0.2)',
  gray50: 'rgba(0, 0, 0, 0.5)',
  gray70: 'rgba(0, 0, 0, 0.7)',
  black: 'rgba(0, 0, 0, 1)',
  whiteVariant2: 'rgba(255, 255, 255, 1)',
  whiteVariant1: 'rgba(255, 255, 255, 1)',
  grayBg: 'rgba(247, 247, 247, 1)',
  gray8Filled: 'rgba(235, 235, 235, 1)',
  white20: 'rgba(255, 255, 255, 0.2)',
  white70: 'rgba(255, 255, 255, 0.7)',
  // NeutralFixed
  whiteLight: 'rgba(255, 255, 255, 1)',
  gray20Light: 'rgba(0, 0, 0, 0.2)',
  gray50Light: 'rgba(0, 0, 0, 0.5)',
  gray70Light: 'rgba(0, 0, 0, 0.7)',
  gray50Dark: 'rgba(255, 255, 255, 0.5)',
  gray20Dark: 'rgba(255, 255, 255, 0.16)',
  blackLight: 'rgba(0, 0, 0, 1)',
  // Etc
  red: 'rgba(221, 59, 59, 1)',
  green: 'rgba(68, 175, 116, 1)',

  // Brand
  /** @deprecated */
  tint: 'rgba(0, 0, 0, 1)',
  /** @deprecated */
  tint3: 'rgba(0, 0, 0, 0.03)',
  /** @deprecated */
  surface: '#FFFFFF',
  /** @deprecated */
  bg: '#F7F7F7',
  /** @deprecated */
  dimmed: '#EBEBEB',
  /** @deprecated */
  surfaceVariant: '#FFFFFF',
  /** @deprecated */
  customTint: '#E61E2C',
  /** @deprecated */
  customTintText: '#FFFFFF',
  /** @deprecated */
  yellow: '#F6C032',
  /** @deprecated */
  objectOnSurface: '#ADADAD',
  /** @deprecated */
  webHeader: 'rgba(255, 255, 255, 0.6)',
  /** @deprecated */
  themeColor: '#FFFFFF',
};

export const colorToken = (colors: typeof color) => {
  return {
    brand: {
      tint: colors.black,
      tint3: colors.gray3,
    },
    background: {
      surface: colors.whiteVariant1,
      surfaceHigh: colors.whiteVariant2,
      bg: colors.grayBg,
    },
    backgroundLayout: {
      section: colors.grayBg,
      line: colors.gray8,
    },
    states: {
      disabledBg: colors.gray8Filled,
      selectedBg: colors.gray8Filled,
      disabledMedia: colors.white70,
      pressedMedia: colors.gray8,
      pressedPrimary: colors.white20,
      pressedCell: colors.gray3,
    },
    text: {
      textPrimary: colors.black,
      textSecondary: colors.gray70,
      textTertiary: colors.gray50,
      textLink: colors.black,
      textHelper: colors.gray50,
      textPlaceholder: colors.gray20,
      textDisabled: colors.gray20,
    },
    semantic: {
      error: colors.red,
      sale: colors.red,
      live: colors.red,
      noti: colors.red,
      like: colors.red,
    },
  };
};

const mask = {
  black: {
    bg: `linear-gradient(180deg, rgba(0, 0, 0, 0.0001) 0%, #000000 100%)`,
    opacity: 0.6,
  },
  white: {
    bg: `linear-gradient(180deg, rgba(255, 255, 255, 0.0001) 0%, #FFFFFF 100%)`,
  },
};

const fontSize = {
  s10: '1rem',
  s12: '1.2rem',
  s14: '1.4rem',
  s15: '1.5rem',
  s18: '1.8rem',
  s20: '2rem',
  s24: '2.4rem',
  s28: '2.8rem',
  s32: '3.2rem',

  /** @deprecated 21.12.06 */
  s16: '1.6rem',
};

const fontWeight = {
  regular: 400,
  bold: 700,
};

/**
 * Font Preset
 * - css 내 font props 적용
 */
const fontType = {
  headlineB: `normal ${fontWeight.bold} ${fontSize.s32} ${fontFamily}`,
  headline: `normal ${fontWeight.regular} ${fontSize.s32} ${fontFamily}`,
  headline2B: `normal ${fontWeight.bold} ${fontSize.s28} ${fontFamily}`,
  headline2: `normal ${fontWeight.regular} ${fontSize.s28} ${fontFamily}`,
  titleB: `normal ${fontWeight.bold} ${fontSize.s24} ${fontFamily}`,
  title: `normal ${fontWeight.regular} ${fontSize.s24} ${fontFamily}`,
  title2B: `normal ${fontWeight.bold} ${fontSize.s20} ${fontFamily}`,
  title2: `normal ${fontWeight.regular} ${fontSize.s20} ${fontFamily}`,
  largeB: `normal ${fontWeight.bold} ${fontSize.s18} ${fontFamily}`,
  large: `normal ${fontWeight.regular} ${fontSize.s18} ${fontFamily}`,
  mediumB: `normal ${fontWeight.bold} ${fontSize.s15} ${fontFamily}`,
  medium: `normal ${fontWeight.regular} ${fontSize.s15} ${fontFamily}`,
  smallB: `normal ${fontWeight.bold} ${fontSize.s14} ${fontFamily}`,
  small: `normal ${fontWeight.regular} ${fontSize.s14} ${fontFamily}`,
  miniB: `normal ${fontWeight.bold} ${fontSize.s12} ${fontFamily}`,
  mini: `normal ${fontWeight.regular} ${fontSize.s12} ${fontFamily}`,
  microB: `normal ${fontWeight.bold} ${fontSize.s10} ${fontFamily}`,
  micro: `normal ${fontWeight.regular} ${fontSize.s10} ${fontFamily}`,

  /** @deprecated headlineB */
  t32B: `normal ${fontWeight.bold} ${fontSize.s32}/3.819rem ${fontFamily}`,
  /** @deprecated titleB */
  t24B: `normal ${fontWeight.bold} ${fontSize.s24}/2.9rem ${fontFamily}`,
  /** @deprecated title */
  t24: `normal ${fontWeight.regular} ${fontSize.s24}/2.9rem ${fontFamily}`,
  /** @deprecated title2B */
  t20B: `normal ${fontWeight.bold} ${fontSize.s20}/2.387rem ${fontFamily}`,
  /** @deprecated title2 */
  t20: `normal ${fontWeight.regular} ${fontSize.s20}/2.387rem ${fontFamily}`,
  /** @deprecated largeB */
  t18B: `normal ${fontWeight.bold} ${fontSize.s18}/2.1rem ${fontFamily}`,
  /** @deprecated large */
  t18: `normal ${fontWeight.regular} ${fontSize.s18}/2.1rem ${fontFamily}`,
  /** @deprecated mediumB */
  t15B: `normal ${fontWeight.bold} ${fontSize.s15}/1.8rem ${fontFamily}`,
  /** @deprecated medium */
  t15: `normal ${fontWeight.regular} ${fontSize.s15}/1.8rem ${fontFamily}`,
  /** @deprecated smallB */
  t14B: `normal ${fontWeight.bold} ${fontSize.s14}/1.7rem ${fontFamily}`,
  /** @deprecated small */
  t14: `normal ${fontWeight.regular} ${fontSize.s14}/1.7rem ${fontFamily}`,
  /** @deprecated miniB */
  t12B: `normal ${fontWeight.bold} ${fontSize.s12}/1.4rem ${fontFamily}`,
  /** @deprecated mini */
  t12: `normal ${fontWeight.regular} ${fontSize.s12}/1.4rem ${fontFamily}`,
  /** @deprecated microB */
  t10B: `normal ${fontWeight.bold} ${fontSize.s10}/1.193rem ${fontFamily}`,
  /** @deprecated micro */
  t10: `normal ${fontWeight.regular} ${fontSize.s10}/1.193rem ${fontFamily}`,
};

const spacing = {
  s2: '0.2rem',
  s4: '0.4rem',
  s8: '0.8rem',
  s12: '1.2rem',
  s16: '1.6rem',
  s24: '2.4rem',
  s32: '3.2rem',
  /** @deprecated */
  s20: '2.0rem',
  /** @deprecated */
  s40: '4.0rem',
  /** @deprecated */
  s48: '4.8rem',
  /** @deprecated */
  s56: '5.6rem',
  /** @deprecated */
  s64: '6.4rem',
};

const radius = {
  r4: '0.4rem',
  r6: '0.6rem',
  r8: '0.8rem',
  r12: '1.2rem',
  /** @deprecated */
  s6: '0.6rem',
  /** @deprecated */
  s8: '0.8rem',
  /** @deprecated */
  s12: '1.2rem',
};

const breakpoint = [320, 375, 414, 768];

const mediaQuery = {
  xxs: `@media screen and (min-width: ${breakpoint[0]}px)`,
  /**
   * Extra small
   * \>= 375px
   * @example 일반 모바일 기기, iPhone X
   */
  xs: `@media screen and (min-width: ${breakpoint[1]}px)`,
  /**
   * Small
   * \>= 414px
   * @example 큰 모바일 기기, iPhone 8 Plus, iPhone 11 XS Max
   */
  sm: `@media screen and (min-width: ${breakpoint[2]}px)`,
  /**
   * Medium
   * \>= 768px
   * @example 태블릿
   */
  md: `@media screen and (min-width: ${breakpoint[3]}px)`,
  /* eslint-enable */
};

/** 다크모드 여부 */
const isDarkMode = false;

/**
 * 영역별 z-index 값
 */
const zIndex = {
  navigation: 1100,
  floating: 1000,
  header: 900,
  cta: 800,
  base: 0,
  /** @deprecated */
  modal: 9000,
  /** @deprecated */
  toast: 9000,
  /** @deprecated */
  snackbar: 9000,
} as const;

export const theme = {
  breakpoint,
  color: { ...color, ...colorToken(color) },
  fontSize,
  fontWeight,
  fontFamily,
  fontType,
  mediaQuery,
  spacing,
  mask,
  radius,
  content: contentStyle,
  isDarkMode,
  zIndex,
  mixin: {
    z: mixin.zIndex(zIndex),
    ...omit(mixin, 'zIndex'),
  },
  /** @deprecated */
  z: mixin.zIndex(zIndex),
  dark: { color: null as unknown as typeof color & ReturnType<typeof colorToken> },
  light: { color: null as unknown as typeof color & ReturnType<typeof colorToken> },
  /** @deprecated */
  ...omit(mixin, 'zIndex'),
};

export type Theme = typeof theme;
export default theme;
