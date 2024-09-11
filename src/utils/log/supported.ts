import type { Location } from 'history';
import qs from 'qs';

/**
 * Hotjar 지원 Path 체크
 */
const HOTJAR_INCLUDE_NAVIGATE_PATH = [/^\/story/, /^\/teaser/, /^\/about/];
export const hotJar = (path: string) => {
  if (path) {
    return HOTJAR_INCLUDE_NAVIGATE_PATH.map((regExp: RegExp) => !!regExp.exec(path)).includes(true);
  }
  return false;
};

// Mixpanel 비활성 경로
const MIXPANEL_DISABLE_PATH_REGEXP = /^\/live/;
// Mixpanel 비활성 유입 채널
const MIXPANEL_DISABLE_CHANNELS = ['toss'];

/**
 * Mixpanel 지원 여부
 */
export const mixPanel = ({ pathname, search }: Pick<Location, 'pathname' | 'search'>) => {
  // 비활성 대상 경로 여부
  const disabledPath = MIXPANEL_DISABLE_PATH_REGEXP.test(pathname);

  const { utm_source: utmSource = '' } = qs.parse(search, { ignoreQueryPrefix: true }) as unknown as {
    utm_source?: string;
  };

  // 비활성 대상 채널 여부
  const disabledChannel = MIXPANEL_DISABLE_CHANNELS.includes(utmSource.toLowerCase());

  return !(disabledPath && disabledChannel);
};
