export interface CheckoutGoodsCouponListSchema {
  goodsCouponList: CheckoutGoodsCouponSchema[];
  usablePoint: number;
}

export interface CheckoutGoodsCouponSchema {
  brandId: number;
  brandName: string;
  goodsId: number;
  goodsName: string;
  goodsImage: CheckoutCouponImageSchema;
  totalPrice: number;
  usableCouponList: CheckoutCouponSchema[];
}

export interface CheckoutCouponSchema {
  couponDownloadId: number;
  couponSale: number;
  expiredDate: number;
  totalPriceWithCouponSale: number;
  coupon: CheckoutCouponInfoSchema;
}

export interface CheckoutCouponInfoSchema {
  costType: string;
  id: number;
  primaryImage: CheckoutCouponImageSchema | null;
  name: string;
  discount: number;
  limitMaxSalePrice: number;
  limitMinPurchasePrice: number;
}

export interface CheckoutCouponImageSchema {
  blurHash: string;
  path: string;
}
