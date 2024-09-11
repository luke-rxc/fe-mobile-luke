import { useEffect, useState } from 'react';
import { useScript } from '@hooks/useScript';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    IMP: any;
  }
}

interface IMPCertRequestParams {
  merchant_uid: string;
  m_redirect_url: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const useIMPCertification = ({ shopId }: Record<string, any> = {}) => {
  const [impInstance, setImpInstance] = useState<any>(null);
  const { status: jQueryStatus } = useScript('https://code.jquery.com/jquery-1.12.4.min.js');
  const { status: impStatus } = useScript('https://cdn.iamport.kr/js/iamport.payment-1.1.8.js');

  function isReady(status: string) {
    return status === 'ready';
  }

  function certification(params: IMPCertRequestParams) {
    // 모바일 환경에서는 Redirect Mode
    const param = {
      ...params,
      popup: false,
    };
    if (impInstance) {
      impInstance.certification(param, () => {});
    }
  }

  useEffect(() => {
    if (isReady(jQueryStatus) && isReady(impStatus)) {
      const imp = window.IMP;
      if (imp && shopId) {
        imp.init(shopId);
        setImpInstance(imp);
      }
    }
  }, [shopId, jQueryStatus, impStatus]);

  return {
    impInstance,
    certification,
  };
};
