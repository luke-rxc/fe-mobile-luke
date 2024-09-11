import { createElement, useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { useQuery } from '@hooks/useQuery';
import { useMutation } from '@hooks/useMutation';
import { useWebInterface } from '@hooks/useWebInterface';
import { AppLinkTypes, WebLinkTypes } from '@constants/link';
import { getAppLink, getWebLink } from '@utils/link';
import { useLocation } from 'react-router-dom';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { emitClearReceiveValues } from '@utils/webInterface';
import { useModal } from '@hooks/useModal';
import { DeliveryListModalContainer } from '@features/delivery/containers';
import { CALL_WEB_EVENT_TYPE } from '@features/delivery/constants';
import { FeatureFlagsType } from '@contexts/FeatureFlagsContext';
import { useFeatureFlags } from '@hooks/useFeatureFlags';
import { getExchangeDetail, getExchangeBundleItemList, updateExchange } from '../apis';
import {
  ExchangeInfoText,
  MYPAGE_CLAIM_EXCHANGE_BUNDLE_QUERY_KEY,
  MYPAGE_CLAIM_EXCHANGE_INFO_QUERY_KEY,
  ProcessTypes,
} from '../constants';
import { toClaimExchangeBundleModel, toClaimExchangeModel } from '../models';
import { useClaimStore } from '../stores';
import { ExchangeShippingInfo, ReceiveActionType, ReceiveDataType } from '../types';
import { OptionInfoSchema } from '../schemas';
import { useLogService } from './useLogService';

interface ServiceParams {
  orderId: string;
  itemId?: string;
  itemOptionId?: string;
  exportId?: string;
  processType: ValueOf<typeof ProcessTypes>;
  hasBundle?: string;
}

interface ActionParams {
  type: 'refetch' | 'toast';
  message?: string;
}

interface BundleGoodsProps {
  itemOptionId: number;
  itemId: number;
  exportId: number;
  goodsOptionId?: number;
  isMultiOption: boolean;
}

export const useClaimExchangeService = ({
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
    open,
    close,
    confirm,
    purchaseCancelled,
    purchaseStatusUpdated,
    initialValues,
    receiveValues,
    setSystemNavigation,
  } = useWebInterface();
  const { state: pushedState } = useLocation();
  const { isApp } = useDeviceDetect();
  const { openModal } = useModal();
  const { logMyOrderTabExchangeOption, logMyOrderCompleteExchangeOption, logMyOrderViewExchangeOptionRequest } =
    useLogService();
  /** 주문 상세 URL */
  const orderDetailUrl = getWebLink(WebLinkTypes.ORDER_DETAIL, { orderId });
  const defaultActions: Array<ActionParams> = [{ type: 'refetch' }];
  /** 교환 사유 데이터 */
  const reasonItem = useClaimStore((state) => state.reasonItem);
  const updateReasonItem = useClaimStore((state) => state.updateReasonItem);
  const resetReasonItem = useClaimStore((state) => state.resetReasonItem);
  /** 교환 기준 및 묶음 상품 데이터 */
  const itemInfoList = useClaimStore((state) => state.itemInfoList);
  const updateItemInfoList = useClaimStore((state) => state.updateItemInfoList);
  const resetItemInfoList = useClaimStore((state) => state.resetItemInfoList);
  /** 교환 회수 방법 */
  const exchangeMethod = useClaimStore((state) => state.recallMethod);
  const updateExchangeMethod = useClaimStore((state) => state.updateRecallMethod);
  const resetExchangeMethod = useClaimStore((state) => state.resetRecallMethod);
  /** 전체 데이터 초기화 */
  const resetAllData = useClaimStore((state) => state.resetAllData);

  /** 선택한 묶음 교환 상품 정보 */
  const [selectedBundleGoods, setSelectedBundleGoods] = useState<BundleGoodsProps[]>([]);

  /** 교환 요청 내역 화면 내 변경한 배송지 정보 */
  const [updatedShippingInfo, setUpdateShippingInfo] = useState<ExchangeShippingInfo | null>(null);

  // 최종 선택된 타겟 옵션 정보
  const [selectedTargetOption, setTargetOption] = useState<OptionInfoSchema | null>(null);
  const [selectedBundleOptionList, setBundleOptionList] = useState<OptionInfoSchema[]>([]);

  /**
   * 교환 요청 정보 조회
   */
  const exchangeDetailQuery = useQuery(
    [MYPAGE_CLAIM_EXCHANGE_INFO_QUERY_KEY, orderId, itemId, itemOptionId, reasonItem.reasonCode, exchangeMethod],
    () => getExchangeDetail({ orderId, itemInfoList, exchangeMethod, ...reasonItem }),
    {
      select: toClaimExchangeModel,
      enabled:
        itemInfoList.length > 0 &&
        exchangeMethod !== '' &&
        reasonItem.reasonCode !== '' &&
        processType === ProcessTypes.CONFIRM,
      cacheTime: 0,
    },
  );
  const { data: exchangeDetailData, isSuccess: isExchangeDetailSuccess } = exchangeDetailQuery;

  /**
   * 교환 상품 및 묶음 반품 상품 조회
   */
  const exchangeBundleQuery = useQuery(
    [MYPAGE_CLAIM_EXCHANGE_BUNDLE_QUERY_KEY, orderId, itemId, itemOptionId, exportId],
    () => getExchangeBundleItemList({ orderId, itemId, itemOptionId, exportId }),
    {
      select: toClaimExchangeBundleModel,
      enabled: processType === ProcessTypes.BUNDLE,
      cacheTime: 0,
    },
  );

  /**
   * 교환 요청 처리
   */
  const { mutateAsync: executeOrderExchange, isLoading: isOrderExchanging } = useMutation(updateExchange, {
    onSuccess: ({ cancelOrReturnId }: { cancelOrReturnId: number }, variables) => {
      if (!cancelOrReturnId) {
        showToastMessage({ message: ExchangeInfoText.ERROR.DEFAULT_ERROR_MESSAGE });
        return;
      }

      const { reasonCode, reason, itemInfoList: exchangeGoods } = variables;

      // 교환 완료 로그
      logMyOrderCompleteExchangeOption({
        order_id: orderId,
        reason_code: reasonCode,
        reason: reason ?? '',
        order_quantity: exchangeGoods.length,
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
        { type: 'toast', message: ExchangeInfoText.CONFIRM.SUCCESS_TOAST_MESSAGE },
      ];

      // 데이터 초기화
      resetAllData();

      // 창 닫기 및 액션 전달
      close({ actions }, { url: orderDetailUrl, isModalDismiss: true });
    },
    onError: async (err) => {
      resetAllData();
      if (!err.data?.message) {
        showToastMessage({ message: ExchangeInfoText.ERROR.DEFAULT_ERROR_MESSAGE });
        handleAllowedNavigation();
        return;
      }
      // 변경된 배송지 정보가 배송비 다른 경우, 에러 토스트 표현위해 구분
      if (err.data?.code === 'E500A59') {
        showToastMessage({ message: err.data?.message });
        handleAllowedNavigation();
      } else {
        (await alert({
          message: err.data?.message,
        })) && close({ actions: defaultActions }, { url: orderDetailUrl, isModalDismiss: true });
      }
    },
    onSettled: () => {
      // 교환 요청 버튼 탭 시 로그
      logMyOrderTabExchangeOption({
        order_id: orderId,
      });
    },
  });

  /** 교환 요청 호출 */
  const handleOrderExchange = async () => {
    if (!exchangeDetailData) return;
    const params = {
      orderId,
      exchangeMethod,
      itemInfoList,
      recipient:
        (updatedShippingInfo && {
          ...updatedShippingInfo,
          deliveryRequestMessage: exchangeDetailData.recipient.deliveryRequestMessage,
        }) ||
        exchangeDetailData.recipient,
      ...reasonItem,
    };
    (await confirm({
      title: ExchangeInfoText.CONFIRM.TITLE,
      message: ExchangeInfoText.CONFIRM.MESSAGE,
    })) && executeOrderExchange(params);
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
      selectedBundleOptionList.length > 0 &&
        setBundleOptionList((prev) => {
          return [...prev.filter((data) => data.itemOptionId !== selectItem.itemOptionId)];
        });
    } else {
      setSelectedBundleGoods((prevSeatList: BundleGoodsProps[]) => [...prevSeatList, selectItem]);
    }
  };

  /** 배송지 변경 모달 활성화 */
  const showChangeShippingAddressModal = () => {
    open(
      {
        url: getAppLink(AppLinkTypes.MANAGE_DELIVERY_SELECTED),
        initialData: { type: CALL_WEB_EVENT_TYPE.ON_EXCHANGE_REQUEST_ENTRY_OPEN },
      },
      {
        doWeb: async () => {
          await openModal(
            {
              nonModalWrapper: true,
              render: (props) =>
                createElement(DeliveryListModalContainer, { selectable: true, disabledAction: true, ...props }),
            },
            { type: CALL_WEB_EVENT_TYPE.ON_EXCHANGE_REQUEST_ENTRY_OPEN },
          );
        },
      },
    );
  };

  /**
   * 교환 옵션 최종 선택 정보 저장
   */
  const handleSelectExchangeOption = ({
    isTargetOption,
    selectedData,
  }: {
    isTargetOption: boolean;
    selectedData: OptionInfoSchema;
  }) => {
    if (isTargetOption) {
      setTargetOption(selectedData);
    } else {
      setBundleOptionList((prev) => {
        return [...prev.filter((data) => data.itemOptionId !== selectedData.itemOptionId), selectedData];
      });
    }
  };

  const handleResetSelectOption = ({
    isTargetOption,
    itemOptionId: selectItemOptionId,
  }: {
    isTargetOption: boolean;
    itemOptionId: number;
  }) => {
    if (isTargetOption) {
      setTargetOption(null);
    } else {
      setBundleOptionList((prev) => {
        return [...prev.filter((data) => data.itemOptionId !== selectItemOptionId)];
      });
    }
  };

  /**
   * 배송지 수정 모달 등에서 전달 받은 receive 데이터 액션 처리 함수
   * action type - modify: (UI만 업데이트)
   */
  const receiveActions = (actions: ReceiveActionType[]) => {
    actions.forEach(({ type, message, data }) => {
      switch (type) {
        case 'toast':
          showToastMessage({ message: message as string });
          break;
        case 'modify':
          // 배송지 정보 UI 업데이트
          (data as ExchangeShippingInfo) && setUpdateShippingInfo(data as ExchangeShippingInfo);
          break;
        default:
          break;
      }
    });

    // web에서 receive clear
    !isApp && emitClearReceiveValues();
  };

  /**
   *  교환 요청 시 화면 이탈 가능 여부 설정
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
      exchangeMethod: initialReturnMethod,
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
        updateExchangeMethod(initialReturnMethod);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    (receiveValues as ReceiveDataType)?.actions && receiveActions(receiveValues.actions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiveValues]);

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
      resetExchangeMethod();
    }
  }, [processType, hasBundle, resetItemInfoList, resetReasonItem, resetExchangeMethod]);

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
    if (exchangeDetailData && isExchangeDetailSuccess) {
      // 교환 요청 화면 진입 시 로그
      logMyOrderViewExchangeOptionRequest({ order_id: orderId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exchangeDetailData, isExchangeDetailSuccess]);

  return {
    exchangeDetailQuery,
    exchangeBundleQuery,
    selectedBundleGoods,
    isOrderExchanging,
    handleOrderExchange,
    handleChangeBundleGoods,
    reasonItem,
    itemInfoList,
    updatedShippingInfo,
    showChangeShippingAddressModal,
    handleSelectExchangeOption,
    handleResetSelectOption,
    handleAllowedNavigation,
    selectedTargetOption,
    selectedBundleOptionList,
  };
};
