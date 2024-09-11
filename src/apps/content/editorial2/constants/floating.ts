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
