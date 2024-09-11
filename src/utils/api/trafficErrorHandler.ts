/**
 * HTTP Status 429 반환 예외처리
 */

import { AxiosError } from 'axios';

export const trafficErrorHandler = <T>(e: AxiosError<T>) => {
  if (e.response) {
    const {
      response: { status },
    } = e;

    if (status === 429) {
      const errObj = {
        ...e,
        response: {
          ...e.response,
          data: {
            code: '',
            title: '사용자가 많아 접속이 어렵습니다',
            message: '잠시 후 다시 시도해주세요',
          },
        },
      };

      return Promise.reject(errObj);
    }
  }

  return Promise.reject(e);
};
