import { userAgent } from '@utils/ua';
import { createDebug } from '@utils/debug';
import env from '@env';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag: any;
  }
}

const debug = createDebug('tracking:googleAds');

const { isApp } = userAgent();
const { authKey } = env;

export const init = (cb?: () => void) => {
  if (isApp) {
    return;
  }

  const tag = document.createElement('script');

  tag.src = `https://www.googletagmanager.com/gtag/js?id=${authKey.googleAds}`;
  tag.async = true;
  tag.onload = () => {
    debug.log('onload');

    window.dataLayer = window.dataLayer || [];

    /* eslint-disable */
    (function (authKey) {
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };

      window.gtag('js', new Date());
      window.gtag('config', authKey);
    })(authKey.googleAds);
    /* eslint-enable */

    return cb?.();
  };

  const firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode && firstScript.parentNode.insertBefore(tag, firstScript);

  debug.log('init');
};
