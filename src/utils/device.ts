import { v4 as uuid } from 'uuid';
import { createDebug } from './debug';
import { userAgent } from './ua';
import { getLocalStorage, setLocalStorage } from './storage';

const debug = createDebug('utils:device');

const { isApp, isIOS, isAndroid, appInfo } = userAgent();

const DEVICE_ID_KEY = 'prizm_mweb_device_id';

/**
 * 모바일 웹 용 device id 생성
 */
const createMobileWebDeviceId = () => {
  const id = uuid();
  setLocalStorage(DEVICE_ID_KEY, id);
  return id;
};

/**
 * 모바일 웹 용 device id 반환
 */
const getMobileWebDeviceId = () => {
  return getLocalStorage(DEVICE_ID_KEY) ?? createMobileWebDeviceId();
};

export function getDeviceId() {
  if (isApp) {
    return appInfo?.deviceId ?? null;
  }

  return getMobileWebDeviceId();
}

/**
 * 디바이스 유형
 */
export function getDeviceChannel() {
  if (!isApp) {
    return 'MWEB';
  }

  if (isIOS) {
    return 'IOS';
  }
  if (isAndroid) {
    return 'ANDROID';
  }

  debug.error('지원하지 않는 채널 입니다.');
  return 'MWEB';
}
