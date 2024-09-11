/**
 * Sendbird action 타입
 */
export const SendbirdActionType = {
  MESSAGE: 'MESSAGE', // 사용자 메세지
  MESSAGE_FOR_ADMIN: 'MESSAGE_FOR_ADMIN', // 관리자 메세지
  SUBSCRIBE_SHOWROOM: 'SUBSCRIBE_SHOWROOM', // 팔로우 유도
  REFRESH_GOODS: 'REFRESH_GOODS', // 상품 목록 갱신
  UPDATE_VIDEO_URL: 'UPDATE_VIDEO_URL', // video url update
  RAFFLE_WINNER: 'RAFFLE_WINNER', // 당첨자 발표
  PURCHASE_VERIFICATION: 'PURCHASE_VERIFICATION', // 구매인증
  SHOW_FAQ: 'SHOW_FAQ', // FAQ 노출
  HIDE_FAQ: 'HIDE_FAQ', // FAQ 비노출
  END: 'END',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SendbirdActionType = typeof SendbirdActionType[keyof typeof SendbirdActionType];

/**
 * Sendbird sub action 타입
 */
export const SendbirdSubActionType = {
  FINAL_BIDDER: 'FINAL_BIDDER',
  ORDER_STATUS: 'ORDER_STATUS',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SendbirdSubActionType = typeof SendbirdSubActionType[keyof typeof SendbirdSubActionType];

/**
 * Sendbird error code
 */
export const SendbirdErrorCode = {
  USER_NOT_MEMBER: 900020, // 사용자가 채널의 구성원이 아니기 때문에 요청이 실패했습니다.
  MUTED_USER_IN_CHANNEL_SEND_MESSAGE_NOT_ALLOWED: 900041, // 사용자가 채널에서 음소거되어 메시지를 보낼 수 없기 때문에 요청이 실패했습니다.
  BANNED_USER_SEND_MESSAGE_NOT_ALLOWED: 900100, // 사용자가 채널에서 차단되어 메시지를 보낼 수 없기 때문에 요청이 실패했습니다.
  TOO_MANY_PARTICIPANTS: 900400, // 채널의 참가자 수가 허용량을 초과했습니다.
  TOO_MANY_USER_WEBSOCKET_CONNECTIONS: 400500, // 사용자의 웹소켓 연결 수가 허용된 양을 초과했습니다.
  TOO_MANY_APPLICATION_WEBSOCKET_CONNECTIONS: 400501, // 애플리케이션의 웹소켓 연결 수가 허용된 양을 초과했습니다.
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SendbirdErrorCode = typeof SendbirdErrorCode[keyof typeof SendbirdErrorCode];
