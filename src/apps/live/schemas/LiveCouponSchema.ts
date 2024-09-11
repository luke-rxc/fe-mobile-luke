/**
 * 쿠폰 response schema
 */
export interface CouponDownloadResponse {
  couponId: number;
  useType: 'CART' | 'GOODS';
  issueType: 'DOWNLOAD' | 'DOWNLOAD_FIRST_PURCHASE' | 'KEYWORD' | 'WELCOME' | 'EVENT' | 'SHOWROOM';
  display: {
    title: string;
    name: string;
    image: {
      id: number;
      path: string;
      blurHash: string;
      width: number;
      height: number;
      fileType: 'IMAGE';
      extension: string;
    };
    label: string;
  };
  salePolicy: {
    costType: 'PERCENT' | 'WON';
    percent: number;
    price: number;
    maxPrice: number;
    minPrice: number;
  };
  issuePeriod: {
    issuePeriodType: 'DAY' | 'PERIOD';
    startDateTime: number;
    expiredDateTime: number;
    downloadAfterDay: number;
  };
  downloadPolicy: {
    startDateTime: number;
    endDateTime: number;
  };
  couponSale: number;
  couponBenefitPrice: number;
  isDownloadable: boolean;
  isDownloaded: boolean;
  isRemaining: boolean;
}

/**
 * 쿠폰 다운로드 response schema
 */
export interface CouponUserResultV2Response {
  downloadedCouponList: Array<CouponDownloadResponse>;
  message: string;
}
