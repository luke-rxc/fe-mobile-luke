export const DrawLabel = {
  ACTIVE: '응모',
  COMPLETE: '응모 완료',
  FINISH: '응모 종료',
  LIMIT_ACTIVE: '사전 신청',
  LIMIT_COMPLETE: '신청 완료',
  LIMIT_FINISH: '신청 종료',
} as const;

export const DrawString = {
  END_MESSAGE: '응모 기간이 종료되었습니다',
  LIMIT_END_MESSAGE: '신청 기간이 지났습니다',
  LIMIT_FINISH_MESSAGE: '선착순 신청이 마감되었습니다',
} as const;
