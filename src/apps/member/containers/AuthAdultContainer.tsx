import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { env } from '@env';
import { SEO } from '@pui/seo';
import { useLoadingStore } from '@stores/useLoadingStore';
import { useWebInterface } from '@hooks/useWebInterface';
import { useQueryString } from '@hooks/useQueryString';
import { AdultMessage } from '@features/authIntegrate/constants';
import { AuthIntegrateServiceParams, useAuthIntegrateService } from '@features/authIntegrate/services';
import { useAuthPageClose } from '@features/authIntegrate/hooks';
import { userAgent } from '@utils/ua';

export const AuthAdultContainer: React.FC = () => {
  const { initialValues, alert } = useWebInterface();
  const showLoading = useLoadingStore((state) => state.showLoading);
  const hideLoading = useLoadingStore((state) => state.hideLoading);
  const showAlert = useCallback(async (message: string) => alert({ message }), [alert]);
  const { closePage } = useAuthPageClose();
  const [options, setOptions] = useState<AuthIntegrateServiceParams>({
    shopId: null,
    merchantId: null,
  });
  const { impInstance, certification } = useAuthIntegrateService(options);
  const history = useHistory();
  const { isInstagramInApp } = userAgent();
  const queryString = useQueryString<{ shopId?: string; merchantId?: string; fallback?: string }>();

  useEffect(() => {
    const checkInitial = async () => {
      const checkValues = isInstagramInApp ? queryString : initialValues;
      if (!checkValues) {
        if (await showAlert(AdultMessage.ERROR_AUTH_INFO)) {
          if (isInstagramInApp) {
            history.goBack();
            return;
          }
          closePage({
            isAuthSuccess: false,
            message: AdultMessage.CANCEL_AUTH,
          });
        }
        return;
      }

      const { merchantId, shopId } = checkValues;
      if (!merchantId || !shopId) {
        if (await showAlert(AdultMessage.ERROR_AUTH_INFO)) {
          if (isInstagramInApp) {
            history.goBack();
            return;
          }
          closePage({
            isAuthSuccess: false,
            message: AdultMessage.CANCEL_AUTH,
          });
        }
        return;
      }

      setOptions({ merchantId, shopId });
    };

    showLoading();
    checkInitial();

    return () => {
      hideLoading();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (options && options.merchantId && options.shopId) {
      if (impInstance) {
        const baseRedirectUrl = `${env.endPoint.baseUrl}/member/auth/adult/complete`;

        certification({
          // Local Test 시
          // redirectUrl: 'http://mweb-local.prizm.co.kr:3000/member/auth/adult/complete',
          redirectUrl: isInstagramInApp ? `${baseRedirectUrl}?fallback=${queryString.fallback ?? ''}` : baseRedirectUrl,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(options), impInstance, certification]);

  return (
    <SEO
      meta={[
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no',
        },
      ]}
    />
  );
};
