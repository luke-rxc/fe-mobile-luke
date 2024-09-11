import { createDebug } from '@utils/debug';
import type { AxiosRequestConfig } from 'axios';
import pickBy from 'lodash/pickBy';
import omit from 'lodash/omit';
import { CUSTOM_HEADER_REGEXP, ExcludeCollectionCustomHeaders } from '@constants/xhr';
import { datadogRum } from '@utils/log';

const debug = createDebug();

export function handleDebugLog(config: AxiosRequestConfig) {
  if (debug.info.enabled) {
    const { baseURL, headers, method, url, data } = config;

    debug.info('Request Config: %o', {
      baseURL,
      headers: pickBy(headers, (_, key) => CUSTOM_HEADER_REGEXP.test(key)),
      method,
      url,
      ...(data && { data }),
    });
  }

  return config;
}

/**
 * Datadog Context에 사용자 정의 헤더 정보 구성
 */
export function handleDatadogCustomHeader(config: AxiosRequestConfig) {
  // 사용자 정의 헤더 필터링
  const matched = pickBy(config.headers, (_, key) => CUSTOM_HEADER_REGEXP.test(key));

  // 제외 대상 헤더 필터링
  const excluded = omit(matched, ExcludeCollectionCustomHeaders);

  // Datadog Context 설정
  datadogRum.setGlobalContextProperty('customHeaders', excluded);

  return config;
}
