import { useRef } from 'react';
import { PayRequestParam } from '../types';
import { redirectOrderCompleteUrl } from '../utils';
import { useScript } from './useScript';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    IMP: any;
  }
}

interface IMPPayRequestParam {
  pg: string;
  pay_method: string;
  merchant_uid: string;
  name: string;
  amount: number;
  buyer_email: string;
  buyer_name: string;
  buyer_tel: string;
  m_redirect_url: string;
  app_scheme?: string;
}

const JQUERY_SRC = 'https://code.jquery.com/jquery-1.12.4.min.js';
const IMPORT_SRC = 'https://cdn.iamport.kr/js/iamport.payment-1.1.8.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const useIMPPayment = () => {
  const { load: loadJquery } = useScript();
  const { load: loadImp } = useScript();

  const impRef = useRef<any | null>(null);

  function pay(source: PayRequestParam) {
    if (impRef.current) {
      const pg = impRef.current;
      const params = toIMPParams(source);
      pg.request_pay(params, () => {});
    }
  }

  const toIMPParams = (source: PayRequestParam): IMPPayRequestParam => {
    const { paymentGatewayParameter, appScheme } = source;
    const {
      pg: pgType,
      payMethod,
      merchantId,
      name,
      amount,
      buyerEmail,
      buyerName,
      buyerTel,
      naverPopupMode,
      naverProducts,
    } = paymentGatewayParameter;

    const mRedirectUrl = redirectOrderCompleteUrl(source);

    return {
      pg: pgType,
      pay_method: payMethod,
      merchant_uid: merchantId,
      name,
      amount,
      buyer_email: buyerEmail,
      buyer_name: buyerName,
      buyer_tel: buyerTel,
      m_redirect_url: mRedirectUrl,
      ...(payMethod === 'naverpay' && {
        naverPopupMode,
        naverProducts,
      }),
      ...(appScheme && { app_scheme: appScheme }),
    };
  };
  const init = async (key: string) => {
    if (impRef.current) {
      return impRef.current;
    }

    await loadJquery(JQUERY_SRC);
    await loadImp(IMPORT_SRC);

    const imp = window.IMP;
    imp.init(key);
    impRef.current = imp;

    return impRef.current;
  };

  return {
    init,
    pay,
  };
};
