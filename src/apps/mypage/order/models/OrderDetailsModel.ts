/* eslint-disable no-nested-ternary */
import uniq from 'lodash/uniq';
import format from 'date-fns/format';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import differenceInHours from 'date-fns/differenceInHours';
import { getImageLink } from '@utils/link';
import type { TicketValidityProps } from '@pui/orderGoodsListItem';
import { phoneNumberToString } from '@features/delivery/utils';
import { formatInTimeZone, transformPeriodDate } from '@utils/date';
import { PlaceSchema } from '@features/map/schemas';
import { TicketType, TicketConfirmType } from '../constants';
import { toOptionList, toExternalLink, toQuestionUrl } from '../utils';
import { OrderDetailsSchema, ItemOptionSchema, ItemOptionTicketSchema } from '../schemas';
import {
  OrderTitleProps,
  OrderGoodsProps,
  OrderActionsProps,
  OrderClaimInfoProps,
  RefundInfoProps,
  ShippingInfoProps,
  PaymentInfoProps,
  TicketReservationInfoProps,
} from '../components';

/** 주문 상세의 아이템 모델 */
export interface OrderItemOptionModel {
  optionId: number;
  exportId?: number;
  goods: OrderGoodsProps;
  claim: OrderClaimInfoProps;
  actions: OrderActionsProps;
  noticeMessage?: string;
  place?: PlaceSchema;
}

/** 주문 상세 모델 */
export interface OrderDetailsModel {
  orderInfo: {
    title: OrderTitleProps;
    orders: OrderItemOptionModel[];
  };
  shippingInfo: ShippingInfoProps;
  paymentInfo: PaymentInfoProps;
  refundInfo?: RefundInfoProps;
  ticketInfo?: TicketReservationInfoProps;
}

/**
 * 주문상세를 위한 모델
 * @todo 금액이 0 혹은 undefined인 경우 노출에 대한 전체적인 정리 필요(미노출? 0원? -원?)
 *       * 노출 정책에 따라 ShippingInfo PaymentInfo RefundInfo 컴포넌트도 수정 필요
 */
export const toOrderDetailsModel = (schema: OrderDetailsSchema): OrderDetailsModel => {
  const {
    orderId,
    createdDate,
    isFullRefundableOrder,
    isOrderByExchange,
    itemOptionList,
    recipient,
    payment,
    refund,
    ticketProgressBarInfo: ticketInfo,
  } = schema;

  return {
    // 주문 상품 정보
    orderInfo: {
      title: {
        orderId,
        title: format(createdDate, 'yyyy. M. d'),
        isExchangeOrder: isOrderByExchange,
        isAllCancellable: isFullRefundableOrder,
        orderItemCount: itemOptionList.length,
      },
      orders: itemOptionList.map((itemOption) => toOrderItemModel(orderId, itemOption)),
    },

    // 배송지 정보 (받는 사람 정보) & 예약 정보 (위치 정보 있는 경우 포함)
    shippingInfo: {
      name: recipient.name,
      address: `${recipient.address} ${recipient.addressDetail}`,
      phoneNumber: phoneNumberToString(recipient.phone),
      memo: recipient.deliveryRequestMessage,
      isChangeShippingAddress: recipient.isChangeShippingInfo,
      isAddressRequired: recipient.isAddressRequired,
      place: itemOptionList.find((data) => data.ticket?.place)?.ticket?.place,
    },

    // 결제 정보
    paymentInfo: {
      method: payment.paymentType?.name,
      goodsAmount: payment.totalSalesPrice,
      shippingAmount: payment.totalShippingCost,
      showShippingAmount: recipient.isAddressRequired,
      pointUsageAmount: payment.usedPoint,
      couponUsageAmount: payment.totalUsedCouponSale,
      paymentAmount: payment.amount,
    },

    // 환불 정보
    refundInfo: refund && {
      methods: uniq(refund.refundMethodList.map(({ name }) => name)),
      goodsAmount: refund.totalSalesPrice,
      shippingAmount: refund.totalShippingCost,
      showShippingAmount: recipient.isAddressRequired,
      pointUsageAmount: refund?.totalPoint,
      couponUsageAmount: refund?.totalCouponSale,
      refundAmount: refund.refundPrice,
      paymentAmount: refund.finalAmount,
    },

    // 숙박 예약 요청 정보
    ticketInfo: ticketInfo && {
      title: ticketInfo.title,
      description: ticketInfo.description,
      expiryDate: ticketInfo.expiryDate,
      isConfirmed: ticketInfo.ticketConfirmType === TicketConfirmType.CONFIRMED,
      waitCount: ticketInfo.waitCount,
      requestCount: ticketInfo.requestCount,
      confirmCount: ticketInfo.confirmCount,
      ticketOptions: ticketInfo.ticketOptionInfos,
    },
  };
};

/**
 * 주문 상세의 상품 리스트 아이템 모델
 */
const toOrderItemModel = (orderId: number, itemOption: ItemOptionSchema): OrderItemOptionModel => {
  const {
    id: optionId,
    actionList,
    delivery,
    goods,
    brand,
    ea,
    statusInfo,
    priceWithEa,
    exchangeOptionList,
    cancelOrReturn,
    exportId,
    ticket,
    noticeMessage,
    returnDelivery,
    isShowEa,
  } = itemOption;

  const goodsName = goods.name;
  const goodsId = goods.id;

  return {
    optionId,
    exportId,

    // 상품 정보
    goods: {
      code: goods.code,
      price: priceWithEa,
      goodsId,
      goodsName,
      quantity: isShowEa ? ea : null,
      options: goods.option.itemList.map(({ value }) => value),
      goodsImage: { src: getImageLink(`${goods.primaryImage?.path}?im=Resize,width=512`) },
      brandName: brand?.name,
      status: statusInfo.status,
      statusText: statusInfo.name,
      ticketValidity: ticket && toTicketValidityModel(ticket),
    },

    // 취교반 내용
    claim: {
      type: cancelOrReturn ? cancelOrReturn.type : exchangeOptionList ? 'exchange' : undefined,
      reason: cancelOrReturn?.reason,
      orderOptions: toOptionList({ options: goods.option.itemList, ea }),
      exchangeOptions: exchangeOptionList?.map(({ ea: count, option }) =>
        toOptionList({ options: option.itemList, ea: count }),
      ),
    },

    // 액션 정보
    actions: {
      orderStatus: statusInfo.name,
      ticketResendable: ticket?.isPossibleResent,
      ticketResendParams: exportId ? { orderId, exportId } : undefined,
      questionUrl: toQuestionUrl({ orderId, optionId }),
      claimTypeList:
        actionList &&
        actionList.map((data) => {
          return {
            type: data.type,
            claimInfo: {
              itemId: data.itemId,
              itemOptionId: data.itemOptionId,
              exportId: data.exportId,
              cancelOrReturnId: data.cancelOrReturnId,
            },
          };
        }),
      orderId,
      deliveryType: delivery?.method.code,
      deliveryUrl: delivery?.trackingUrl && toExternalLink(delivery?.trackingUrl),
      returnDelivery,
      cancelableDate: ticket?.cancelableDate,
      isCancelFee: ticket?.isCancelFee,
      goodsOptionId: goods.option.id,
    },

    // 주문 상세 공지 메시지
    noticeMessage,

    // 위치 정보
    place: ticket?.place,
  };
};

/**
 * 주문 상세의 티켓 유효기간 모델
 */
export const toTicketValidityModel = ({
  status,
  now,
  startDate,
  endDate,
  bookingDate,
  ticketType,
  userName,
  stayNights,
}: ItemOptionTicketSchema): TicketValidityProps | undefined => {
  // 숙박권 타입 목록
  const useBookingTypes: string[] = [TicketType.BOOKING_DATED, TicketType.BOOKING_UNDATED];
  // 숙박권 타입 여부
  const isBookingType = useBookingTypes.includes(ticketType.code);
  // 예약일 사용 여부 (숙박권 타입 & 투숙일 유무)
  const useBookingDate = isBookingType && !!bookingDate;

  // 숙박권은 투숙일자가 없는 경우 기간 표시 안함
  if (isBookingType && !bookingDate) {
    return undefined;
  }

  /**
   * 기간으로 표현이 필요한 상태 코드
   * CANCELED: 취소완료
   * USED: 사용완료
   * EXPIRED: 기간만료
   */
  const usePeriodStatusCodes = ['CANCELED', 'USED', 'EXPIRED'];
  // 기간 표기 사용 여부
  const usePeriod = usePeriodStatusCodes.includes(status.code);

  const { isSoonExpire, isDDays, expiryDateText, isCountDown } = toDisplayExpiryDate(
    {
      now,
      startDate,
      endDate,
      bookingDate,
      stayNights,
    },
    { usePeriod, useBookingDate },
  );

  return {
    status,
    expiryDate: endDate,
    expiryDateText,
    soonExpire: isSoonExpire,
    dDays: isDDays,
    usableCountDown: isCountDown,
    userName,
  };
};

/**
 * 날짜 표기 포맷
 *
 * @description CouponModel 내용으로 공통 개발 전 동일 소스 사용
 * @see {@link https://www.notion.so/rxc/1223c06f0cee40a3a83a7b2e6652916a} 숙박권 투숙일 처리를 위해 예약일 추가 진행됨 (숙박권이고, 투숙일 없는 경우 사용 안함)
 */
const toDisplayExpiryDate = (
  {
    now,
    startDate,
    endDate,
    bookingDate,
    stayNights,
  }: { now: number; startDate: number; endDate: number; bookingDate?: number; stayNights?: number | null },
  { usePeriod = false, useBookingDate = false }: { usePeriod?: boolean; useBookingDate?: boolean },
) => {
  // 예약일 사용 최우선 순위 처리
  if (useBookingDate && bookingDate) {
    // 연박 정보 여부에 따른, 체크인/체크아웃 및 N박 N일 표기 처리
    if (stayNights) {
      const checkInOutPeriodDateText = transformPeriodDate(bookingDate, stayNights);
      const stayNightsText = `${stayNights}박 ${stayNights + 1}일`;
      const checkInOutResultText = `${checkInOutPeriodDateText}, ${stayNightsText}`;
      return { isSoonExpire: false, expiryDateText: checkInOutResultText };
    }
    // e.g. 2022. 12. 10 (토)
    const bookingDateText = formatInTimeZone(bookingDate, 'yyyy. M. d(iii)');
    return { isSoonExpire: false, expiryDateText: bookingDateText };
  }

  const today = new Date(now);
  const expiryDate = new Date(endDate);
  const diffDays = differenceInCalendarDays(expiryDate, today);
  const diffHours = differenceInHours(expiryDate, today);
  const periodText = [format(startDate, 'yyyy. M. d'), format(expiryDate, 'yyyy. M. d')].join(' - ');

  // 시작일이 미래인 경우
  const isFutureDate = now < startDate;

  // 기간으로 사용
  if (usePeriod || isFutureDate) {
    return { isSoonExpire: false, expiryDateText: periodText };
  }

  // 24시간 전이라면 CountDown, 24시간 이후라면 DDay (Next Condition)
  if (diffDays <= 1) {
    if (diffHours < 24) {
      return { isSoonExpire: true, expiryDateText: '', isCountDown: true };
    }
  }

  // 7일 전
  if (diffDays <= 7) {
    return { isSoonExpire: true, expiryDateText: `D-${diffDays}` };
  }

  // 30일 전
  if (diffDays <= 30) {
    return { isSoonExpire: false, isDDays: true, expiryDateText: `D-${diffDays}` };
  }

  // 30일 이상
  return { isSoonExpire: false, expiryDateText: periodText };
};
