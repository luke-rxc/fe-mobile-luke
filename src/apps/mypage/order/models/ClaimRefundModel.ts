import sum from 'lodash/sum';
import { getImageLink } from '@utils/link';
import type {
  OrderCancelFullDetailSchema,
  OrderCancelParitalItemListSchema,
  OrderCancelPartialDetailSchema,
  ClaimCancelItemOptionSchema,
  RefundInfoSchema,
} from '../schemas';
import type { OrderGoodsProps, EstimatedRefundInfoProps, CancellationInfoProps } from '../components';
import { toTicketValidityModel } from './OrderDetailsModel';

/**
 * 주문 전체 취소 UI Model
 */
export const toClaimCancelFullModel = (data: OrderCancelFullDetailSchema) => {
  const { itemOptionList, refundPayment, isRefundable, isAddressRequired, refundReasonItem } = data;
  const { text: reasonText } = refundReasonItem;

  return {
    // 취소할 주문 상품 목록
    orderCancelGoods: itemOptionList.map((itemOption) => toOrderCancelGoodsModel(itemOption)),
    // 환불 정보
    refundInfo: toEstimatedRefundInfoModel(refundPayment),
    isRefundable,
    isAddressRequired,
    reasonText,
  };
};

/**
 * 주문 부분 취소 UI Model
 */
export const toClaimCancelPartialModel = (data: OrderCancelPartialDetailSchema) => {
  const { isRefundable, isAddressRequired, itemOptionList, refundPayment, refundReasonItem } = data;
  const { text: reasonText } = refundReasonItem;

  return {
    isRefundable,
    isAddressRequired,
    // 취소할 주문 상품 목록
    orderCancelGoods: itemOptionList.map((itemOption) => toOrderCancelGoodsModel(itemOption)),
    // 환불 정보
    refundInfo: refundPayment ? toEstimatedRefundInfoModel(refundPayment) : null,
    // 티켓 취소 정보
    cancellationInfo: {
      reasonText,
      ...(itemOptionList[0].ticket?.cancelableDate && toCancellationInfoModel(itemOptionList[0].ticket)),
    },
  };
};

export interface OrderCancelGoodsModel extends Omit<OrderGoodsProps, 'className'> {
  /** 주문 아이템 옵션 아이디 */
  id: number;
  /** 주문 아이템 아이디 */
  itemId: number;
  /** 옵션 아이디 */
  optionId?: number;
  /** 취교반 타입 */
  type?: 'cancel' | 'return' | 'exchange';
  /** 교환 옵션 */
  exchangeOptions?: string[][];
  /** 교환 옵션 존재 여부 */
  isExchangeOptions?: boolean;
}

/**
 * 취소할 주문 상품 UI Model
 */
export const toOrderCancelGoodsModel = (cancelGoodsInfo: ClaimCancelItemOptionSchema): OrderCancelGoodsModel => {
  const { id, statusInfo, refundableEa, brand, goods, ticket, itemId, isShowRefundableEa } = cancelGoodsInfo;

  return {
    id,
    itemId,
    price: goods.price,
    brandName: brand?.name,
    goodsId: goods.id,
    goodsName: goods.name,
    options: goods.option.itemList.map(({ value }) => value),
    quantity: isShowRefundableEa ? refundableEa : null,
    goodsImage: { src: getImageLink(`${goods?.primaryImage?.path}?im=Resize,width=512`) },
    code: goods.code,
    status: statusInfo.status,
    ticketValidity: ticket && toTicketValidityModel(ticket),
    disabledLink: true,
    optionId: goods.option.id,
  };
};

/**
 * 취소할 주문의 예상 환불 정보
 */
export const toEstimatedRefundInfoModel = ({
  totalSalesPrice,
  totalShippingCost,
  usedPoint,
  totalUsedCouponSale,
  refundPrice,
  refundPoint,
  refundMethod: { name },
}: RefundInfoSchema): EstimatedRefundInfoProps => {
  return {
    method: name,
    goodsAmount: totalSalesPrice,
    shippingAmount: totalShippingCost,
    pointUsageAmount: usedPoint,
    couponUsageAmount: totalUsedCouponSale,
    refundableAmount: sum([refundPrice, refundPoint]),
  };
};

export const toCancellationInfoModel = (
  ticket: Required<ClaimCancelItemOptionSchema>['ticket'],
): CancellationInfoProps => {
  return {
    cancelableDate: ticket.cancelableDate,
    isCancelFee: ticket.isCancelFee,
    cancelFeeContent: ticket.cancelFeeContent,
    bookingDate: ticket.bookingDate,
  };
};

/**
 * 취소할 상품 및 묶음 취소 상품 조회 UI Model
 */
export const toClaimCancelPartialBundleModel = (data: OrderCancelParitalItemListSchema) => {
  const { isAddressRequired, itemOption, bundleItemOptionList } = data;
  return {
    isAddressRequired,
    // 취소할 주문 상품 목록
    orderCancelTargetGoods: toOrderCancelGoodsModel(itemOption),
    // 묶음 취소 상품 목록
    orderCancelBundleGoods: bundleItemOptionList?.map((bundleItemOption) => toOrderCancelGoodsModel(bundleItemOption)),
  };
};
