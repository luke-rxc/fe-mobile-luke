import qs from 'qs';
import has from 'lodash/has';
import { env } from '@env';
import { UniversalLinkTypes, AppLinkTypes } from '@constants/link';
import { createDebug } from '@utils/debug';
import { getUniversalLink, getAppLink } from '@utils/link';
import { userAgent } from '@utils/ua';
import { ZENDESK_TO_PRIZM_LINK_MATCH_KEY } from '../constants';

const debug = createDebug('cs:utils');

/**
 * 딥링크 사용을 위한 HTML 변환 처리
 *
 * @deprecated
 *   transformLink 처리로 전환
 */
export const transformHtml = (html: string) => {
  let transformed = html;

  // 딥링크 처리
  transformed = transformed.replace(/href="\/\/prizm.co.kr/gi, 'href="prizm://prizm.co.kr');

  return transformed;
};

export const isTransformError = (url: string) => {
  return url.includes('/error');
};

/**
 * 정의된 URL 포맷인 경우 Universal Link 스펙으로 변환
 *
 * @example
 *   https://prizm.co.kr/cs/link?linkType=ORDER_CANCEL_PARTIAL_BY_EXPORT_ID&orderId=123&exportId=456
 *   App -> prizm://prizm.co.kr/cancel/123/456
 *   Web -> /mypage/claims/123/cancel/456
 */
export const transformLink = (url: string) => {
  const log = debug.log.extend('transformLink');
  const { isApp } = userAgent();

  // Link 변환 대상 기준
  const re = new RegExp(ZENDESK_TO_PRIZM_LINK_MATCH_KEY, 'gi');

  log('origin url: %s', url);

  // URL Parse시 error catch를 위한 처리
  try {
    const { origin, pathname, search } = new URL(url);

    // 변환 대상이 아닌 경우 종료 (origin & pathname 기준으로 체크)
    if (!re.test(origin.concat(pathname))) {
      log('not matched url: %s', url);
      return url;
    }

    const { linkType, ...params } = qs.parse(search, { ignoreQueryPrefix: true }) as {
      linkType: UniversalLinkTypes;
    } & Record<string, string>;

    const hasUniversalLink = has(UniversalLinkTypes, linkType);
    const hasAppLink = has(AppLinkTypes, linkType);

    // UniversalLink와 AppLink 둘다 없을 경우 변환하지 않음
    if (!hasUniversalLink && !hasAppLink) {
      return url;
    }

    // UniversalLink는 없고, AppLink는 있을 경우 AppLink로 반환
    if (!hasUniversalLink && hasAppLink) {
      const appLink = getAppLink(linkType as AppLinkTypes, params);
      log('transform appLink: %s', appLink);

      return isTransformError(appLink) ? url : appLink;
    }

    const { app, web } = getUniversalLink(linkType, params);
    log('transform app: %s, web: %s', app, web);

    const matchedLink = isApp ? app : web;

    // 변환된 Link가 error인 경우 변환 전 url로 반환
    if (isTransformError(matchedLink)) {
      log('transform error');
      return url;
    }

    return matchedLink;
  } catch (e) {
    log('catch', e);

    return url;
  }
};

/**
 * URL 형식이고, origin이 prizm.co.kr인 경우 환경 기준으로 변경
 */
export const transformOrigin = (url: string) => {
  try {
    const { origin } = new URL(url);
    const isPrizmOrigin = origin.includes('prizm.co.kr');

    return isPrizmOrigin ? url.replace(origin, env.endPoint.baseUrl) : url;
  } catch (e) {
    return url;
  }
};
