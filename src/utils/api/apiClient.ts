import { REFRESH_TOKEN, ACCESS_TOKEN } from '@constants/auth';
import { getLocalStorage } from '@utils/storage';
import { getDeviceChannel, getDeviceId } from '@utils/device';
import { env } from '../../env';
import { handleAuthResponseError, handleMeAuthError, handleRequestHeader } from './authInterceptor';
import { createAxios } from './createAxios';
import { trafficErrorHandler } from './trafficErrorHandler';
import { handleDebugLog, handleDatadogCustomHeader } from './logHandler';

const deviceId = getDeviceId();

const baseApiClientProps = {
  baseURL: env.endPoint.apiBaseUrl,
  headers: {
    common: {
      Accept: 'application/json',
    },
  },
  withCredentials: false,
  config: {
    headers: {
      'X-PRIZM-CHANNEL': getDeviceChannel(),
      'X-PRIZM-TOKEN': getLocalStorage(ACCESS_TOKEN) ?? '',
      ...(deviceId && { 'X-PRIZM-DEVICE-ID': deviceId }),
    },
  },
};

export const meApiClient = createAxios({ ...baseApiClientProps });
meApiClient.interceptors.request.use(handleDebugLog);
meApiClient.interceptors.request.use(handleDatadogCustomHeader);
meApiClient.interceptors.request.use(handleRequestHeader);
meApiClient.interceptors.response.use((__) => __, handleMeAuthError);

// Instance : 기본 API 호출
export const baseApiClient = createAxios(baseApiClientProps);
baseApiClient.interceptors.request.use(handleDebugLog);
baseApiClient.interceptors.request.use(handleDatadogCustomHeader);
baseApiClient.interceptors.request.use(handleRequestHeader);
baseApiClient.interceptors.response.use((__) => __, handleAuthResponseError);
baseApiClient.interceptors.response.use((__) => __, trafficErrorHandler);

// Instance : 인증 관련 API 호출시
export const authApiClient = createAxios({
  baseURL: env.endPoint.apiBaseUrl,
  headers: {
    common: {
      Accept: 'application/json',
    },
  },
  withCredentials: false,
  config: {
    headers: {
      'X-PRIZM-CHANNEL': getDeviceChannel(),
      'X-PRIZM-TOKEN': getLocalStorage(ACCESS_TOKEN) ?? '',
      'X-PRIZM-REFRESH-TOKEN': getLocalStorage(REFRESH_TOKEN) ?? '',
      ...(deviceId && { 'X-PRIZM-DEVICE-ID': deviceId }),
    },
  },
});
authApiClient.interceptors.request.use(handleDebugLog);
authApiClient.interceptors.request.use(handleDatadogCustomHeader);
authApiClient.interceptors.request.use(handleRequestHeader);
authApiClient.interceptors.response.use(
  (__) => __,
  (err) => {
    return Promise.reject(new Error(err));
  },
);

// Instance : multipart/form-data API 호출시
export const baseFormMultipartApi = createAxios({
  baseURL: env.endPoint.apiBaseUrl,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: false,
  config: {
    headers: {
      'X-PRIZM-CHANNEL': getDeviceChannel(),
      'X-PRIZM-TOKEN': getLocalStorage(ACCESS_TOKEN) ?? '',
      ...(deviceId && { 'X-PRIZM-DEVICE-ID': deviceId }),
    },
  },
});
baseFormMultipartApi.interceptors.request.use(handleDatadogCustomHeader);
baseFormMultipartApi.interceptors.request.use(handleRequestHeader);
baseFormMultipartApi.interceptors.response.use((__) => __, handleAuthResponseError);

// multipart/form-data API 호출시 - 신규 업로드 서버 baseURL
export const baseUploadFormMultipartApi = createAxios({
  baseURL: env.endPoint.uploadApiBaseUrl,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: false,
  config: {
    headers: {
      'X-PRIZM-CHANNEL': getDeviceChannel(),
      'X-PRIZM-TOKEN': getLocalStorage(ACCESS_TOKEN) ?? '',
      ...(deviceId && { 'X-PRIZM-DEVICE-ID': deviceId }),
    },
  },
});
baseUploadFormMultipartApi.interceptors.request.use(handleDatadogCustomHeader);
baseUploadFormMultipartApi.interceptors.request.use(handleRequestHeader);
baseUploadFormMultipartApi.interceptors.response.use((__) => __, handleAuthResponseError);

const mobileWenApiClientProps = {
  baseURL: env.endPoint.apiBaseUrl,
  headers: {
    common: {
      Accept: 'application/json',
    },
  },
  withCredentials: false,
  config: {
    headers: {
      'X-PRIZM-CHANNEL': 'MWEB',
      'X-PRIZM-TOKEN': getLocalStorage(ACCESS_TOKEN) ?? '',
    },
  },
};

// Instance : 모바일 웹 API 호출
export const mobileWebApiClient = createAxios(mobileWenApiClientProps);
mobileWebApiClient.interceptors.request.use(handleDatadogCustomHeader);
mobileWebApiClient.interceptors.request.use(handleRequestHeader);
mobileWebApiClient.interceptors.response.use((__) => __, handleAuthResponseError);

// config 도메인 호출
const configApiProps = {
  baseURL: env.endPoint.configBaseUrl,
  headers: {
    common: {
      Accept: 'application/json',
    },
  },
  withCredentials: false,
};

export const configApiClient = createAxios(configApiProps);
configApiClient.interceptors.request.use(handleDatadogCustomHeader);
