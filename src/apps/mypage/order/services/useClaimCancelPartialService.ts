import { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { useQuery } from '@hooks/useQuery';
import { useMutation } from '@hooks/useMutation';
import { useWebInterface } from '@hooks/useWebInterface';
import { WebLinkTypes } from '@constants/link';
import { getWebLink } from '@utils/link';
import { useLocation } from 'react-router-dom';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { GenerateHapticFeedbackType } from '@constants/webInterface';
import { FeatureFlagsType } from '@contexts/FeatureFlagsContext';
import { useFeatureFlags } from '@hooks/useFeatureFlags';
import { getCancelPartialDetail, updateCancelPartial, getCancelPartialBundleItemList } from '../apis';
import {
  MYPAGE_CLAIM_CANCEL_PARTIAL_BUNDLE_QUERY_KEY,
  MYPAGE_CLAIM_CANCEL_PARTIAL_DETAILS_QUERY_KEY,
  PartialCancelInfoText,
  ProcessTypes,
} from '../constants';
import { toClaimCancelPartialBundleModel, toClaimCancelPartialModel } from '../models';
import { useLogService } from './useLogService';
import { useClaimStore } from '../stores';
import { ActionParams } from '../types';

interface ServiceParams {
  orderId: string;
  itemId?: string;
  itemOptionId?: string;
  processType: ValueOf<typeof ProcessTypes>;
  hasBundle?: string;
}

interface BundleGoodsProps {
  itemOptionId: number;
  itemId: number;
}

export const useClaimCancelPartialService = ({
  orderId,
  itemId,
  itemOptionId,
  processType,
  hasBundle,
}: ServiceParams) => {
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
  const { logMyOrderCompleteCancelOption, logMyOrderViewCancelOptionRequest, logMyOrderTabOrderCancelOption } =
    useLogService();
  /** 주문 상세 URL */
  const orderDetailUrl = getWebLink(WebLinkTypes.ORDER_DETAIL, { orderId });
  const defaultActions: Array<ActionParams> = [{ type: 'refetch' }];
  /** 사유 데이터 */
  const reasonItem = useClaimStore((state) => state.reasonItem);
  const updateReasonItem = useClaimStore((state) => state.updateReasonItem);
  const resetReasonItem = useClaimStore((state) => state.resetReasonItem);
  /** 기준 및 묶음 상품 데이터 */
  const itemInfoList = useClaimStore((state) => state.itemInfoList);
  const updateItemInfoList = useClaimStore((state) => state.updateItemInfoList);
  const resetItemInfoList = useClaimStore((state) => state.resetItemInfoList);
  /** 전체 데이터 초기화 */
  const resetAllData = useClaimStore((state) => state.resetAllData);
  /** 선택한 묶음 취소 상품 정보 */
  const [selectedBundleGoods, setSelectedBundleGoods] = useState<BundleGoodsProps[]>([]);

  /**
   * 취소 요청 정보 조회
   */
  const cancelPartialDetailQuery = useQuery(
    [MYPAGE_CLAIM_CANCEL_PARTIAL_DETAILS_QUERY_KEY, orderId, itemId, itemOptionId, reasonItem.reasonCode],
    () => getCancelPartialDetail({ orderId, itemInfoList, ...reasonItem }),
    {
      select: toClaimCancelPartialModel,
      enabled: itemInfoList.length > 0 && reasonItem.reasonCode !== '' && processType === ProcessTypes.CONFIRM,
      cacheTime: 0,
    },
  );
  const { data: cancelDetailData, isSuccess: isCancelDetailSuccess } = cancelPartialDetailQuery;

  /**
   * 취소할 상품 및 묶음 취소 상품 조회
   */
  const cancelPartialBundleQuery = useQuery(
    [MYPAGE_CLAIM_CANCEL_PARTIAL_BUNDLE_QUERY_KEY, orderId, itemId, itemOptionId],
    () => getCancelPartialBundleItemList({ orderId, itemId, itemOptionId }),
    {
      select: toClaimCancelPartialBundleModel,
      enabled: processType === ProcessTypes.BUNDLE,
      cacheTime: 0,
    },
  );

  /**
   * 취소 요청 처리
   */
  const { mutateAsync: executeOrderCancel, isLoading: isOrderCancelling } = useMutation(updateCancelPartial, {
    onSuccess: ({ cancelOrReturnId }: { cancelOrReturnId: number }, variables) => {
      if (!cancelOrReturnId) {
        showToastMessage({ message: PartialCancelInfoText.ERROR.DEFAULT_ERROR_MESSAGE });
        return;
      }

      const { reasonCode, reason = '' } = variables;

      // 부분취소 요청 완료 로그 (배송 상품)
      logMyOrderCompleteCancelOption({
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
        { type: 'toast', message: PartialCancelInfoText.CONFIRM.SUCCESS_TOAST_MESSAGE },
      ];

      // 데이터 초기화
      resetAllData();

      // 창 닫기 및 액션 전달
      close({ actions }, { url: orderDetailUrl, isModalDismiss: true });
    },
    onError: async (err) => {
      if (err.data?.message) {
        resetAllData();
        (await alert({
          message: err.data?.message ?? PartialCancelInfoText.ERROR.DEFAULT_ERROR_MESSAGE,
        })) && close({ actions: defaultActions }, { url: orderDetailUrl, isModalDismiss: true });
      } else {
        showToastMessage({ message: PartialCancelInfoText.ERROR.DEFAULT_ERROR_MESSAGE });
        handleAllowedNavigation();
      }
    },
    onSettled: () => {
      // 부분취소 요청 버튼 탭 시 로그 (배송상품)
      logMyOrderTabOrderCancelOption({ order_id: orderId });
    },
  });

  /** 취소 요청 호출 */
  const handleOrderCancel = async () => {
    generateHapticFeedback({ type: GenerateHapticFeedbackType.Confirm });
    const params = { orderId, itemInfoList, ...reasonItem };
    (await confirm({
      title: PartialCancelInfoText.CONFIRM.TITLE,
      message: PartialCancelInfoText.CONFIRM.MESSAGE,
      cancelButtonTitle: PartialCancelInfoText.CONFIRM.CANCEL_BUTTON_TITLE,
    })) && executeOrderCancel(params);
  };

  /**
   * 취소 요청 불가 주문인 경우 alert
   */
  const nonRefundableAlert = async () => {
    (await alert({
      title: PartialCancelInfoText.ALERT.TITLE,
      message: PartialCancelInfoText.ALERT.MESSAGE,
    })) && close({ actions: defaultActions }, { url: orderDetailUrl, isModalDismiss: true });
  };

  /**
   *  묶음 상품 체크 시 onChange 이벤트
   */
  const handleChangeBundleGoods = (selectItem: BundleGoodsProps) => {
    const isSelectedGoods = selectedBundleGoods.some(
      (goods: BundleGoodsProps) => goods.itemOptionId === selectItem.itemOptionId,
    );
    if (isSelectedGoods) {
      setSelectedBundleGoods((goodsList: BundleGoodsProps[]) =>
        goodsList.filter((goods: BundleGoodsProps) => goods.itemOptionId !== selectItem.itemOptionId),
      );
    } else {
      setSelectedBundleGoods((prevSeatList: BundleGoodsProps[]) => [...prevSeatList, selectItem]);
    }
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
   *  receiveData & history state -> store update 처리
   */
  // TODO: 추후 타입 구체화 필요
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInit = (initData: Record<string, any>) => {
    // processType 구분
    // app receiveData, web location state 구분
    const { reasonCode, reason, itemInfoList: initialItemInfoList } = initData;
    switch (processType) {
      case ProcessTypes.BUNDLE:
        break;
      case ProcessTypes.REASON:
        updateItemInfoList(initialItemInfoList);
        break;
      case ProcessTypes.CONFIRM:
        updateReasonItem({ reasonCode, reason });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (processType === ProcessTypes.BUNDLE) {
      setSelectedBundleGoods([]);
      resetItemInfoList();
    }
    if (processType === ProcessTypes.REASON) {
      resetItemInfoList();
      resetReasonItem();
    }
  }, [processType, hasBundle, resetItemInfoList, resetReasonItem]);

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
    isCancelDetailSuccess &&
      !cancelDetailData?.isRefundable &&
      cancelDetailData?.refundInfo?.refundableAmount &&
      cancelDetailData?.refundInfo.refundableAmount < 0 &&
      nonRefundableAlert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCancelDetailSuccess]);

  useEffect(() => {
    if (cancelDetailData && isCancelDetailSuccess) {
      // 부분 취소요청 화면 진입 시 로그
      logMyOrderViewCancelOptionRequest({ order_id: orderId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cancelDetailData, isCancelDetailSuccess]);

  return {
    cancelPartialDetailQuery,
    cancelPartialBundleQuery,
    selectedBundleGoods,
    isOrderCancelling,
    itemInfoList,
    handleOrderCancel,
    handleChangeBundleGoods,
    handleAllowedNavigation,
  };
};
