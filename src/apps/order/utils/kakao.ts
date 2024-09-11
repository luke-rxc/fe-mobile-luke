import { kakaoPayRequestSuccess } from '../apis';

export const KakaoPayErrorCode = {
  PAY_PROCESS_CANCELED: 'PAY_PROCESS_CANCELED',
  PAY_PROCESS_FAILED: 'PAY_PROCESS_FAILED',
};

export type KakaoQueryParams = {
  orderId?: string;
  code?: string;
  message?: string;
  amount?: string;
  pg_token?: string;
};

export const kakao = (params: KakaoQueryParams) => {
  const isFail = () => {
    return !!params.code;
  };

  const isUserCancel = () => {
    return params.code === KakaoPayErrorCode.PAY_PROCESS_CANCELED;
  };

  const approve = async () => {
    if (params.pg_token && params.amount && params.orderId) {
      const { pg_token: pgToken, amount, orderId } = params;

      return kakaoPayRequestSuccess({
        orderId,
        pgToken,
        amount: +amount,
      })
        .then(() => true)
        .catch(() => false);
    }

    return false;
  };

  return {
    isFail,
    isUserCancel,
    approve,
  };
};
