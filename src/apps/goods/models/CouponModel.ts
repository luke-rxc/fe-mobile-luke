import { CouponSchema, CouponDisplaySchmea } from '../schemas';

export interface CouponListModel {
  display: CouponDisplaySchmea;
  couponId: number;
  isDownloadable: boolean;
  isDownloaded: boolean;
  couponSale: number;
  couponBenefitPrice: number;
}

export interface CouponModel {
  lists: CouponListModel[];
  ids: number[];
  // 쿠폰을 모두 다운받았는 지 여부
  isAllDownloaded: boolean;
  /** 쿠폰 총 갯수 */
  total: number;
  /** 다운로드 받을 수 있는 총 갯수 */
  downloadAbleCnt: number;
  /** 다운받을 수 있는 쿠폰이 1개일 때 대표 쿠폰 Display Title */
  mainCouponTitle: string;
}

// 다운로드 받은 쿠폰의 Model
export type CouponDownloadedModel = CouponSchema;

export const toCouponList = (couponLists: CouponSchema[]): CouponModel | null => {
  // 쿠폰 리스트가 하나도 없을때는 mapping 처리 하지 않음
  if (couponLists.length === 0) {
    return null;
  }

  const lists = couponLists.map(
    ({ couponId, display, isDownloadable, isDownloaded, couponSale, couponBenefitPrice }) => ({
      couponId,
      display,
      isDownloadable,
      isDownloaded,
      couponSale,
      couponBenefitPrice,
    }),
  );

  const total = lists.length;
  const downloadedCnt = lists.filter(({ isDownloaded }) => isDownloaded).length;
  const downloadAbleCnt = total - downloadedCnt;
  const isAllDownloaded = downloadAbleCnt === 0;
  const mainCouponTitle =
    downloadAbleCnt === 1 ? lists.filter(({ isDownloaded }) => !isDownloaded)[0].display.title : lists[0].display.title;
  const ids = lists
    .map(({ couponId, isDownloadable }) => (isDownloadable ? couponId : 0))
    .filter((couponId) => couponId);

  return {
    lists,
    ids,
    isAllDownloaded,
    total,
    downloadAbleCnt,
    mainCouponTitle,
  };
};

export const toMergeCouponList = (
  couponList: CouponModel,
  downloadedList: CouponDownloadedModel[] | null,
): CouponModel => {
  if (!downloadedList) {
    return couponList;
  }

  const { lists } = couponList;
  const list = lists
    .filter(
      (coupon) => coupon.isDownloaded || downloadedList.some((downloaded) => downloaded.couponId === coupon.couponId),
    )
    .map((coupon) => {
      if (downloadedList.some((downloaded) => downloaded.couponId === coupon.couponId)) {
        return { ...coupon, isDownloadable: false, isDownloaded: true };
      }
      return coupon;
    });
  return { ...couponList, lists: list };
};
