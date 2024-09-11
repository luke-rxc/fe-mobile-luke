import { getUserpaymentInfo } from '@apis/user';
import { AppLinkTypes } from '@constants/link';
import { userAutoPaymenyQueryKey } from '@constants/user';
import env from '@env';
import { CALL_WEB_EVENT_TYPE } from '@features/delivery/constants';
import { CALL_WEB_EVENT } from '@features/prizmPay/constants';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useWebInterface } from '@hooks/useWebInterface';
import { toUserPaymentModel } from '@models/UserModel';
import { getAppLink } from '@utils/link';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
// import { useParams } from 'react-router';

export type ReturnTypeUseLiveAuthAuctionEditService = ReturnType<typeof useLiveAuthAuctionEditService>;

export const useLiveAuthAuctionEditService = () => {
  // const { liveId } = useParams<{ liveId?: string }>();
  const { isApp, isIOS, osVersion } = useDeviceDetect();
  const { open, receiveValues, close } = useWebInterface();
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);

  const {
    data: liveAutoPaymentInfo,
    isLoading: isLoadingLiveAutoPaymentInfo,
    isError: isErrorLiveAutoPaymentInfo,
  } = useQuery([userAutoPaymenyQueryKey], () => getUserpaymentInfo(), {
    select: (data) => {
      return toUserPaymentModel(data);
    },
    enabled: isApp,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isEmpty(receiveValues)) {
      return;
    }

    const { type } = receiveValues;

    switch (type) {
      case CALL_WEB_EVENT_TYPE.ON_DELIVERY_CLOSE:
      case CALL_WEB_EVENT.ON_PAY_CLOSE:
        queryClient.invalidateQueries([userAutoPaymenyQueryKey]);
        break;

      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiveValues]);

  /**
   * 결제수단 클릭
   */
  const handleClickPayment = () => {
    const url = getAppLink(AppLinkTypes.WEB, {
      landingType: 'modal',
      url: `${env.endPoint.baseUrl}/mypage/manage-pay`,
    });

    open({ url, initialData: { type: 'onAuctionEntryOpen' } });
  };

  /**
   * 배송정보 클릭
   */
  const handleClickDelivery = () => {
    const url = getAppLink(AppLinkTypes.WEB, {
      landingType: 'modal',
      url: `${env.endPoint.baseUrl}/mypage/manage-delivery`,
    });

    open({ url, initialData: { type: 'onAuctionEntryOpen' } });
  };

  /**
   * 완료 클릭
   */
  const handleClickComplete = () => {
    close();
  };

  return {
    liveAutoPaymentInfo,
    isLoading: isLoadingLiveAutoPaymentInfo || !mounted,
    isError: isErrorLiveAutoPaymentInfo || !isApp,
    isExtraMarginDevice: isIOS && osVersion?.major === 14,
    actions: {
      onClickPayment: handleClickPayment,
      onClickDelivery: handleClickDelivery,
      onClickComplete: handleClickComplete,
    },
  };
};
