export type CouponIssueType = 'DOWNLOAD' | 'DOWNLOAD_FIRST_PURCHASE' | 'KEYWORD' | 'WELCOME' | 'EVENT' | 'SHOWROOM';
export type UseType = 'CART' | 'GOODS';
export type CostType = 'PERCENT' | 'WON';
export type IssuePeriodType = 'DAY' | 'PERIOD';
export type CouponDisplayType = {
  name: string;
  title: string;
  image: {
    blurHash: string;
    height: number;
    id: number;
    path: string;
    width: number;
    fileType: 'IMAGE' | 'LOTTIE';
    extension: string;
  };
  label: string;
};

export type CouponSalePolicyType = {
  costType: CostType;
  percent: number;
  price: number;
  maxPrice: number;
  minPrice: number;
};

export type CouponIssuePeriodType = {
  issuePeriodType: IssuePeriodType;
  startDateTime: number;
  expiredDateTime: number;
  downloadAfterDay: number | null;
};

export type CouponDownloadPolicyType = {
  startDateTime: number;
  endDateTime: number;
};

export type CouponModel = {
  couponId: number;
  useType: UseType;
  issueType: CouponIssueType;
  display: CouponDisplayType;
  salePolicy: CouponSalePolicyType;
  issuePeriod: CouponIssuePeriodType;
  downloadPolicy: CouponDownloadPolicyType;
  couponSale: number;
  couponBenefitPrice: number;
  isDownloadable: boolean;
  isDownloaded: boolean;
  isRemaining: boolean;
};

/** 쿠폰 카드 UI */
export type CouponCardModel = {
  /** id */
  couponId: number;
  /** 카드 bg컬러 */
  background: string;
  /** 카드 텍스트 컬러 */
  color: string;
  /** 카드 타이틀 */
  title: string;
  /** 카드 라벨 */
  label: string;
  /** 유효 시작 시간 */
  startDateTime: number;
  /** 유효 종료 시간 */
  endDateTime: number;
  /** 혜택 금액 */
  benefitPrice: string;
  /** 혜택 단위 */
  benefitUnit: string;
  /** 다운완료여부 */
  downloaded: boolean;
  /** 쿠폰 재고 여부 */
  remain: boolean;
  /** 미리보기 노출 시간 */
  displayDateTime?: string;
};
export type CardListModel = {
  id: number;
  label: string;
  background: string;
  color: string;
};
export type CardListDisplayModel = {
  background: string; // 백그라운드 컬러
  color: string; // 텍스트 컬러
};
