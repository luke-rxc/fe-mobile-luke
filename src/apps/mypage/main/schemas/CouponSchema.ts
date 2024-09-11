import { ThumbnailImageSchema } from '@schemas/fileSchema';

export interface CouponSchema {
  coupon: {
    couponId: number;
    display: {
      name: string;
      title: string;
      label: string;
      image: ThumbnailImageSchema;
    };
    useType: 'CART' | 'GOODS';
    salePolicy: {
      costType: 'PERCENT' | 'WON';
      maxPrice: number;
      minPrice: number;
      percent: number;
      price: number;
    };
    issueType: 'DOWNLOAD' | 'KEYWORD' | 'WELCOME';
    issuePeriod: {
      issuePeriodType: 'DAY' | 'PERIOD';
      startDateTime: string;
      expiredDateTime: string;
      downloadAfterDay: number;
    };
  };
  downloadId: number;
  expiredDate: number;
}
