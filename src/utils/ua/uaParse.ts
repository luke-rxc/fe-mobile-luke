import { AgentValue } from './uaTypes';
import {
  getBrowser,
  getIsAndroid,
  getIsIOS,
  getIsApp,
  getAppInfo,
  getOsVersion,
  getEtcInAppBrowser,
  hasHeadlessChrome,
} from './uaUtils';

/**
 * @todo app 인 경우에 browser에 대한 처리(browser이 의미가 없는 듯 함)
 */
export function parseUa(agent?: string): AgentValue {
  const ua = agent ?? navigator.userAgent;
  const uaLowerCase = ua.toLowerCase();
  const isApp = getIsApp(ua);
  const appInfo = getAppInfo(ua);
  const etcInAppBrowser = getEtcInAppBrowser(ua);
  const isEtcInApp = !!etcInAppBrowser;
  const browser = getBrowser(ua);
  const osVersion = getOsVersion(ua);
  const isAndroid = getIsAndroid(uaLowerCase);
  const isIOS = getIsIOS(uaLowerCase);
  // 모바일 디바이스 체크
  /* cspell: disable-next-line */
  const isMobile = !!/mobi/g.exec(uaLowerCase) || isAndroid || isIOS;
  // PC 데스크탑 체크
  const isDesktop = !isMobile && !isApp && !isEtcInApp;
  const isIOSWebChrome = !isApp && isIOS && browser.toLowerCase() === 'chrome';
  const isIOSSafari = !isApp && isIOS && browser.toLowerCase() === 'mobile safari';
  const isInstagramInApp = etcInAppBrowser === 'instagram';
  const isHeadlessChrome = hasHeadlessChrome(ua);

  return {
    isApp,
    appInfo,
    browser,
    etcInAppBrowser,
    isEtcInApp,
    osVersion,
    isIOS,
    isAndroid,
    isMobile,
    isDesktop,
    isIOSWebChrome,
    isIOSSafari,
    isInstagramInApp,
    isHeadlessChrome,
  };
}
