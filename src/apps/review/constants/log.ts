export const LogEventTypes = {
  // 리뷰 리스트 페이지 진입 시
  LogReviewListViewPage: 'review_list.view_page',
  // 리뷰 썸네일 노출 시
  LogImpressionReviewThumbnail: 'review_list.impression_review_thumbnail',
  // 리뷰 썸네일 탭 시
  LogTabReviewThumbnail: 'review_list.tab_review_thumbnail',
  // 리뷰 상세 조회 시
  LogViewReviewDetail: 'review.view_review_detail',
  // 리뷰 상세 페이지 내 끝까지 스와이프(스크롤)해서 걸렸을 경우
  LogSwipeReviewDetail: 'review.swipe_review_detail',
  // 리뷰 상세 배너 탭
  LogTapReviewGoodsBanner: 'review.tab_viewer_goods_banner',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LogEventTypes = ValueOf<typeof LogEventTypes>;
