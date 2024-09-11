import { CouponListItemProps } from '@pui/couponListItem';
import { CouponsSchema } from '../schemas';

export type FormFields = {
  /** 키워드 쿠폰 내용 */
  keyword: string;
};

/**
 * 쿠폰 UI에 필요한 데이터만 필터링하여 반환
 */
export const toCouponsModel = (schema: CouponsSchema, latestUpdateId: number): CouponListItemProps[] =>
  schema.content.map(({ coupon: { couponId, display, salePolicy }, expiredDate: expiryDate }) => {
    const { title, name, image } = display;
    const { maxPrice, minPrice } = salePolicy;
    const { path: imageURL, blurHash } = image || {};

    return {
      title,
      name,
      expiryDate,
      imageURL,
      blurHash,
      maxDiscount: maxPrice,
      minPurchase: minPrice,
      isUpdated: latestUpdateId === couponId,
    };
  });
