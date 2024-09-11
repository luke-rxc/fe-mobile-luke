import { useRef } from 'react';
import { PayRequestParam } from '../types';
import { redirectOrderCompleteUrl } from '../utils';
import { useScript } from './useScript';

const TOSS_SRC = 'https://js.tosspayments.com/v1/payment';

export const useTossPayment = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tossRef = useRef<any | null>(null);
  const { load } = useScript();

  function pay(param: PayRequestParam) {
    if (tossRef.current) {
      const pg = tossRef.current;
      const type = toTossPayType(param);
      const info = toTossPayInfo(param);
      pg.requestPayment(type, info);
    }
  }

  const toTossPayType = (source: PayRequestParam) => {
    const {
      paymentGatewayParameter: { pg: type },
    } = source;

    return type;
  };

  const toTossPayInfo = (source: PayRequestParam) => {
    const {
      paymentGatewayParameter: {
        payMethod,
        isEasyPay,
        name: orderName,
        amount,
        buyerEmail: customerEmail,
        buyerName: customerName,
        cardCompany,
        useAppCardOnly,
      },
      orderId,
    } = source;
    const successUrl = redirectOrderCompleteUrl(source);
    const failUrl = redirectOrderCompleteUrl(source);

    return {
      amount,
      orderId,
      orderName,
      customerName,
      customerEmail,
      successUrl,
      failUrl,
      maxCardInstallmentPlan: 18,
      useAppCardOnly,
      ...(isEasyPay && { flowMode: 'DIRECT', easyPay: payMethod }),
      ...(cardCompany && { cardCompany }),
    };
  };

  const init = async (key: string) => {
    if (tossRef.current) {
      return tossRef.current;
    }

    await load(TOSS_SRC);

    const { TossPayments } = window;
    tossRef.current = new TossPayments(key);

    return tossRef.current;
  };

  return {
    init,
    pay,
  };
};
