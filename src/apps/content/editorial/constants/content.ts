/**
 * 컨텐츠 공개 상태
 */
export const ContentStatusType = {
  ADMIN_PUBLIC: 'ADMIN_PUBLIC',
  PRIVATE: 'PRIVATE',
  PUBLIC: 'PUBLIC',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ContentStatusType = typeof ContentStatusType[keyof typeof ContentStatusType];
