import { useQuery } from '@hooks/useQuery';
import { useMutation } from '@hooks/useMutation';
import { WebLinkTypes } from '@constants/link';
import { getWebLink } from '@utils/link';
import { useWebInterface } from '@hooks/useWebInterface';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import isEmpty from 'lodash/isEmpty';
import { GenerateHapticFeedbackType } from '@constants/webInterface';
import { FeatureFlagsType } from '@contexts/FeatureFlagsContext';
import { useFeatureFlags } from '@hooks/useFeatureFlags';
import { getCancelFullDetail, updateCancelFull } from '../apis';
import { FullCancelInfoText, MYPAGE_CLAIM_CANCEL_FULL_DETAILS_QUERY_KEY, ProcessTypes } from '../constants';
import { toClaimCancelFullModel } from '../models';
import { useLogService } from './useLogService';
import { useClaimStore } from '../stores';
import { ActionParams } from '../types';

interface ServiceParams {
  orderId: string;
  processType: ValueOf<typeof ProcessTypes>;
}

export const useClaimCancelFullService = ({ orderId, processType }: ServiceParams) => {
  const { getFeatureFlagsActiveStatus } = useFeatureFlags();
  const activeFeatureFlag = getFeatureFlagsActiveStatus(FeatureFlagsType.MY_PAGE_ORDER_STATE);

  const {
    alert,
    showToastMessage,
    close,
    confirm,
    purchaseCancelled,
    purchaseStatusUpdated,
    initialValues,
    generateHapticFeedback,
    setSystemNavigation,
  } = useWebInterface();
  const { state: pushedState } = useLocation();
  const { isApp } = useDeviceDetect();
  const { logMyOrderCompleteRefundOrder, logMyOrderTabRefundOrder, logMyOrderViewRefundOrderRequest } = useLogService();

  /** 주문 상세 URL */
  const orderDetailUrl = getWebLink(WebLinkTypes.ORDER_DETAIL, { orderId });
  const defaultActions: Array<ActionParams> = [{ type: 'refetch' }];
  const reasonItem = useClaimStore((state) => state.reasonItem);
  const updateReasonItem = useClaimStore((state) => state.updateReasonItem);
  const resetReasonItem = useClaimStore((state) => state.resetReasonItem);
  const { data, error, isError, isLoading, isFetched, isSuccess } = useQuery(
    [MYPAGE_CLAIM_CANCEL_FULL_DETAILS_QUERY_KEY, orderId, reasonItem.reasonCode],
    () => getCancelFullDetail({ orderId, ...reasonItem }),
    {
      select: toClaimCancelFullModel,
      enabled: reasonItem.reasonCode !== '' && processType === ProcessTypes.CONFIRM,
      cacheTime: 0,
    },
  );

  const { mutateAsync: executeOrderCancel, isLoading: isOrderCancelling } = useMutation(updateCancelFull, {
    onSuccess: ({ cancelOrReturnId }: { cancelOrReturnId: number }, variables) => {
      if (!cancelOrReturnId) {
        showToastMessage({ message: FullCancelInfoText.ERROR.DEFAULT_ERROR_MESSAGE });
        return;
      }

      const { reasonCode, reason = '' } = variables;
      const orderQuantity = data?.orderCancelGoods.length;

      // 주문 취소 완료 로그
      logMyOrderCompleteRefundOrder({
        order_id: orderId,
        reason_code: reasonCode,
        reason,
        order_quantity: orderQuantity ?? 0,
      });

      // 주문 목록 갱신을 위한 인터페이스 호출
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      activeFeatureFlag // >= 1.38.0 || mweb
        ? purchaseStatusUpdated({ orderId: +orderId, type: 'cancel' })
        : purchaseCancelled({ orderId: +orderId, type: 'cancel' });

      // TODO: ReceiveData에 대한 타입 개선이 공통적으로 필요하며, 우선 기존 코드 유지함.
      // 주문 상세 액션
      const actions: Array<ActionParams> = [
        ...defaultActions,
        { type: 'toast', message: FullCancelInfoText.CONFIRM.SUCCESS_TOAST_MESSAGE },
      ];

      // reasonItem 데이터 초기화
      resetReasonItem();
      // 창 닫기 및 액션 전달
      close({ actions }, { url: orderDetailUrl, isModalDismiss: true });
    },
    onError: async (err) => {
      if (err.data?.message) {
        resetReasonItem();
        (await alert({
          message: err.data?.message ?? FullCancelInfoText.ERROR.DEFAULT_ERROR_MESSAGE,
        })) && close({ actions: defaultActions }, { url: orderDetailUrl, isModalDismiss: true });
      } else {
        showToastMessage({ message: FullCancelInfoText.ERROR.DEFAULT_ERROR_MESSAGE });
        handleAllowedNavigation();
      }
    },
    onSettled: () => {
      // 주문 취소 요청 버튼 탭 시 로그
      logMyOrderTabRefundOrder({
        order_id: orderId,
      });
    },
  });

  const handleOrderCancel = async () => {
    generateHapticFeedback({ type: GenerateHapticFeedbackType.Confirm });
    const params = { orderId, ...reasonItem };
    (await confirm({
      title: FullCancelInfoText.CONFIRM.TITLE,
      message: FullCancelInfoText.CONFIRM.MESSAGE,
      cancelButtonTitle: FullCancelInfoText.CONFIRM.CANCEL_BUTTON_TITLE,
    })) && executeOrderCancel(params);
  };

  /**
   * 취소 요청 불가 주문인 경우 alert
   */
  const nonRefundableAlert = async () => {
    (await alert({
      title: FullCancelInfoText.ALERT.TITLE,
      message: FullCancelInfoText.ALERT.MESSAGE,
    })) && close({ actions: defaultActions }, { url: orderDetailUrl, isModalDismiss: true });
  };

  /**
   *  취소 요청 시 화면 이탈 가능 여부 설정
   */
  const handleAllowedNavigation = (allowed = true) => {
    setSystemNavigation({
      isPopAllowed: allowed,
      isDismissAllowed: allowed,
    });
  };

  /**
   *  receiveData & history state 처리
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInit = (initData: Record<string, any>) => {
    // processType 구분
    // app receiveData, web location state 구분

    const { reasonCode, reason } = initData;
    switch (processType) {
      case ProcessTypes.REASON:
        break;
      case ProcessTypes.CONFIRM:
        updateReasonItem({ reasonCode, reason });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (processType === ProcessTypes.REASON) {
      resetReasonItem();
    }
  }, [processType, resetReasonItem]);

  useEffect(() => {
    // web & history state 있는 경우
    if (!isApp && !isEmpty(pushedState)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handleInit(pushedState as Record<string, any>);
    }
    // app & initialValues 있는 경우
    if (isApp && !isEmpty(initialValues)) {
      handleInit(initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues, pushedState]);

  useEffect(() => {
    isSuccess &&
      !data?.isRefundable &&
      data?.refundInfo?.refundableAmount &&
      data?.refundInfo.refundableAmount < 0 &&
      nonRefundableAlert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  useEffect(() => {
    if (data && isSuccess) {
      // 전체 취소 요청 화면 진입 시 로그
      logMyOrderViewRefundOrderRequest({ order_id: orderId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess]);

  return {
    orderDetail: data,
    orderDetailError: error,
    isOrderDetailError: isError,
    isOrderDetailLoading: isLoading,
    isOrderDetailFetched: isFetched,
    isOrderDetailSuccess: isSuccess,
    isOrderCancelling,
    handleOrderCancel,
    handleAllowedNavigation,
  };
};
