import { executeReIssueToken } from '@apis/reIssueToken';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@constants/auth';
import { AuthTokenErrorCode, AuthTokenSchema, IS_LOGIN_EVENT } from '@schemas/authTokenSchema';
import { getLocalStorage, setLocalStorage } from '@utils/storage';
import { createDebug } from '@utils/debug';
import axios, { AxiosPromise, AxiosRequestConfig, AxiosError } from 'axios';
import * as webInterface from '@utils/webInterface';
import { ReissueCompletedParams } from '@constants/webInterface';
import { userAgent } from '@utils/ua';
import { getIdentificationFlag, getDistinctId } from '@utils/abTest';
import { datadogRum, mixPanel } from '@utils/log';
import { ErrorDataModel } from './createAxios';

const { isApp, osVersion } = userAgent();
const debug = createDebug('utils:api:authInterceptor');

const getABTestHeaders = () => {
  const isExperiment = getIdentificationFlag();
  const version = (isApp && osVersion?.full) || null;
  const distinctId = getDistinctId();

  return {
    ...(isExperiment && { 'X-IDENTIFICATION-FLAG': 1 }),
    ...(distinctId && { 'X-MP-DISTINCT-ID': `${distinctId}` }),
    ...(version && { 'X-PRIZM-VERSION': version }),
  };
};

/**
 * 요청 마다 토큰 참조
 */
export function handleRequestHeader(config: AxiosRequestConfig) {
  const headerKeys = Object.keys(config.headers);
  const abTestHeaders = getABTestHeaders();

  return {
    ...config,
    headers: {
      ...config.headers,
      // 설정된 헤더가 있으면 넣고 없으면 제외
      ...(headerKeys.includes('X-PRIZM-TOKEN') && { 'X-PRIZM-TOKEN': getLocalStorage(ACCESS_TOKEN) ?? '' }),
      ...(headerKeys.includes('X-PRIZM-REFRESH-TOKEN') && {
        'X-PRIZM-REFRESH-TOKEN': getLocalStorage(REFRESH_TOKEN) ?? '',
      }),
      ...abTestHeaders,
    },
  };
}

/**
 * 페이지 진입시 User Api 에러 핸들러
 */
export function handleMeAuthError(error: AxiosError<ErrorDataModel>) {
  if (error.response) {
    const {
      response: { data },
      config,
    } = error;
    debug.error(error);

    if (isAuthTokenExpiredError(data?.code as AuthTokenErrorCode)) {
      return reIssue()
        .then(({ isSuccess, errorMessage, errorCode }) => {
          if (!isSuccess && errorCode) {
            const err = { errorMessage, errorCode };
            return Promise.reject(err);
          }

          return axios(handleRequestHeader(config));
        })
        .catch((err) => {
          const { errorMessage, errorCode } = err;
          debug.error(errorCode, errorMessage);
          const errObj = overrideError(error, { code: errorCode, message: errorMessage ?? '' });

          // Reissue - token invalid 오류
          if (isAuthTokenInvalidErrorCode(errorCode)) {
            return invalidateToken({ caller: 'handleMeAuthError', error });
          }

          // Reissue - 그외 오류
          return Promise.reject(errObj);
        });
    }

    if (isAuthTokenInvalidError(data?.code as AuthTokenErrorCode)) {
      return invalidateToken({ caller: 'handleMeAuthError', error });
    }
  }

  return Promise.reject(error);
}

/**
 * 토큰 인증 오류 처리
 */
/** @todo params 정확한 타입기재 필요 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleAuthResponseError(error: AxiosError<ErrorDataModel>): Promise<any> {
  debug.error(error);

  if (error.response) {
    const {
      response: { data },
    } = error;

    if (isAuthTokenExpiredError(data?.code as AuthTokenErrorCode)) {
      return handleAuthExpiredResponseError(error);
    }

    if (isAuthTokenInvalidError(data?.code as AuthTokenErrorCode)) {
      return invalidateToken({ caller: 'handleAuthResponseError', error });
    }
  }

  return Promise.reject(error);
}

/**
 * 일반 API 호출 토큰 Reissue 에러 핸들러
 */
function handleAuthExpiredResponseError(error: AxiosError<ErrorDataModel>) {
  const { config } = error;

  return wait(() => {
    return reIssue()
      .then((param) => {
        const { isSuccess } = param;

        if (!isSuccess) {
          return Promise.reject(param);
        }

        dispatch(true);
        retry();

        return param;
      })
      .catch(({ errorCode, errorMessage }) => {
        debug.error(errorCode, errorMessage);
        const errObj = overrideError(error, { code: errorCode ?? 500, message: errorMessage ?? '' });

        // Reissue - token invalid 오류
        if (isAuthTokenInvalidErrorCode(errorCode)) {
          return invalidateToken({ caller: 'handleAuthExpiredResponseError', error });
        }

        // Reissue - 그외 오류
        return Promise.reject(errObj);
      });
  }, config);
}

/**
 * 토큰 부적합 유무
 */
function isAuthTokenInvalidError(code: AuthTokenErrorCode): boolean {
  return (
    AuthTokenErrorCode.INVALID_TOKEN === code ||
    AuthTokenErrorCode.INVALID_REFRESH_TOKEN === code ||
    AuthTokenErrorCode.REFRESH_TOKEN_EXPIRED === code
  );
}

function isAuthTokenInvalidErrorCode(code: number) {
  return code < 500 && code >= 400;
}

/**
 * 토큰 만료 유무
 */
function isAuthTokenExpiredError(code: AuthTokenErrorCode): boolean {
  return AuthTokenErrorCode.TOKEN_EXPIRED === code;
}

let isFetched = false;
let retryRequests: (() => void)[] = [];

/**
 * 토큰 재발급 요청
 */
function reIssue(): Promise<ReissueCompletedParams> {
  return webInterface.reIssue({
    doWeb: () => {
      return executeReIssueToken()
        .then((schema) => {
          updateTokenLocalStorage(schema);
          return { isSuccess: true };
        })
        .catch((err) => {
          const { data } = err;
          const e = { errorCode: data?.code ?? 500, errorMessage: data?.message ?? '' };
          return Promise.reject(e);
        });
    },
  });
}

/**
 * 토큰 갱신시까지 대기
 * Promise<pending> 반환
 */
/** @todo params 정확한 타입기재 필요 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function wait(action: () => void | Promise<any>, config: AxiosRequestConfig): AxiosPromise<any> {
  return new Promise((resolve, reject) => {
    if (!isFetched) {
      isFetched = true;
      action()?.catch((e) => {
        flush();
        return reject(e);
      });
    }

    // 요청 임시 저장
    retryRequests.push(() => {
      resolve(axios(handleRequestHeader(config)));
    });
  });
}

/**
 * 유효하지 않은 토큰 처리 (리셋)
 */
async function invalidateToken(options?: { caller: string; error: AxiosError<ErrorDataModel> }) {
  if (options) {
    const { caller, error } = options;
    logToRUM(caller, error);
  }

  flush();
  webInterface.invalidatedToken({
    doWeb: () => {
      updateTokenLocalStorage();
      mixPanel.reset();
    },
  });

  await new Promise(() => {
    if (!isApp) {
      window.location.reload();
    }
  });
}

/**
 * Datadog Error Context
 */
interface DatadogErrorContext {
  /** 호출 주체 */
  caller: string;
  request: {
    url: string;
    method: string;
  };
  response: {
    /** api error code */
    code: string;
    /** api error message */
    message: string;
  };
}

/**
 * datadog 커스텀 에러 적재
 */
function logToRUM(caller: string, error: AxiosError<ErrorDataModel>) {
  if (!(error.response && error.response?.data)) {
    return;
  }

  const {
    response: { data },
    config,
  } = error;

  const context: DatadogErrorContext = {
    caller,
    request: {
      url: config.url ?? '',
      method: config.method ?? '',
    },
    response: {
      code: data.code,
      message: data.message,
    },
  };

  datadogRum.addError(new Error('invalidatedToken'), context);
}

/**
 * 토큰 갱신
 */
function updateTokenLocalStorage(tokenItem?: AuthTokenSchema) {
  setLocalStorage(ACCESS_TOKEN, tokenItem?.token ?? '');
  setLocalStorage(REFRESH_TOKEN, tokenItem?.refreshToken ?? '');
}

/**
 * 재요청
 */
function retry() {
  retryRequests.forEach((req: () => void) => req());
  flush();
}

/**
 * 요청 목록 초기화
 */
function flush() {
  retryRequests = [];
  isFetched = false;
}

/**
 * isLogin 갱신
 */
function dispatch(isLogin: boolean) {
  window.dispatchEvent(new CustomEvent(IS_LOGIN_EVENT, { detail: { isLogin } }));
}

/**
 * error를 기반으로 code, message를 교체한 객체를 생성
 */
function overrideError(error: AxiosError<ErrorDataModel>, options: { code: number; message: string }) {
  const { code, message } = options;
  return {
    ...error,
    response: {
      ...error.response,
      data: {
        ...error.response?.data,
        message,
      },
      code,
    },
    message: error.message,
  };
}
