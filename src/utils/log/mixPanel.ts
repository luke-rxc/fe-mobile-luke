/**
 * @see https://developer.mixpanel.com/docs/javascript-quickstart
 */
import mixPanelBrowser from 'mixpanel-browser';
import { createDebug } from '@utils/debug';

const debug = createDebug('utils:log:mixPanel');

/**
 * 회원 가입 시 호출
 * Mixpanel의 distinct_id와 User Api의 id 값을 매핑
 * Mixpanel User Profile 를 생성하기 위해 logUser 메서드 호출전에 호출
 * alias 호출후 mixpanel 내부적으로 identify 실행
 * @reference https://developer.mixpanel.com/docs/javascript#setting-profile-properties
 */
export const alias = (userId: number) => {
  try {
    const distinctId = getDistinctId();
    mixPanelBrowser.alias(`${userId}`, distinctId);
  } catch (e) {
    debug.error(e);
  }
};

export const getDistinctId = () => {
  try {
    return mixPanelBrowser.get_distinct_id();
  } catch (e) {
    debug.error(e);
    return null;
  }
};

/**
 * 믹스패널, 유저 id 연동 (id merge)
 * @see {@link https://help.mixpanel.com/hc/en-us/articles/115004497803-Identity-Management-Pre-Identity-Merge-Overview}
 * @see {@link https://help.mixpanel.com/hc/en-us/articles/360041039771-Getting-Started-with-Identity-Management}
 * @see {@link https://developer.mixpanel.com/docs/javascript-full-api-reference#mixpanelidentify}
 */
export const identify = (userId: number) => {
  try {
    mixPanelBrowser.identify(`${userId}`);
  } catch (e) {
    debug.error(e);
  }
};

export const reset = () => {
  try {
    mixPanelBrowser.reset();
  } catch (e) {
    debug.error(e);
  }
};

export const track = (...args: Parameters<typeof mixPanelBrowser.track>) => {
  try {
    mixPanelBrowser.track(...args);
  } catch (e) {
    debug.error(e);
  }
};

/**
 * 믹스패널 초기화
 * @param args {@link https://github.com/mixpanel/mixpanel-js/blob/8b2e1f7b/src/mixpanel-core.js#L87-L110}
 */
export const init = (...args: Parameters<typeof mixPanelBrowser.init>) => {
  try {
    mixPanelBrowser.init(...args);
  } catch (e) {
    debug.error(e);
  }
};

export const logUser = (...args: Parameters<typeof mixPanelBrowser.people.set>) => {
  try {
    mixPanelBrowser.people.set(...args);
  } catch (e) {
    debug.error(e);
  }
};

export const register = (...args: Parameters<typeof mixPanelBrowser.register>) => {
  try {
    mixPanelBrowser.register(...args);
  } catch (e) {
    debug.error(e);
  }
};

export const syncDistinctId = () => {
  try {
    const id = getDistinctId();
    const deviceId = mixPanelBrowser.get_property('$device_id');

    if (deviceId !== id) {
      reset();
    }
  } catch (e) {
    debug.error(e);
  }
};
