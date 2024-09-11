/**
 * 페이드 상태
 */
export const FadeState = {
  IN: 'in',
  OUT: 'out',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type FadeState = typeof FadeState[keyof typeof FadeState];
