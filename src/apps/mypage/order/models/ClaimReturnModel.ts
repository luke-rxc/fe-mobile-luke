import format from 'date-fns/format';
import { getImageLink } from '@utils/link';
import type {
  OrderReturnDetailSchema,
  ClaimReturnItemOptionSchema,
  OrderReturnItemListSchema,
  ReturnExchangeDetailSchema,
  ClaimReturnDetailItemOptionSchema,
  ClaimDeliveryInfoSchema,
  OrderReturnReasonItemSchema,
} from '../schemas';
import { OrderCancelGoodsModel, toEstimatedRefundInfoModel } from './ClaimRefundModel';
import { EstimatedRefundInfoProps } from '../components';
import { toOptionList } from '../utils';

/** 반품/교환 상세 모델 */
export interface ClaimReturnExchangeDetailModel {
  cancelOrReturnId: number;
  orderId: number;
  title: string;
  type: 'RETURN' | 'EXCHANGE';
  orderClaimGoods: OrderCancelGoodsModel[];
  returnSender: ClaimDeliveryInfoSchema | null;
  returnMethod: {
    code: string;
    name: string;
  };
  returnReasonItem: OrderReturnReasonItemSchema;
  refundInfo: EstimatedRefundInfoProps | null;
  recipient: ClaimDeliveryInfoSchema | null;
  isChangeExchangeShippingInfo: boolean;
}

/**
 * 반품 정보 UI Model
 */
export const toClaimReturnModel = (data: OrderReturnDetailSchema) => {
  const { isReturnable, returnSender, itemOptionList, returnMethod, returnReasonItem, refundPayment } = data;

  return {
    // 반품 가능 여부
    isReturnable,
    // 회수지 주소
    returnSender,
    // 반품 회수 방법
    returnMethod,
    // 반품 사유
    returnReasonItem,
    // 반품할 상품 목록
    orderReturnGoods: itemOptionList.map((itemOption) => toOrderReturnGoodsModel(itemOption)),
    // 환불 정보
    refundInfo: refundPayment ? toEstimatedRefundInfoModel(refundPayment) : null,
  };
};

/**
 * 반품할 상품 UI Model
 */
export const toOrderReturnGoodsModel = (returnGoodsInfo: ClaimReturnItemOptionSchema): OrderCancelGoodsModel => {
  const { id, statusInfo, returnableEa, brand, goods, itemId } = returnGoodsInfo;

  return {
    id,
    itemId,
    price: goods.price,
    brandName: brand?.name,
    goodsId: goods.id,
    goodsName: goods.name,
    options: goods.option.itemList.map(({ value }) => value),
    quantity: returnableEa,
    goodsImage: { src: getImageLink(`${goods?.primaryImage?.path}?im=Resize,width=512`) },
    code: goods.code,
    status: statusInfo.status,
    disabledLink: true,
  };
};

/**
 * 반품 상품 및 묶음 반품 상품 조회 UI Model
 */
export const toClaimReturnBundleModel = (data: OrderReturnItemListSchema) => {
  const { itemOption, bundleItemOptionList } = data;
  return {
    // 반품 상품 목록
    orderReturnTargetGoods: toOrderReturnGoodsModel(itemOption),
    // 묶음 취소 상품 목록
    orderReturnBundleGoods: bundleItemOptionList?.map((bundleItemOption) => toOrderReturnGoodsModel(bundleItemOption)),
  };
};

export const toReturnDetailGoodsModel = (returnGoodsInfo: ClaimReturnDetailItemOptionSchema): OrderCancelGoodsModel => {
  const { id, statusInfo, priceWithEa, brand, goods, ea, itemId, exchangeOptionList } = returnGoodsInfo;

  return {
    id,
    itemId,
    price: priceWithEa,
    brandName: brand?.name,
    goodsId: goods.id,
    goodsName: goods.name,
    options: goods.option.itemList.map(({ value }) => value),
    quantity: ea,
    goodsImage: { src: getImageLink(`${goods?.primaryImage?.path}?im=Resize,width=512`) },
    code: goods.code,
    status: statusInfo.status,
    statusText: statusInfo.name,
    type: 'exchange',
    exchangeOptions: [
      toOptionList({ options: (exchangeOptionList && exchangeOptionList[0].option.itemList) || [], ea }),
    ],
    isExchangeOptions: exchangeOptionList && exchangeOptionList[0].option.itemList.length > 0,
  };
};

/**
 * 반품 및 교환 상세 조회 UI Model
 */
export const toClaimReturnExchangeDetailModel = (data: ReturnExchangeDetailSchema): ClaimReturnExchangeDetailModel => {
  const {
    cancelOrReturnId,
    orderId,
    createdDate,
    type,
    returnMethod,
    refundPayment,
    returnReasonItem,
    returnSender,
    itemOptionList,
    recipient,
    isChangeExchangeShippingInfo,
  } = data;

  return {
    // 취소 또는 반품/교환 대표 아이디
    cancelOrReturnId,
    // 주문 아이디
    orderId,
    // 요청일자 타이틀
    title: format(createdDate, 'yyyy. M. d'),
    // 반품 또는 교환 타입
    type,
    // 반품/교환할 상품 목록
    orderClaimGoods: itemOptionList.map((itemOption) => toReturnDetailGoodsModel(itemOption)),
    // 회수지 주소
    returnSender,
    // 반품/교환 회수 방법
    returnMethod,
    // 반품/교환 사유
    returnReasonItem,
    // 환불 정보
    refundInfo: refundPayment ? toEstimatedRefundInfoModel(refundPayment) : null,
    // 배송지 정보
    recipient,
    // 배송지 정보 변경 가능 여부
    isChangeExchangeShippingInfo,
  };
};
