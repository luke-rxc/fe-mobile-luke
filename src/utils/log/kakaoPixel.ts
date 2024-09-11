import { userAgent } from '@utils/ua';
import { createDebug } from '@utils/debug';
import env from '@env';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakaoPixel: any;
  }
}

const debug = createDebug('tracking:kakaoPixel');

const { isApp } = userAgent();
const { authKey } = env;

export const init = (cb?: () => void) => {
  if (isApp) {
    return;
  }

  const tag = document.createElement('script');

  tag.src = '//t1.daumcdn.net/adfit/static/kp.js';
  tag.async = true;
  tag.onload = () => {
    debug.log('onload');

    // Kakao Pixel 방문 이벤트 전송 (모든 웹 페이지 대상)
    window.kakaoPixel(authKey.kakaoPixel).pageView();

    return cb?.();
  };

  const firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode && firstScript.parentNode.insertBefore(tag, firstScript);

  debug.log('init');
};
