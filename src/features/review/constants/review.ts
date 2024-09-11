/**
 * 리뷰 리스트 타입
 */
export const ReviewListType = {
  SHOWROOM: 'showroom', // 쇼룸 기준
  GOODS: 'goods', // 상품 기준
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ReviewListType = typeof ReviewListType[keyof typeof ReviewListType];
