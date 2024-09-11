export const LogEventTypes = {
  // 포인트 페이지 진입
  LogViewPoint: 'my_coupon.my_point.view_point',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LogEventTypes = ValueOf<typeof LogEventTypes>;
