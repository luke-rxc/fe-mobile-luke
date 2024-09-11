import { FileSchema } from '@schemas/fileSchema';

type CouponIssueType = 'DOWNLOAD' | 'KEYWORD' | 'WELCOME';
type CouponUseType = 'CART' | 'GOODS';
type CouponCostType = 'PERCENT' | 'WON';
type CouponIssuePeriodType = 'DAY' | 'PERIOD';

export interface CouponDisplaySchmea {
  label: string;
  name: string;
  title: string;
  image: FileSchema | null;
}

interface CouponSalePolicySchema {
  costType: CouponCostType;
  percent: number;
  price: number;
  maxPrice: number;
  minPrice: number;
}

interface CouponIssuePeriodSchema {
  issuePeriodType: CouponIssuePeriodType;
  startDateTime: number | null;
  expiredDateTime: number | null;
  downloadAfterDay: number | null;
}

interface CouponInfoSchema {
  couponId: number;
  useType: CouponUseType;
  issueType: CouponIssueType;
  display: CouponDisplaySchmea;
  salePolicy: CouponSalePolicySchema;
  issuePeriod: CouponIssuePeriodSchema;
}

export interface CouponSchema extends CouponInfoSchema {
  isDownloadable: boolean;
  isDownloaded: boolean;
  couponSale: number;
  couponBenefitPrice: number;
}

// 쿠폰 다운로드 Schema
export interface CouponDownloadSchema {
  downloadId: number;
  expiredDate: string;
  coupon: CouponSchema;
}

// 쿠폰 다운로드 리스트 Schema
export interface CouponDownloadListSchema {
  downloadedCouponList: CouponSchema[];
  message: string;
}
