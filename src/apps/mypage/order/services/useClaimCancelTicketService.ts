import { useEffect } from 'react';
import { useQuery } from '@hooks/useQuery';
import { useMutation } from '@hooks/useMutation';
import { useWebInterface } from '@hooks/useWebInterface';
import { WebLinkTypes } from '@constants/link';
import { getWebLink } from '@utils/link';
import { formatInTimeZone } from '@utils/date';
import isEmpty from 'lodash/isEmpty';
import { useLocation } from 'react-router-dom';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { GenerateHapticFeedbackType } from '@constants/webInterface';
import { FeatureFlagsType } from '@contexts/FeatureFlagsContext';
import { useFeatureFlags } from '@hooks/useFeatureFlags';
import { getCancelTicketDetail, updateCancelTicket } from '../apis';
import { MYPAGE_CLAIM_CANCEL_TICKET_DETAILS_QUERY_KEY, TicketCancelInfoText, ProcessTypes } from '../constants';
import { toClaimCancelPartialModel } from '../models';
import { useLogService } from './useLogService';
import { useClaimStore } from '../stores';
import { ActionParams } from '../types';

interface ServiceParams {
  orderId: string;
  exportId?: string;
  processType: ValueOf<typeof ProcessTypes>;
}

export const useClaimCancelTicketService = ({ orderId, exportId, processType }: ServiceParams) => {
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
  const {
    logMyOrderCompleteCancelTicket,
    logMyOrderViewOrderCancelDetail,
    logMyOrderTabCancelPolicyMore,
    logMyOrderTabOrderCancelRequest,
  } = useLogService();
  /** 주문 상세 URL */
  const orderDetailUrl = getWebLink(WebLinkTypes.ORDER_DETAIL, { orderId });
  const defaultActions: Array<ActionParams> = [{ type: 'refetch' }];
  /** 사유 데이터 */
  const reasonItem = useClaimStore((state) => state.reasonItem);
  const updateReasonItem = useClaimStore((state) => state.updateReasonItem);
  const resetReasonItem = useClaimStore((state) => state.resetReasonItem);

  /** 취소 요청 정보 조회 */
  const { data, error, isError, isLoading, isFetched, isSuccess } = useQuery(
    [MYPAGE_CLAIM_CANCEL_TICKET_DETAILS_QUERY_KEY, orderId, exportId, reasonItem.reasonCode],
    () => getCancelTicketDetail({ orderId, exportId, ...reasonItem }),
    {
      select: toClaimCancelPartialModel,
      enabled: reasonItem.reasonCode !== '' && processType === ProcessTypes.CONFIRM,
      cacheTime: 0,
    },
  );

  /** 취소 요청 */
  const { mutateAsync: executeOrderCancel, isLoading: isOrderCancelling } = useMutation(updateCancelTicket, {
    onSuccess: ({ cancelOrReturnId }: { cancelOrReturnId: number }, variables) => {
      if (!cancelOrReturnId) {
        // TODO: 해당 케이스 체크
        showToastMessage({ message: TicketCancelInfoText.ERROR.DEFAULT_ERROR_MESSAGE });
        return;
      }

      const { reasonCode, reason = '' } = variables;

      // 부분취소 요청 완료 로그 (티켓 상품)
      logMyOrderCompleteCancelTicket({
        order_id: orderId,
        reason_code: reasonCode,
        reason,
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
        { type: 'toast', message: TicketCancelInfoText.CONFIRM.SUCCESS_TOAST_MESSAGE },
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
          message: err.data?.message,
        })) && close({ actions: defaultActions }, { url: orderDetailUrl, isModalDismiss: true });
      } else {
        showToastMessage({ message: TicketCancelInfoText.ERROR.DEFAULT_ERROR_MESSAGE });
        handleAllowedNavigation();
      }
    },
    onSettled: () => {
      // 취소 요청 호출 시 이벤트 로깅
      data &&
        data.orderCancelGoods &&
        data.cancellationInfo &&
        data.cancellationInfo.bookingDate &&
        logMyOrderTabOrderCancelRequest({
          order_id: orderId,
          goods_id: `${data.orderCancelGoods[0].goodsId}`,
          goods_name: data.orderCancelGoods[0].goodsName,
          booking_date: formatInTimeZone(data.cancellationInfo.bookingDate, 'yyyy-MM-dd'),
        });
    },
  });

  const handleOrderCancel = async () => {
    generateHapticFeedback({ type: GenerateHapticFeedbackType.Confirm });
    const params = { orderId, exportId, ...reasonItem };
    (await confirm({
      title: TicketCancelInfoText.CONFIRM.TITLE,
      message: TicketCancelInfoText.CONFIRM.MESSAGE,
      cancelButtonTitle: TicketCancelInfoText.CONFIRM.CANCEL_BUTTON_TITLE,
    })) && executeOrderCancel(params);
  };

  /**
   * 취소 요청 불가 주문인 경우 alert
   */
  const nonRefundableAlert = async () => {
    (await alert({
      title: TicketCancelInfoText.ALERT.TITLE,
      message: TicketCancelInfoText.ALERT.MESSAGE,
    })) && close({ actions: defaultActions }, { url: orderDetailUrl, isModalDismiss: true });
  };

  /**
   * 취소 수수료 정책 더보기 클릭 시 이벤트 로깅
   */
  const handleLogCancelPolicyMore = () => {
    data &&
      data.orderCancelGoods &&
      logMyOrderTabCancelPolicyMore({
        goods_id: `${data.orderCancelGoods[0].goodsId}`,
        goods_name: data.orderCancelGoods[0].goodsName,
      });
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

  /**
   * 취소 요청 상세 진입 시 이벤트 로깅
   */
  useEffect(() => {
    isSuccess &&
      data &&
      data.orderCancelGoods &&
      logMyOrderViewOrderCancelDetail({
        order_id: orderId,
        goods_id: `${data.orderCancelGoods[0].goodsId}`,
        goods_name: data.orderCancelGoods[0].goodsName,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, data]);

  return {
    orderDetail: data,
    orderDetailError: error,
    isOrderDetailError: isError,
    isOrderDetailLoading: isLoading,
    isOrderDetailFetched: isFetched,
    isOrderDetailSuccess: isSuccess,
    isOrderCancelling,
    nonRefundableAlert,
    handleOrderCancel,
    handleLogCancelPolicyMore,
    handleAllowedNavigation,
  };
};
