import type { CouponModel } from '../models';

/** 쿠폰 Schema */
export type CouponDownloadSchema = CouponModel;

/** 쿠폰 단건 다운로드 Schema */
export type CouponSingleDownloadSchema = {
  downloadId: number;
  expiredDate: number;
  coupon: CouponDownloadSchema;
};

/** 쿠폰 다건 다운로드 Schema */
export type CouponMultiDownloadSchema = {
  downloadedCouponList: CouponDownloadSchema[];
  message: string;
};
