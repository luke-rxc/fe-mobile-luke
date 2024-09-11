/**
 * 댓글 상태
 */
export const CommentStatusType = {
  NORMAL: 'NORMAL', // 일반
  USER_DELETE: 'USER_DELETE', // 사용자 삭제상태
  ADMIN_DELETE: 'ADMIN_DELETE', // 관리자 삭제상태
  DROP_OUT_DELETE: 'DROP_OUT_DELETE', // 회원탈퇴 삭제 상태
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CommentStatusType = typeof CommentStatusType[keyof typeof CommentStatusType];

/** 댓글 입력 가이드 */
export const COMMENT_INPUT_GUIDE = '본문과 무관한 댓글, 악성 댓글은 숨김 처리될 수 있습니다';
export const CommentQueryKeys = {
  COMMENT_LIST: 'COMMENT_LIST',
  COMMENT_REPORT: 'COMMENT_REPORT',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CommentQueryKeys = typeof CommentQueryKeys[keyof typeof CommentQueryKeys];

/** 댓글 타입 */
export const CommentPageType = {
  STORY: 'story',
  // SHOWROOM: 'showroom',
  // LIVE: 'live',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CommentPageType = typeof CommentPageType[keyof typeof CommentPageType];
