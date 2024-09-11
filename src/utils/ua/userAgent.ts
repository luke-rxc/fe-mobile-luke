import { getLocalStorage } from '@utils/storage';
import { AgentValue } from './uaTypes';
import { parseUa } from './uaParse';

function getUserAgentWhenLandingExceptionPage(ua: AgentValue): AgentValue {
  const { isAndroid } = ua;
  const uaString = getLocalStorage('ua') ?? '';
  const { pathname } = window.location;
  const isExceptionUrl = !!/\/order\/complete\/\d+/.exec(pathname);

  if (uaString && isAndroid && isExceptionUrl) {
    return parseUa(uaString);
  }

  window.localStorage.removeItem('ua');
  return ua;
}

export function userAgent(agent?: string) {
  /* let agentValue: AgentValue = {
    isApp: false,
    appVersion: undefined,
    browser: '',
    isMobile: false,
    isIOS: false,
    isAndroid: false,
  }; */

  // 우선 useragent 기능만 쓰는 것으로 틀을 우선 잡는다.
  const ua = parseUa(agent);
  return getUserAgentWhenLandingExceptionPage(ua);
}
