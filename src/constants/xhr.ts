/**
 * XMLHttpRequest 관련
 */

// 사용자 정의 헤더 정규표현식
export const CUSTOM_HEADER_REGEXP = /^X-/i;

// 사용자 정의 헤더 타입 목록
export const CustomHeaderTypes = {
  IDENTIFICATION_FLAG: 'X-IDENTIFICATION-FLAG',
  MP_DISTINCT_ID: 'X-MP-DISTINCT-ID',
  MP_EXPERIMENT: 'X-MP-EXPERIMENT',
  PRIZM_CHANNEL: 'X-PRIZM-CHANNEL',
  PRIZM_DEVICE_ID: 'X-PRIZM-DEVICE-ID',
  PRIZM_TOKEN: 'X-PRIZM-TOKEN',
  PRIZM_REFRESH_TOKEN: 'X-PRIZM-REFRESH-TOKEN',
  PRIZM_VERSION: 'X-PRIZM-VERSION',
} as const;

// 정보 수집 대상에서 제외할 사용자 정의 헤더 목록 (Datadog Context)
export const ExcludeCollectionCustomHeaders = [CustomHeaderTypes.PRIZM_TOKEN, CustomHeaderTypes.PRIZM_REFRESH_TOKEN];
