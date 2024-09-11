/* Cspell:disable */
import { AppInfoType, DeviceOsVersion } from './uaTypes';

/**
 * @see {@link https://naver.github.io/egjs-agent/}
 * @see {@link https://faisalman.github.io/ua-parser-js/}
 */
export const regexes: {
  browser: { test: RegExp; id: string }[];
  webkit: { test: RegExp; id: string }[];
  etcInApp: { test: RegExp; id: string }[];
} = {
  browser: [
    {
      // eslint-disable-next-line no-useless-escape
      test: /\b(?:crmo|crios)\/([\w\.]+)/i,
      id: 'Chrome', // Chrome for Android/iOS
    },
    {
      // eslint-disable-next-line no-useless-escape
      test: /edg(?:e|ios|a)?\/([\w\.]+)/i,
      id: 'Edge', // Microsoft Edge
    },
    {
      // eslint-disable-next-line no-useless-escape
      test: /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i,
      id: 'IE', // IE11
    },
    {
      // eslint-disable-next-line no-useless-escape
      test: /(firefox|fxios)\/([\w\.]+)/i,
      id: 'Firefox', // Firefox
    },
    {
      // eslint-disable-next-line no-useless-escape
      test: /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i,
      id: 'Facebook', // Facebook App for iOS & Android
    },
    {
      // eslint-disable-next-line no-useless-escape
      test: /(chromium|instagram)[\/ ]([-\w\.]+)/i,
      id: 'Instagram', // Chromium/Instagram
    },
    {
      test: /whale/i,
      id: 'Whale', // Whale
    },
    {
      // eslint-disable-next-line no-useless-escape
      test: /version\/([\w\.]+) .*mobile\/\w+ (safari)/i,
      id: 'Mobile Safari',
    },
    {
      // eslint-disable-next-line no-useless-escape
      test: /version\/([\w\.]+) .*(mobile ?safari|safari)/i,
      id: 'Safari',
    },
    {
      // eslint-disable-next-line no-useless-escape
      test: /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i,
      id: 'Android Browser', // Android Browser
    },
    {
      // eslint-disable-next-line no-useless-escape
      test: /(chrome)\/v?([\w\.]+)/i,
      id: 'Chrome', // Chrome
    },
    {
      test: /(chrome|crios)/i,
      id: 'chrome',
    },
    {
      // eslint-disable-next-line no-useless-escape
      test: /version\/([\w\.]+) .*mobile\/\w+ (safari)/i,
      id: 'Mobile Safari', // Mobile Safari
    },
    {
      // eslint-disable-next-line no-useless-escape
      test: /version\/([\w\.]+) .*(mobile ?safari|safari)/i,
      id: 'Safari', // Safari & Safari Mobile
    },
  ],

  // applewebkit webkit 체크
  webkit: [
    {
      test: /applewebkit/i,
      id: 'webkit',
    },
  ],

  // sns In app 체크
  etcInApp: [
    {
      // eslint-disable-next-line no-useless-escape
      test: /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i,
      id: 'facebook',
    },
    {
      test: /(kakaotalk|kakaostory|story|kakaoplus|kakaogroup)/i,
      id: 'kakao',
    },
    {
      test: /(naver)/i,
      id: 'naver',
    },
    {
      // eslint-disable-next-line no-useless-escape
      test: /(chromium|instagram)[\/ ]([-\w\.]+)/i,
      id: 'instagram',
    },
    {
      test: /(line)/i,
      id: 'line',
    },
    {
      test: /(twitter)/i,
      id: 'twitter',
    },
    {
      test: /(youtube)/i,
      id: 'youtube',
    },
    {
      test: /(tiktok)/i,
      id: 'tiktok',
    },
  ],
};

export function getIsAndroid(ua: string): boolean {
  return ua.match(/android/i) !== null;
}

export function getIsIOS(ua: string): boolean {
  const match = new RegExp(/iphone|ipod|ipad/i).exec(ua);
  return !!match;
}

export function getBrowser(ua: string): string {
  const { browser } = regexes;
  const result = browser.find(({ test }) => !!new RegExp(test).exec(ua.toLowerCase()));
  return result?.id ?? '';
}

/** @todo 추후 userAgentData 사용시 진행 */
export function getWebkit(brandInfo: string): string {
  const { webkit } = regexes;
  const brand = brandInfo.toLowerCase();
  let result = '';
  for (let i = 0; i < webkit.length; i += 1) {
    const pattern = webkit[i].test;
    const match = new RegExp(pattern).exec(brand);
    if (match) {
      result = webkit[i].id;
    }
  }
  return result;
}

function getAppUserAgent(ua: string): RegExpMatchArray | null {
  return ua.match(/APPPRIZM([^)]+)\)/g) ?? null;
}

export function getIsApp(ua: string): boolean {
  return !(getAppUserAgent(ua) === null);
}

export function getAppInfo(ua: string): AppInfoType | null {
  const appUa = getAppUserAgent(ua);
  if (appUa && !!appUa.length) {
    const appUaInfos = appUa.toString().replace('APPPRIZM(', '').replace(')', '').split(';');
    const appUaInfosMapping = appUaInfos.reduce((obj, infos) => {
      const [key, value] = infos.split('=');
      return {
        ...obj,
        [key]: value,
      };
    }, {} as AppInfoType);

    // version
    const [major, minor, patch] = appUaInfosMapping.appVersion.split('.');
    const appVersionInfo = {
      major: parseInt(major, 10),
      minor: parseInt(minor, 10),
      patch: parseInt(patch, 10),
    };
    return {
      ...appUaInfosMapping,
      appVersionInfo,
    };
  }
  return null;
}

function getIosVersion(ua: string): DeviceOsVersion | null {
  const match = /OS (\d+)_(\d+)_?(\d+)?/.exec(ua);
  if (match && match.length > 0) {
    const major = match[1];
    const minor = match[2] ?? 0;
    const patch = match[3] ?? 0;
    const full = `${major}.${minor}.${patch}`;

    return {
      full,
      major: +major,
      minor: +minor,
      patch: +patch,
    };
  }
  return null;
}

function getAndroidVersion(ua: string) {
  // eslint-disable-next-line no-useless-escape
  const match = /Android ([\.\_\d]+)/.exec(ua);
  if (match && match.length >= 2) {
    const [, version] = match;
    const [major, minor, patch] = version.split('.');
    const full = `${major}.${minor ?? 0}.${patch ?? 0}`;

    return {
      full,
      major: +major,
      minor: +(minor ?? 0),
      patch: +(patch ?? 0),
    };
  }
  return null;
}

export function getOsVersion(ua: string): DeviceOsVersion | null {
  if (getIsIOS(ua)) {
    return getIosVersion(ua);
  }

  if (getIsAndroid(ua)) {
    return getAndroidVersion(ua);
  }

  return null;
}

// etc inApp Browser Detect
export function getEtcInAppBrowser(ua: string): string {
  const { etcInApp } = regexes;
  const result = etcInApp.find(({ test }) => !!new RegExp(test).exec(ua.toLowerCase()));
  return result?.id ?? '';
}

export function hasHeadlessChrome(ua: string) {
  const re = /HeadlessChrome/i;

  return re.test(ua);
}
/* Cspell:enable */
