export const DeleteUserErrorCode = {
  POINT: 'E500234', // 현금성 적립금이 남아있는 경우
  ORDER: 'E500235', // 주문 처리가 진행 중일 경우
  CS: 'E500236', // 취소/교환/반품 처리가 진행 중일 경우
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DeleteUserErrorCode = ValueOf<typeof DeleteUserErrorCode>;
