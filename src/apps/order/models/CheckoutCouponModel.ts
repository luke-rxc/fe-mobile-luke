import env from '@env';
import { toKRW } from '@utils/toKRW';
import {
  CheckoutCouponInfoSchema,
  CheckoutCouponSchema,
  CheckoutGoodsCouponListSchema,
  CheckoutGoodsCouponSchema,
} from '../schemas';

export interface CheckoutDiscountModel {
  goodsCouponList: CheckoutDiscountGoodsModel[];
  usablePoint: number;
}

export interface CheckoutDiscountGoodsModel {
  brandId: number;
  brandName: string;
  goodsId: number;
  goodsName: string;
  goodsImageUrl: string;
  totalPrice: number;
  couponList: CheckoutCouponModel[];
}

export interface CheckoutCouponModel {
  couponDownloadId: number;
  couponSale: number;
  expiredDate: number;
  totalPriceWithCouponSale: number;
  costType: 'PERCENT' | 'WON';
  couponId: number;
  couponImageUrl: string;
  couponName: string;
  discount: number;
  maxSalePrice: number;
  minPurchasePrice: number;
}

export function toCheckoutDiscountModel(schema: CheckoutGoodsCouponListSchema): CheckoutDiscountModel {
  return {
    goodsCouponList: schema.goodsCouponList.map(toCheckoutDiscountGoodsModel),
    usablePoint: schema.usablePoint,
  };
}

export function toCheckoutDiscountGoodsModel(schema: CheckoutGoodsCouponSchema): CheckoutDiscountGoodsModel {
  const { usableCouponList, goodsImage, ...others } = schema;
  return {
    ...others,
    goodsImageUrl: `${env.endPoint.cdnUrl}/${goodsImage.path}`,
    couponList: usableCouponList.map(toCheckoutCouponModel),
  };
}

export function toCheckoutCouponModel(schema: CheckoutCouponSchema): CheckoutCouponModel {
  const { coupon, ...others } = schema;
  const { costType, limitMaxSalePrice, limitMinPurchasePrice, primaryImage, ...otherCouponInfoProps } = coupon;
  return {
    ...others,
    ...otherCouponInfoProps,
    maxSalePrice: limitMaxSalePrice,
    minPurchasePrice: limitMinPurchasePrice,
    costType: costType as 'PERCENT' | 'WON',
    couponImageUrl: `${env?.endPoint?.cdnUrl}/${primaryImage?.path}` ?? '',
    couponId: coupon.id,
    couponName: getCouponNameText(coupon),
  };
}

export function getCouponSaleText(costType: string, discount: number) {
  if (costType === 'PERCENT') {
    return `${discount}%`;
  }

  return toKRW(discount);
}

export function getCouponSuffix(minPurchasePrice: number, maxSalePrice: number) {
  const purchaseText = minPurchasePrice ? `${toKRW(minPurchasePrice)} 이상 구매` : '';
  const saleText = maxSalePrice ? `최대 ${toKRW(maxSalePrice)} 할인` : '';
  const body = [purchaseText, saleText].filter((text) => text !== '').join('/');
  return body === '' ? body : `(${body})`;
}

export function getCouponNameText(coupon: CheckoutCouponInfoSchema) {
  const { costType, discount, limitMinPurchasePrice, limitMaxSalePrice, name } = coupon;
  const prefix = getCouponSaleText(costType, discount);
  const suffix = getCouponSuffix(limitMinPurchasePrice, limitMaxSalePrice);

  return `${prefix} ${name} ${suffix}`;
}
