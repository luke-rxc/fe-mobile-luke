/** 좌석 레이아웃 구성요소 타입 */
export const SeatObjectType = {
  SEAT: 'SEAT',
  PART_VIEW_SEAT: 'PART_VIEW_SEAT',
  WHEELCHAIR_SEAT: 'WHEELCHAIR_SEAT',
  STANDING: 'STANDING',
  OTHER_COMPANY: 'OTHER_COMPANY',
  WAY_ROW: 'WAY_ROW',
  WAY_COL: 'WAY_COL',
  WAY_CROSS: 'WAY_CROSS',
  BLANK: 'BLANK',
} as const;

/** 좌석 정보 텍스트 관리 */
export const SeatInfoText = {
  EXPIRED: {
    TITLE: '좌석 선점 시간이 종료되었습니다',
    MESSAGE: '다시 선택해주세요',
  },
  ERROR: {
    DEFAULT_MESSAGE: '일시적인 오류가 발생했습니다',
  },
} as const;

/** 좌석 API Query Key */
export const SEAT_INFO_QUERY_KEY = 'SEAT_INFO_QUERY_KEY' as const;
export const SEAT_SINGLE_INFO_QUERY_KEY = 'SEAT_SINGLE_INFO_QUERY_KEY' as const;

/** 좌석 플로팅 타입 */
export const SeatFloatingType = {
  PART_VIEW_SEAT: '시야제한석',
  WHEELCHAIR_SEAT: '휠체어석',
  STANDING: '스탠딩석',
} as const;
