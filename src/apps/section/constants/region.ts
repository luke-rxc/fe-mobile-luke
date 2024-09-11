export const ShowroomRegionQueryKey = {
  ALL: 'region',
  ROOM_FILTER: 'roomFilter',
  ROOM_FILTER_TAG: 'roomFilterTag',
  ROOM_LIST: 'roomList',
  SHOWROOM_META_QUERY_KEY: 'SHOWROOM_META_QUERY_KEY',
} as const;

// FilterBar 카테고리의 전체 요소
export const CategoryFilterAll = {
  value: '전체',
  label: '전체',
} as const;

export const ShowroomRegionMessages = {
  EMPTY_ROOM_DESCRIPTION: '조건에 맞는 숙소가 없습니다\r\n필터 또는 날짜를 바꿔보세요',
  CLOSE_CONFIRM_TITLE: '선택하지 않고 나갈까요?',
  CLOSE_CONFIRM_MESSAGE: '내용은 저장되지 않습니다',
} as const;

// 필터 태그명 최대 길이
export const TAG_NAME_MAX_LENGTH = 17;
