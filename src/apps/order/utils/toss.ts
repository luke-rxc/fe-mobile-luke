import { tossRequestSuccess } from '../apis';

export const TossErrorCode = {
  // 사용자에 의해 결제가 취소되었습니다.
  PAY_PROCESS_CANCELED: 'PAY_PROCESS_CANCELED',
  // 결제 진행 중 승인에 실패하여 결제가 중단되었습니다.
  PAY_PROCESS_ABORTED: 'PAY_PROCESS_ABORTED',
  // 결제 승인이 거절되었습니다.
  REJECT_CARD_COMPANY: 'REJECT_CARD_COMPANY',
} as const;

export type TossQueryParams = {
  code?: string;
  message?: string;
  orderId?: string;
  paymentKey?: string;
  amount?: string;
};

export const toss = (params: TossQueryParams) => {
  const isFail = () => {
    return !!params.code;
  };

  const isUserCancel = () => {
    return params.code === TossErrorCode.PAY_PROCESS_CANCELED;
  };

  const approve = async () => {
    if (params?.orderId && params?.paymentKey && params?.amount) {
      const { orderId, paymentKey, amount } = params;

      return tossRequestSuccess({
        orderId,
        paymentKey,
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
