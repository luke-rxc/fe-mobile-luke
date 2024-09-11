export const LogEventTypes = {
  /** 쿠폰 리스트 페이지 진입 */
  LogViewCoupon: 'my_coupon.view_coupon',
  /** 쿠폰 등록 페이지 진입 */
  LogTabKeywordCoupon: 'my_coupon.tab_keyword_coupon_cta',
  /** 쿠폰 등록 완료 */
  LogCompleteKeywordCoupon: 'my_coupon.complete_keyword_coupon_download',
} as const;
