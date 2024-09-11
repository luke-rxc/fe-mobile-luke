import { useCallback } from 'react';
import { setLocalStorage } from '@utils/storage';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useIMPCertification } from '../hooks';
import { UserAdultInfoModel } from '../models';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    IMP: any;
  }
}

export type AuthIntegrateServiceParams = Pick<UserAdultInfoModel, 'shopId' | 'merchantId'>;

export interface CertificationParams {
  redirectUrl: string;
}

export const useAuthIntegrateService = ({ shopId = null, merchantId = null }: AuthIntegrateServiceParams) => {
  const { isAndroid, isApp } = useDeviceDetect();
  const { impInstance, certification: impCertification } = useIMPCertification({
    shopId,
  });
  const certification = useCallback(
    (params: CertificationParams) => {
      if (impInstance && merchantId) {
        const { redirectUrl } = params;
        isAndroid && isApp && setLocalStorage('ua', window.navigator.userAgent);
        impCertification({
          merchant_uid: merchantId,
          m_redirect_url: redirectUrl,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [impInstance],
  );
  return {
    impInstance,
    certification,
  };
};
