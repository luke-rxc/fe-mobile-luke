/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, createElement, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { emitClearReceiveValues } from '@utils/webInterface';
import { AppLinkTypes } from '@constants/link';
import { getAppLink } from '@utils/link';
import { useQuery } from '@hooks/useQuery';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useMutation } from '@hooks/useMutation';
import { useWebInterface } from '@hooks/useWebInterface';
import { useModal } from '@hooks/useModal';
import { DeliveryListModalContainer } from '@features/delivery/containers';
import { useQueryString } from '@hooks/useQueryString';
import isEmpty from 'lodash/isEmpty';
import { ErrorDataModel, ErrorModel } from '@utils/api/createAxios';
import { GenerateHapticFeedbackType } from '@constants/webInterface';
import {
  AdditionalInfoEventType,
  AdditionalInfoText,
  AdditionalInfoUISectionType,
  ExchangeInfoText,
  MYPAGE_ORDER_DETAILS_ADDINFO_QUERY_KEY,
  MYPAGE_ORDER_DETAILS_QUERY_KEY,
  OrderDetailSectionType,
  PartialCancelInfoText,
  ReturnInfoText,
} from '../constants';
import {
  getOrderDetails,
  updateTicketResend,
  UpdateTicketResendRequest,
  getAdditionalInfo,
  getCancelParitalBundle,
  getReturnBundle,
  getExchangeBundle,
  deleteReturnExchange,
} from '../apis';
import { OrderDetailsModel, OrderItemOptionModel, toAdditionalInfoModel, toOrderDetailsModel } from '../models';
import { useLogService } from './useLogService';
import { AdditionalInfoReceiveProps } from '../types';
import { useConfirmAirlineTicketService } from './useMutationAdditionalInfoService';
import { useTicketReservationService } from './useTicketReservationService';

type ReceiveDataType = {
  type?: string;
  actions?: ReceiveActionType[];
};

type ReceiveActionType = {
  type: string;
  message?: string;
};

export const useOrderDetailsService = () => {
  const { isApp } = useDeviceDetect();
  const { id: orderId } = useParams<{ id: string }>();
  const { section } = useQueryString();
  const additionalInfoRef = useRef<HTMLDivElement>(null);
  const { openModal } = useModal();
  const { receiveValues, open, showToastMessage, alert, confirm, generateHapticFeedback } = useWebInterface();
  const { logMyOrderViewOrderDetail, logMyOrderCompleteSubmit, logMyOrderTabMap, logMyOrderTabAddressCopy } =
    useLogService();

  const {
    data: orderDetailsData,
    error: orderDetailsError,
    isError,
    isLoading,
    isFetching,
    isSuccess,
    refetch,
  } = useQuery([MYPAGE_ORDER_DETAILS_QUERY_KEY, orderId], () => getOrderDetails({ orderId }), {
    select: toOrderDetailsModel,
    cacheTime: 0,
  });

  const additionalInfoQuery = useQuery(
    [MYPAGE_ORDER_DETAILS_ADDINFO_QUERY_KEY, orderId],
    () => getAdditionalInfo({ orderId }),
    {
      select: toAdditionalInfoModel,
      cacheTime: 0,
    },
  );

  const { ticketFields, isReservable, onShowTicketCalendar, onTicketReservation } = useTicketReservationService({
    orderId,
    ticketInfo: orderDetailsData?.ticketInfo,
    onRefetch: refetch,
  });

  /** 배송지 변경 모달 활성화 */
  const showChangeShippingAddressModal = () => {
    open(
      { url: getAppLink(AppLinkTypes.MANAGE_DELIVERY_SELECTED), initialData: { id: orderId } },
      {
        doWeb: async () => {
          await openModal(
            {
              nonModalWrapper: true,
              render: (props) =>
                createElement(DeliveryListModalContainer, { selectable: true, disabledAction: true, ...props }),
            },
            { id: orderId },
          );
        },
      },
    );
  };

  /** 티켓 문자 재발송 처리 */
  const { mutateAsync: executeTicketResend } = useMutation(updateTicketResend, {
    onSuccess: ({ isSuccess: isResentSuccess }) => {
      if (!isResentSuccess) {
        showToastMessage({ message: '잠시 후 다시 시도해주세요' });
        return;
      }

      showToastMessage({ message: '문자가 재전송되었습니다' });
    },
    onError: (err) => {
      showToastMessage({ message: err.data?.message ?? '잠시 후 다시 시도해주세요' });
    },
  });

  /** 티켓 재발송 후 추가 재발송 가능 여부 반환 */
  const handleTicketResend = async (params: UpdateTicketResendRequest) => {
    const { resendCount, resendLimitCount } = await executeTicketResend(params);

    // resendLimitCount가 0인 경우 무제한, resendLimitCount 보다 resendCount가 적은 경우 재발송 가능
    const resendable = resendLimitCount === 0 || resendCount < resendLimitCount;

    return resendable;
  };

  const receiveActions = (actions: ReceiveActionType[]) => {
    actions.forEach(({ type, message }) => {
      switch (type) {
        case 'refetch':
          refetch();
          additionalInfoQuery.refetch();
          break;
        case 'toast':
          showToastMessage({ message: message as string });
          break;
        default:
          break;
      }
    });

    // web에서 receive clear
    !isApp && emitClearReceiveValues();
  };

  /**
   * 항공권 정보 확정 버튼 클릭
   */
  const handleConfirmAirlineTicket = async () => {
    if (await confirm({ title: AdditionalInfoText.CONFIRM.TITLE, message: AdditionalInfoText.CONFIRM.MESSAGE })) {
      confirmAirlineTicketMutation({ orderId });
      logMyOrderCompleteSubmit({
        orderId,
        goodsId: additionalInfoQuery.data?.inputFormOptionList[0].goodsId,
        goodsName: additionalInfoQuery.data?.inputFormOptionList[0].goodsName,
        formType: AdditionalInfoUISectionType.AIRLINE_TICKET,
      });
    }
  };

  /**
   * 항공권 정보 확정 API 호출
   */
  const { mutateAsync: confirmAirlineTicketMutation, isLoading: isConfirmAirlineTicketLoading } =
    useConfirmAirlineTicketService({
      onSuccess: () => {
        showToastMessage(
          { message: AdditionalInfoText.CONFIRM.TOAST_MESSAGE },
          {
            autoDismiss: 2000,
            direction: 'bottom',
          },
        );
        generateHapticFeedback({ type: GenerateHapticFeedbackType.Success });
        additionalInfoQuery.refetch();
      },
      onError: async (error: ErrorModel<ErrorDataModel>) => {
        if (
          await alert({
            title: AdditionalInfoText.ALERT.DEFAULT_TITLE,
            message: error.data?.message ?? AdditionalInfoText.ALERT.DEFAULT_ERROR_MESSAGE,
          })
        ) {
          refetch();
          additionalInfoQuery.refetch();
        }
      },
    });

  /**
   * 묶음 취소 가능 상품 존재 유무 API 호출
   */
  const {
    mutateAsync: executeCancelPartialBundle,
    error: orderCancelPartialError,
    isError: isOrderCancelPartialError,
  } = useMutation(getCancelParitalBundle, {
    onError: (errors: ErrorModel<ErrorDataModel>) => {
      if (!errors.data) {
        showToastMessage({ message: PartialCancelInfoText.ERROR.DEFAULT_ERROR_MESSAGE });
      }
    },
  });

  /**
   * 묶음 반품 가능 상품 존재 유무 API 호출
   */
  const {
    mutateAsync: executeReturnBundle,
    error: orderReturnError,
    isError: isOrderReturnError,
  } = useMutation(getReturnBundle, {
    onError: (errors: ErrorModel<ErrorDataModel>) => {
      if (!errors.data) {
        showToastMessage({ message: ReturnInfoText.ERROR.DEFAULT_ERROR_MESSAGE });
      }
    },
  });

  /**
   * 묶음 교환 가능 상품 존재 유무 API 호출
   */
  const {
    mutateAsync: executeExchangeBundle,
    error: orderExchangeError,
    isError: isOrderExchangeError,
  } = useMutation(getExchangeBundle, {
    onError: (errors: ErrorModel<ErrorDataModel>) => {
      // 품절, 판매중지, 차등금액인 경우 에러
      if (errors.data?.code === 'E500A58') {
        alert({ title: ExchangeInfoText.ERROR.MESSAGE, message: errors.data?.message ?? '잠시 후 다시 시도해주세요' });
      } else if (!errors.data) {
        showToastMessage({ message: ExchangeInfoText.ERROR.DEFAULT_ERROR_MESSAGE });
      }
    },
  });

  /**
   * 반품/교환 철회 API 호출
   */
  const {
    mutateAsync: executeWithdrawReturnExchange,
    error: orderWithdrawError,
    isError: isOrderWithdrawError,
  } = useMutation(deleteReturnExchange, {
    onSuccess: () => {
      // 철회 완료 후 주문상세 리프레시
      refetch();
    },
    onError: (errors: ErrorModel<ErrorDataModel>) => {
      if (!errors.data) {
        showToastMessage({ message: ExchangeInfoText.ERROR.DEFAULT_ERROR_MESSAGE });
      }
    },
  });

  type OrderDetailViewLogDefaultType = {
    goods_id: string[];
    goods_name: string[];
    option_id: string[];
    option_quantity: string[];
  };

  const toOrderDetailViewLogItem = (items: OrderDetailsModel) => {
    const toItemsLogModel = (data: OrderItemOptionModel[]) => {
      const defaultValue: OrderDetailViewLogDefaultType = {
        goods_id: [],
        goods_name: [],
        option_id: [],
        option_quantity: [],
      };
      return (
        data?.reduce((acc, item) => {
          return {
            goods_id: acc.goods_id.concat(`${item.goods.goodsId}`),
            goods_name: acc.goods_name.concat(item.goods.goodsName),
            option_id: acc.option_id.concat(`${item.optionId}`),
            option_quantity: acc.option_quantity.concat(`${item.goods.quantity ?? 1}`),
          };
        }, defaultValue) ?? defaultValue
      );
    };

    const orderInfoId = `${items.orderInfo.title.orderId}`;
    const reduceData = toItemsLogModel(items.orderInfo.orders);
    return {
      order_id: orderInfoId,
      goods_id: reduceData.goods_id,
      goods_name: reduceData.goods_name,
      option_id: reduceData.option_id,
      option_quantity: reduceData.option_quantity,
      total_option_quantity: reduceData.option_quantity.reduce((acc, option) => acc + Number(option), 0),
    };
  };

  /**
   * 위치 정보 - 지도 클릭 이벤트
   */
  const handleClickMap = () => {
    orderDetailsData &&
      isSuccess &&
      logMyOrderTabMap({
        goods_id: `${orderDetailsData.orderInfo.orders[0].goods.goodsId}`,
        goods_name: `${orderDetailsData.orderInfo.orders[0].goods.goodsName}`,
      });
  };

  /**
   * 위치 정보 - 주소 복사 클릭 이벤트
   */
  const handleClickAddressCopy = () => {
    orderDetailsData &&
      isSuccess &&
      logMyOrderTabAddressCopy({
        goods_id: `${orderDetailsData.orderInfo.orders[0].goods.goodsId}`,
        goods_name: `${orderDetailsData.orderInfo.orders[0].goods.goodsName}`,
      });
  };

  useEffect(() => {
    (receiveValues as ReceiveDataType)?.actions && receiveActions(receiveValues.actions);
    // 부가 정보 추가에 따른 주문상세/부가정보 리스트 업데이트를 위한 receiveValues, actions
    if (!isEmpty(receiveValues)) {
      const { type } = receiveValues as AdditionalInfoReceiveProps;
      if (type === AdditionalInfoEventType.ON_SUCCESS) {
        additionalInfoQuery.refetch();
      }
      if (type === AdditionalInfoEventType.ON_ERROR) {
        refetch();
        additionalInfoQuery.refetch();
      }
    }
  }, [receiveValues]);

  useEffect(() => {
    const scrollPosition = additionalInfoRef?.current?.offsetTop;
    if (scrollPosition && section === OrderDetailSectionType.ADDITIONAL_INFO) {
      window.scrollTo({ top: scrollPosition });
    }
  }, [additionalInfoQuery.isSuccess]);

  useEffect(() => {
    if (orderDetailsData && isSuccess && additionalInfoQuery.isSuccess) {
      const logParams = toOrderDetailViewLogItem(orderDetailsData);
      logMyOrderViewOrderDetail({
        ...logParams,
        form_type: additionalInfoQuery?.data?.sectionType ?? '',
        is_map: !!orderDetailsData.shippingInfo.place,
      });
      // form_type: additionalInfoQuery.data.sectionType,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderDetailsData, isSuccess, additionalInfoQuery.data, additionalInfoQuery.isSuccess]);

  return {
    orderDetails: orderDetailsData,
    orderDetailsError,
    isOrderDetailError: isError,
    isOrderDetailLoading: isLoading,
    isOrderDetailFetching: isFetching,
    isOrderDetailSuccess: isSuccess,
    refetchOrderDetails: refetch,
    showChangeShippingAddressModal,
    handleTicketResend,
    executeCancelPartialBundle,
    executeReturnBundle,
    executeExchangeBundle,
    executeWithdrawReturnExchange,
    additionalInfo: {
      data: additionalInfoQuery.data,
      ref: additionalInfoRef,
      handleConfirmAirlineTicket,
      isConfirmAirlineTicketLoading,
    },
    orderCancelPartialError,
    isOrderCancelPartialError,
    orderReturnError,
    isOrderReturnError,
    orderExchangeError,
    isOrderExchangeError,
    orderWithdrawError,
    isOrderWithdrawError,
    handleClickMap,
    handleClickAddressCopy,
    ticketInfo: orderDetailsData?.ticketInfo && {
      ...orderDetailsData.ticketInfo,
      ticketFields,
      isReservable,
      onClickOption: onShowTicketCalendar,
      onClickAction: onTicketReservation,
    },
  };
};
