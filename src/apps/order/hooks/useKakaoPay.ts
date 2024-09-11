import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { kakaoPayRequestPrepare } from '../apis';
import { PayRequestParam } from '../types';
import { KakaoPayErrorCode, redirectOrderCompleteUrl } from '../utils';

export const useKakaoPay = () => {
  const { isApp } = useDeviceDetect();

  const pay = async (param: PayRequestParam) => {
    const redirectUrl = redirectOrderCompleteUrl(param);
    const approvalUrl = `${redirectUrl}&amount=${param.paymentGatewayParameter.amount}`;
    const failUrl = `${redirectUrl}&code=${KakaoPayErrorCode.PAY_PROCESS_FAILED}`;
    const cancelUrl = `${redirectUrl}&code=${KakaoPayErrorCode.PAY_PROCESS_CANCELED}`;
    const { orderId } = param;

    try {
      const { nextRedirectAppUrl, nextRedirectMobileUrl } = await kakaoPayRequestPrepare({
        orderId: `${orderId}`,
        approvalUrl,
        cancelUrl,
        failUrl,
      });

      const kakaoUrl = isApp ? nextRedirectAppUrl : nextRedirectMobileUrl;

      window.location.href = kakaoUrl;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      window.location.href = `${failUrl}&message=${e.data?.message}`;
    }
  };

  const init = async () => {
    return true;
  };

  return {
    init,
    pay,
  };
};
