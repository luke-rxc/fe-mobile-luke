/**
 * 플로팅 배너 방향 상태
 */
export const FloatingDirectionStatus = {
  NONE: 'NONE',
  DOWN: 'DOWN',
  UP: 'UP',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type FloatingDirectionStatus = typeof FloatingDirectionStatus[keyof typeof FloatingDirectionStatus];

/**
 *  스낵바 상태
 */
export const FloatingStatus = {
  HIDE: 'HIDE', // 숨김
  SHOW: 'SHOW', // 노출
  HIGHLIGHT: 'HIGHLIGHT', // 강조
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type FloatingStatus = typeof FloatingStatus[keyof typeof FloatingStatus];
