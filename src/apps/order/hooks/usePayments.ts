import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { setLocalStorage } from '@utils/storage';
import { PayRequestParam, PG_TYPE } from '../types';
import { useIMPPayment } from './useIMPPayment';
import { useTossPayment } from './useTossPayment';
import { useKakaoPay } from './useKakaoPay';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    IMP: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TossPayments: any;
  }
}

export const usePayments = () => {
  const { isAndroid, isApp } = useDeviceDetect();
  const { init: initImp, pay: payImp } = useIMPPayment();
  const { init: initToss, pay: payToss } = useTossPayment();
  const { init: initKakao, pay: payKakao } = useKakaoPay();

  const pay = (requests: PayRequestParam) => {
    if (requests.paymentGatewayParameter.pgType === PG_TYPE.IMP) {
      isAndroid && isApp && setLocalStorage('ua', window.navigator.userAgent);
      payImp(requests);
      return;
    }
    if (requests.paymentGatewayParameter.pgType === PG_TYPE.TOSS) {
      isAndroid && isApp && setLocalStorage('ua', window.navigator.userAgent);
      payToss(requests);
      return;
    }

    if (requests.paymentGatewayParameter.pgType === PG_TYPE.KAKAO) {
      isAndroid && isApp && setLocalStorage('ua', window.navigator.userAgent);
      payKakao(requests);
    }
  };

  const init = async (pgType: string, key: string) => {
    if (pgType === PG_TYPE.IMP) {
      return initImp(key);
    }

    if (pgType === PG_TYPE.TOSS) {
      return initToss(key);
    }

    if (pgType === PG_TYPE.KAKAO) {
      return initKakao();
    }
    return null;
  };

  return { pay, init };
};
