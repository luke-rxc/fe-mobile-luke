/**
 * 댓글 상태
 */
export const ReplyStatusType = {
  NORMAL: 'NORMAL', // 일반
  USER_DELETE: 'USER_DELETE', // 사용자 삭제상태
  ADMIN_DELETE: 'ADMIN_DELETE', // 관리자 삭제상태
  DROP_OUT_DELETE: 'DROP_OUT_DELETE', // 회원탈퇴 삭제 상태
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ReplyStatusType = typeof ReplyStatusType[keyof typeof ReplyStatusType];

/** 댓글 입력 가이드 */
export const REPLY_INPUT_GUIDE = '본문과 무관한 댓글, 악성 댓글은 숨김 처리될 수 있습니다';
export const ReplyQueryKeys = {
  REPLY_LIST: 'REPLY_LIST',
  REPLY_REPORT: 'REPLY_REPORT',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ReplyQueryKeys = typeof ReplyQueryKeys[keyof typeof ReplyQueryKeys];

/** 댓글 타입 */
export const ReplyPageType = {
  STORY: 'story',
  // SHOWROOM: 'showroom',
  // LIVE: 'live',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ReplyPageType = typeof ReplyPageType[keyof typeof ReplyPageType];
