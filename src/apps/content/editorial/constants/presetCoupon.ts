/**
 * 쿠폰 다운로드 타입
 */

export const CouponDownType = {
  DOWNLOAD: 'download',
  SHOWROOM: 'showroom',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CouponDownType = typeof CouponDownType[keyof typeof CouponDownType];
