import { userAgent } from '@utils/ua';
import { createDebug } from '@utils/debug';
import env from '@env';

declare global {
  interface Window {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    fbq: any;
    _fbq: any;
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }
}

const debug = createDebug('tracking:facebook');

const { isApp } = userAgent();
const {
  authKey: { facebookPixel },
} = env;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const init = (cb?: () => any) => {
  if (isApp) {
    return;
  }

  if (window.fbq) {
    cb?.();
    return;
  }

  /* eslint-disable */
  (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    t.onload = function () {
      debug.log('onload');

      // Facebook Pixel Init
      window.fbq('init', facebookPixel);
      window.fbq('track', 'PageView');
      return cb ? cb() : void 0;
    };
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */

  debug.log('init');
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const track = (eventName: string, customData?: any) => {
  init(() => {
    debug.log('logEvent', eventName, customData);
    window.fbq('track', eventName, customData);
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const trackCustom = (eventName: string, customData?: any) => {
  init(() => {
    window.fbq('trackCustom', eventName, customData);
  });
};

/**
 * 네이버, 구글에서 검색하여 Prizm 서비스로 왔을시, 해당 Referrer에서 검색한 키워드를 Facebook Pixel로 Push
 * @param  {string} referrerUrl referrer url
 */
interface CheckServiceProps {
  [key: string]: {
    url: string;
    query: string;
  };
}
export const searchKeywords = (referrerUrl = document.referrer) => {
  if (isApp) {
    return;
  }

  // 체크해야 하는 url
  const checkServiceList: CheckServiceProps = {
    GOOGLE: {
      url: 'google.com/search?',
      query: 'q',
    },
    NAVER: {
      url: 'search.naver.com/search.naver?',
      query: 'query',
    },
  };

  // referrer check
  const matchedServices = Object.keys(checkServiceList).filter((service) => {
    return referrerUrl.indexOf(checkServiceList[service].url) > -1;
  });

  const matchedService = matchedServices && matchedServices.length ? matchedServices[0] : null;

  // match 된 url 이 없을 경우 진행하지 않음
  if (matchedService === null) {
    return;
  }

  // match 된 url의 query 체크 진행
  const hashes = referrerUrl.slice(referrerUrl.indexOf('?') + 1).split('&');
  const queries: {
    [key: string]: string;
  } = hashes.reduce((returnDatas, currentData) => {
    const paramSplit = currentData.split('=');
    return {
      ...returnDatas,
      [paramSplit[0]]: paramSplit[1],
    };
  }, {});
  const { query } = checkServiceList[matchedService];
  const referrerKeyword = queries[query] ?? null;

  if (referrerKeyword) {
    trackCustom('SearchKeywords', {
      keyword: referrerKeyword,
    });
  }
};
