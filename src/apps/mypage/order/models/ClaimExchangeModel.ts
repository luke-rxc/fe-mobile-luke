import { getImageLink } from '@utils/link';
import type {
  OrderExchangeDetailSchema,
  OrderExchangeItemListSchema,
  ClaimExchangeInfoItemOptionSchema,
  ClaimExchangeItemOptionSchema,
} from '../schemas';
import { OrderCancelGoodsModel, toEstimatedRefundInfoModel } from './ClaimRefundModel';
import { toOptionList } from '../utils';

/**
 * 교환 정보 UI Model
 */
export const toClaimExchangeModel = (data: OrderExchangeDetailSchema) => {
  const { returnSender, itemOptionList, exchangeMethod, exchangeReasonItem, recipient, refundPayment } = data;

  return {
    // 회수지 주소
    returnSender,
    // 교환 회수 방법
    exchangeMethod,
    // 배송지 정보
    recipient,
    // 교환 사유
    exchangeReasonItem,
    // 반품할 상품 목록
    orderExchangeGoods: itemOptionList.map((itemOption) => toOrderExchangeGoodsModel(itemOption)),
    // 환불 정보
    refundInfo: refundPayment ? toEstimatedRefundInfoModel(refundPayment) : null,
  };
};

/**
 * 교환 요청 정보 상품 옵션 UI Model
 */
export const toOrderExchangeGoodsModel = (
  exchangeGoodsInfo: ClaimExchangeInfoItemOptionSchema,
): OrderCancelGoodsModel => {
  const { id, statusInfo, exchangeableEa, brand, goods, itemId, selectedGoodsOption } = exchangeGoodsInfo;
  return {
    id,
    itemId,
    price: goods.price,
    brandName: brand?.name,
    goodsId: goods.id,
    goodsName: goods.name,
    options: goods.option.itemList.map(({ value }) => value),
    quantity: exchangeableEa,
    goodsImage: { src: getImageLink(`${goods?.primaryImage?.path}?im=Resize,width=512`) },
    code: goods.code,
    status: statusInfo.status,
    disabledLink: true,
    type: 'exchange',
    exchangeOptions: [toOptionList({ options: selectedGoodsOption?.itemList, ea: exchangeableEa })],
    isExchangeOptions: selectedGoodsOption?.itemList.length > 0,
  };
};

/**
 * 교환할 상품 UI Model
 */
export const toOrderExchangeItemOptionModel = (exchangeGoodsInfo: ClaimExchangeItemOptionSchema) => {
  const { id, statusInfo, exchangeableEa, brand, goods, itemId, goodsOption } = exchangeGoodsInfo;

  return {
    id,
    itemId,
    price: goods.price,
    brandName: brand?.name,
    goodsId: goods.id,
    goodsName: goods.name,
    options: goods.option.itemList.map(({ value }) => value),
    quantity: exchangeableEa,
    goodsImage: { src: getImageLink(`${goods?.primaryImage?.path}?im=Resize,width=512`) },
    code: goods.code,
    status: statusInfo.status,
    goodsOptionTitleList: goodsOption?.titleList,
    goodsOptionItemList: goodsOption?.itemList,
    disabledLink: true,
  };
};

/**
 * 교환 상품 및 묶음 반품 상품 조회 UI Model
 */
export const toClaimExchangeBundleModel = (data: OrderExchangeItemListSchema) => {
  const { itemOption, bundleItemOptionList } = data;
  return {
    // 교환 상품 목록
    orderExchangeTargetGoods: toOrderExchangeItemOptionModel(itemOption),
    // 묶음 교환 상품 목록
    orderExchangeBundleGoods: bundleItemOptionList?.map((bundleItemOption) =>
      toOrderExchangeItemOptionModel(bundleItemOption),
    ),
  };
};
