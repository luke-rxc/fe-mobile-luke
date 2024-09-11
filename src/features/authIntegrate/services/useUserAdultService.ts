import qs from 'qs';
import { useMutation } from '@hooks/useMutation';
import { ErrorModel } from '@utils/api/createAxios';
import { useWebInterface } from '@hooks/useWebInterface';
import { useLink } from '@hooks/useLink';
import { userAgent } from '@utils/ua';

import { UniversalLinkTypes } from '@constants/link';
import { AdultMessage, AuthErrorCode } from '../constants';
import { getUserAdultInfo } from '../apis';
import { UserAdultInfoModel } from '../models';

export const useUserAdultService = () => {
  const { confirm, open, showToastMessage, alert } = useWebInterface();
  const { getLink, toLink } = useLink();

  /** 성인인증 여부 체크 */
  const { mutateAsync } = useMutation<UserAdultInfoModel>(getUserAdultInfo, {
    onError: (error: ErrorModel) => {
      const message = error.data?.message ?? AdultMessage.ERROR_AUTH_FAIL;
      if (error.data?.code === AuthErrorCode.UNDER_AGE) {
        alert({
          message,
        });
      } else {
        showToastMessage(
          {
            message,
          },
          {
            autoDismiss: 2000,
            direction: 'bottom',
          },
        );
      }
    },
  });

  /** App: 성인인증 UI(Confirm) 활성화 및 DeepLink 이동 */
  const toAuthAdultIntegrate = async (
    merchantId: string | null,
    shopId: string | null,
    confirmMessage = AdultMessage.REQUIRED_AUTH,
  ) => {
    const isConfirmOk = await confirm({
      title: confirmMessage,
    });

    if (isConfirmOk) {
      openAuthAdultIntegrateView(merchantId, shopId);
    }

    return Promise.resolve(isConfirmOk);
  };

  /** 인증 View Page */
  const openAuthAdultIntegrateView = (merchantId: string | null, shopId: string | null) => {
    const { isInstagramInApp } = userAgent();
    const url = getLink(UniversalLinkTypes.MEMBER_AUTH_ADULT);
    const initialData = {
      merchantId,
      shopId,
    };

    if (isInstagramInApp) {
      const query = qs.stringify({
        ...initialData,
        fallback: encodeURIComponent(window.location.pathname),
      });

      toLink(`${url}?${query}`);
      return;
    }

    open({ url, initialData });
  };

  return {
    handleGetUserAdultInfo: mutateAsync,
    toAuthAdultIntegrate,
    openAuthAdultIntegrateView,
  };
};
