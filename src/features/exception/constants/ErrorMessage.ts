export const ErrorStatus = {
  NotFound: 404,
  Traffic: 429,
} as const;

export const ErrorTitle = {
  Traffic: '사용자가 많아 접속이 어렵습니다',
  Network: '네트워크 연결이 원활하지 않습니다',
} as const;

export const ErrorMessage = {
  NotFound: '페이지를 찾을 수 없습니다',
  Traffic: '잠시 후 다시 시도해주세요',
  Network: 'Wi-Fi 또는 데이터 연결을 확인해주세요',
} as const;

export const ErrorActionButtonLabel = {
  CONFIRM: '확인',
  RELOAD: '다시 시도',
  HOME: '홈으로 이동',
} as const;
