import { CallAppCommand } from '@constants/link';
import { CallAppTypes, CallAppLogTypes } from '@constants/webInterface';
import { createDebug } from '@utils/debug';
import { userAgent } from './ua';

const debug = createDebug('utils:web2App');

const { isApp, isIOS, isAndroid, appInfo } = userAgent();

/**
 * 네이티브 앱 연동 공통 메서드
 *
 * @param {string} domain DomainType 내 정의된 App Interface
 * @param {*} message App에 보낼 데이터
 * @guide
 *  // iOS > window.webkit.messageHandlers.action.postMessage(message)
 *  // AOS > window.action.postMessage(message)
 * @example
 *  sendToApp<CallAppSignInParams>(CallAppCommand.SignIn, { receiveData: '~~~~~' })
 * @deprecated callApp Method 사용
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendToApp = <T extends Record<string, any>>(command: ValueOf<CallAppCommand>, params?: T) => {
  if (!isApp) {
    return;
  }

  const payload = {
    command,
    params: params ?? {},
  };

  const stringifyPayload = JSON.stringify(payload);

  if (isIOS) {
    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.action) {
      window.webkit.messageHandlers.action.postMessage(payload);
      /** @todo 차후 삭제 */
      debug.log(`[sendToApp Complete]:: ${stringifyPayload}}`);
    } else {
      // 실패
      debug.log(`[sendToApp Error]:: ${stringifyPayload}`);
    }
  } else if (isAndroid) {
    if (window.action && window.action.postMessage) {
      window.action.postMessage(stringifyPayload);
      /** @todo 차후 삭제 */
      debug.log(`[sendToApp Complete]:: ${stringifyPayload}}`);
    } else {
      // 실패
      debug.log(`[sendToApp Error]:: ${stringifyPayload}`);
    }
  } else {
    // 실패
    debug.log(`[sendToApp Error]:: ${stringifyPayload}`);
  }
};

/**
 * Message Emitter
 *
 * @description
 *   WebView -> Native로 전달하는 인터페이스 입니다.
 *
 * @param {string} command CallAppTypes에 정의된 Action Commands
 * @param {*} params Action Commands 별로 정의된 params
 */
export const callApp = <T extends Record<string, unknown>>(command: CallAppTypes, params?: T): void => {
  if (!isApp) {
    return;
  }

  const payload = {
    command,
    params: params ?? {},
  };

  // iOS Interface
  isIOS && window.webkit?.messageHandlers?.action?.postMessage?.(payload);

  // AOS Interface
  isAndroid && window.action?.postMessage?.(JSON.stringify(payload));

  /** @todo 개발 디버깅용으로 차후 제거 */
  callAppDebugger(payload);
};

/**
 * CallApp 에서 이벤트 로깅을 위한 메서드 호출 전용
 */
export const callAppLog = <T extends Record<string, unknown>>(command: CallAppLogTypes, params?: T): void => {
  if (!isApp) {
    return;
  }

  const payload = {
    command,
    params: params ?? {},
  };

  // iOS Interface
  isIOS && window.webkit?.messageHandlers?.eventLog?.postMessage?.(payload);

  // AOS Interface
  isAndroid && window.eventLog?.postMessage?.(JSON.stringify(payload));

  /** @todo 개발 디버깅용으로 차후 제거, 우선 Logging 은 CallApp과 동일하게 사용 */
  callAppDebugger(payload);
};

/** @todo 개발 디버깅용으로 차후 제거 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const callAppDebugger = (payload: any) => {
  if (isIOS) {
    if (window.webkit?.messageHandlers?.action?.postMessage) {
      debug.log('[callApp Complete]', payload);
    } else {
      debug.log('[callApp Error]', payload);
    }
  } else if (isAndroid) {
    if (window.action?.postMessage) {
      debug.log('[callApp Complete]', payload);
    } else {
      debug.log('[callApp Error]', payload);
    }
  } else {
    debug.log('[callApp Error]', payload);
  }
};
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * 현재 App 버전이 지정된 버전(checkVersion)과 같거나 높을때 (최신인지 확인)
 *
 * @param {number} checkVersion e.g) 5.5.8 인경우 -> 5.5.8
 * @returns {boolean} 최신버전이라면 true, 이전버전이라면 false
 */
export const isAppVersionLatestCheck = (checkVersion: string): boolean => {
  // app 아닌 경우는 false return + console 경고
  if (!isApp || !appInfo) {
    debug.warn('[web2App::isAppVersionLatestCheck] App 환경에서만 실행이 필요');
    return false;
  }
  const {
    appVersionInfo: { major, minor, patch },
  } = appInfo;
  const [checkMajor, checkMinor, checkPatch] = checkVersion.split('.').map((version) => +version);

  if (major > checkMajor) {
    return true;
  }
  if (major === checkMajor && minor > checkMinor) {
    return true;
  }
  if (major === checkMajor && minor === checkMinor && patch >= checkPatch) {
    return true;
  }
  return false;
};

/**
 * 특정 주소값이 인앱에서 이용가능한 딥링크인지 확인한다.
 * @param href 확인 할 주소값.
 */
export function isDeepLink(href: string) {
  const ret = /^(prizm):\/\//.exec(href);

  if (!ret) {
    return false;
  }
  return ret.length > 0;
}

/**
 * Decode & JSON parse
 *
 * @description 인코딩 된 JSON 문자열을 파싱합니다.
 */
export const parsePayload = (payload: string) => {
  let decoded;

  try {
    decoded = decodeURIComponent(payload);
  } catch (e) {
    debug.log('parsePayload decodeURIComponent error', e);
    decoded = payload;
  }

  let parsed;

  try {
    parsed = JSON.parse(decoded);
  } catch (e) {
    debug.log('parsePayload JSON.parse error', e);
    parsed = decoded;
  }

  return parsed;
};

/**
 * Encode & JSON stringify
 *
 * @description 객체를 인코딩 된 JSON 문자열로 변환합니다.
 */
export const stringifyPayload = (payload: Record<string, unknown>): string => {
  return payload && encodeURIComponent(JSON.stringify(payload));
};

/**
 * ios, aos에 맞는 버전명을 반환
 * app이 아닌 경우와 그외에는 빈문자열 반환
 */
export const getUpdateAppVersion = (iosVersion: string, aosVersion: string): string => {
  if (!isApp) {
    return '';
  }

  return (isIOS && iosVersion) || (isAndroid && aosVersion) || '';
};
