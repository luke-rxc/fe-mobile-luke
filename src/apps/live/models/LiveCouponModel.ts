import { CouponDownloadResponse, CouponUserResultV2Response } from '../schemas';

/**
 * 쿠폰 response model
 */
export interface CouponDownloadModel extends CouponDownloadResponse {
  status: 'default' | 'complete' | 'runout';
}

/**
 * 쿠폰 다운로드 response model
 */
export interface CouponUserResultModel extends CouponUserResultV2Response {
  downloadedCouponList: Array<CouponDownloadModel>;
}

const getCouponStatus = ({ isDownloaded, isRemaining }: CouponDownloadResponse): CouponDownloadModel['status'] => {
  if (isDownloaded) {
    return 'complete';
  }
  if (!isRemaining) {
    return 'runout';
  }

  return 'default';
};

/**
 * CouponDownloadResponse > CouponDownloadModel convert
 */
export const toCouponDownloadModel = (item: CouponDownloadResponse): CouponDownloadModel => {
  return {
    ...item,
    status: getCouponStatus(item),
  };
};

/**
 * CouponDownloadResponse > CouponDownloadModel convert
 */
export const toCouponDownloadListModel = (items: Array<CouponDownloadResponse>): Array<CouponDownloadModel> => {
  return items.map(toCouponDownloadModel);
};

/**
 * CouponUserResultV2Response > CouponUserResultModel convert
 */
export const toCouponUserResultModel = (item: CouponUserResultV2Response): CouponUserResultModel => {
  return {
    ...item,
    downloadedCouponList: toCouponDownloadListModel(item.downloadedCouponList),
  };
};
