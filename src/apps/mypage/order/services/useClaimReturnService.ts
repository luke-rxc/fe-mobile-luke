import { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { useQuery } from '@hooks/useQuery';
import { useMutation } from '@hooks/useMutation';
import { useWebInterface } from '@hooks/useWebInterface';
import { WebLinkTypes } from '@constants/link';
import { getWebLink } from '@utils/link';
import { useLocation } from 'react-router-dom';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { FeatureFlagsType } from '@contexts/FeatureFlagsContext';
import { useFeatureFlags } from '@hooks/useFeatureFlags';
import { getReturnDetail, getReturnBundleItemList, updateReturn } from '../apis';
import {
  MYPAGE_CLAIM_RETURN_BUNDLE_QUERY_KEY,
  MYPAGE_CLAIM_RETURN_INFO_QUERY_KEY,
  ProcessTypes,
  ReturnInfoText,
} from '../constants';
import { toClaimReturnBundleModel, toClaimReturnModel } from '../models';
import { useClaimStore } from '../stores';
import { ActionParams } from '../types';
import { useLogService } from './useLogService';

interface ServiceParams {
  orderId: string;
  itemId?: string;
  itemOptionId?: string;
  exportId?: string;
  processType: ValueOf<typeof ProcessTypes>;
  hasBundle?: string;
}

interface BundleGoodsProps {
  itemOptionId: number;
  itemId: number;
  exportId: number;
}

export const useClaimReturnService = ({
  orderId,
  itemId,
  itemOptionId,
  exportId,
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
    setSystemNavigation,
  } = useWebInterface();
  const { state: pushedState } = useLocation();
  const { isApp } = useDeviceDetect();
  const { logMyOrderTabReturnOption, logMyOrderCompleteReturnOption, logMyOrderViewReturnOptionRequest } =
    useLogService();
  /** 주문 상세 URL */
  const orderDetailUrl = getWebLink(WebLinkTypes.ORDER_DETAIL, { orderId });
  const defaultActions: Array<ActionParams> = [{ type: 'refetch' }];
  /** 반품 사유 데이터 */
  const reasonItem = useClaimStore((state) => state.reasonItem);
  const updateReasonItem = useClaimStore((state) => state.updateReasonItem);
  const resetReasonItem = useClaimStore((state) => state.resetReasonItem);
  /** 반품 기준 및 묶음 상품 데이터 */
  const itemInfoList = useClaimStore((state) => state.itemInfoList);
  const updateItemInfoList = useClaimStore((state) => state.updateItemInfoList);
  const resetItemInfoList = useClaimStore((state) => state.resetItemInfoList);

  /** 반품 회수 방법 */
  const returnMethod = useClaimStore((state) => state.recallMethod);
  const updateReturnMethod = useClaimStore((state) => state.updateRecallMethod);
  const resetReturnMethod = useClaimStore((state) => state.resetRecallMethod);
  /** 전체 데이터 초기화 */
  const resetAllData = useClaimStore((state) => state.resetAllData);

  /** 선택한 묶음 취소 상품 정보 */
  const [selectedBundleGoods, setSelectedBundleGoods] = useState<BundleGoodsProps[]>([]);

  /**
   * 반품 요청 정보 조회
   */
  const returnDetailQuery = useQuery(
    [MYPAGE_CLAIM_RETURN_INFO_QUERY_KEY, orderId, itemId, itemOptionId, reasonItem.reasonCode, returnMethod],
    () => getReturnDetail({ orderId, itemInfoList, returnMethod, ...reasonItem }),
    {
      select: toClaimReturnModel,
      enabled:
        itemInfoList.length > 0 &&
        returnMethod !== '' &&
        reasonItem.reasonCode !== '' &&
        processType === ProcessTypes.CONFIRM,
      cacheTime: 0,
    },
  );
  const { data: returnDetailData, isSuccess: isReturnDetailSuccess } = returnDetailQuery;

  /**
   * 반품 상품 및 묶음 반품 상품 조회
   */
  const returnBundleQuery = useQuery(
    [MYPAGE_CLAIM_RETURN_BUNDLE_QUERY_KEY, orderId, itemId, itemOptionId, exportId],
    () => getReturnBundleItemList({ orderId, itemId, itemOptionId, exportId }),
    {
      select: toClaimReturnBundleModel,
      enabled: processType === ProcessTypes.BUNDLE,
      cacheTime: 0,
    },
  );

  /**
   * 반품 요청 처리
   */
  const { mutateAsync: executeOrderReturn, isLoading: isOrderReturning } = useMutation(updateReturn, {
    onSuccess: ({ cancelOrReturnId }: { cancelOrReturnId: number }, variables) => {
      if (!cancelOrReturnId) {
        showToastMessage({ message: ReturnInfoText.ERROR.DEFAULT_ERROR_MESSAGE });
        return;
      }

      const { reasonCode, reason, itemInfoList: returnGoods } = variables;

      // 반품 완료 로그
      logMyOrderCompleteReturnOption({
        order_id: orderId,
        reason_code: reasonCode,
        reason: reason ?? '',
        order_quantity: returnGoods.length,
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
        { type: 'toast', message: ReturnInfoText.CONFIRM.SUCCESS_TOAST_MESSAGE },
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
          message: err.data?.message,
        })) && close({ actions: defaultActions }, { url: orderDetailUrl, isModalDismiss: true });
      } else {
        showToastMessage({ message: ReturnInfoText.ERROR.DEFAULT_ERROR_MESSAGE });
        handleAllowedNavigation();
      }
    },
    onSettled: () => {
      // 반품 요청 버튼 탭 시 로그
      logMyOrderTabReturnOption({ order_id: orderId });
    },
  });

  /** 반품 요청 호출 */
  const handleOrderReturn = async () => {
    const params = { orderId, returnMethod, itemInfoList, ...reasonItem };
    (await confirm({
      title: ReturnInfoText.CONFIRM.TITLE,
      message: ReturnInfoText.CONFIRM.MESSAGE,
    })) && executeOrderReturn(params);
  };

  /**
   * 반품 요청 불가 주문인 경우 alert
   */
  const nonReturnableAlert = async () => {
    (await alert({
      title: ReturnInfoText.ALERT.TITLE,
      message: ReturnInfoText.ALERT.MESSAGE,
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
   *  반품 요청 시 화면 이탈 가능 여부 설정
   */
  const handleAllowedNavigation = (allowed = true) => {
    setSystemNavigation({
      isPopAllowed: allowed,
      isDismissAllowed: allowed,
    });
  };

  /**
   *  receiveData & history state -> store update 처리 (최종 요청단계까지 유지 목적)
   */
  // TODO: 추후 타입 구체화 필요
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInit = (initData: Record<string, any>) => {
    // processType 구분
    // app receiveData, web location state 구분
    const {
      reasonCode,
      reason,
      fileIdList,
      itemInfoList: initialItemInfoList,
      returnMethod: initialReturnMethod,
    } = initData;
    switch (processType) {
      case ProcessTypes.BUNDLE:
        break;
      case ProcessTypes.REASON:
        updateItemInfoList(initialItemInfoList);
        break;
      case ProcessTypes.RECALL:
        updateReasonItem({ reasonCode, reason, fileIdList });
        break;
      case ProcessTypes.CONFIRM:
        updateReturnMethod(initialReturnMethod);
        break;
      default:
        break;
    }
  };

  /**
   *  단계별 데이터 리셋 처리
   */
  useEffect(() => {
    if (processType === ProcessTypes.BUNDLE) {
      setSelectedBundleGoods([]);
      resetItemInfoList();
    }
    if (processType === ProcessTypes.REASON) {
      resetItemInfoList();
      resetReasonItem();
    }
    if (processType === ProcessTypes.RECALL) {
      resetReturnMethod();
    }
  }, [processType, hasBundle, resetItemInfoList, resetReasonItem, resetReturnMethod]);

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
    isReturnDetailSuccess &&
      !returnDetailData?.isReturnable &&
      returnDetailData?.refundInfo?.refundableAmount &&
      returnDetailData?.refundInfo.refundableAmount < 0 &&
      nonReturnableAlert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReturnDetailSuccess]);

  useEffect(() => {
    if (returnDetailData && isReturnDetailSuccess) {
      // 반품 요청 화면 진입 시 로그
      logMyOrderViewReturnOptionRequest({ order_id: orderId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnDetailData, isReturnDetailSuccess]);

  return {
    returnDetailQuery,
    returnBundleQuery,
    selectedBundleGoods,
    isOrderReturning,
    handleOrderReturn,
    handleChangeBundleGoods,
    handleAllowedNavigation,
    reasonItem,
    itemInfoList,
  };
};
