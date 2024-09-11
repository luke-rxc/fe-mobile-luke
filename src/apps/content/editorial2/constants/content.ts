/**
 * 컨텐츠 공개 상태
 */
export const ContentStatusType = {
  ADMIN_PUBLIC: 'ADMIN_PUBLIC',
  PRIVATE: 'PRIVATE',
  PUBLIC: 'PUBLIC',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ContentStatusType = typeof ContentStatusType[keyof typeof ContentStatusType];

/**
 * 쇼룸 타입
 */
export const ShowroomType = {
  NORMAL: 'NORMAL',
  PGM: 'PGM',
  CONCEPT: 'CONCEPT',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ShowroomType = typeof ShowroomType[keyof typeof ShowroomType];

/**
 * 프리셋별 공통 키
 */
export const PresetKey = {
  /** 예약 노출 사용 여부 key */
  useDisplayDateTime: 'useDisplayDateTime',
  /** 예약 노출 시작 시간 */
  displayStartDateTime: 'displayStartDateTime',
  /** 예약 노출 종료 시간 */
  displayEndDateTime: 'displayEndDateTime',
  /** 네비게이션 사용 여부 key */
  useNavigation: 'useNavigation',
  /** 네비게이션 라벨명 key */
  navigationLabel: 'navigationLabel',
  /** 컴포넌트 노출 여부 key */
  visible: 'visible',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PresetKey = typeof PresetKey[keyof typeof PresetKey];

/**
 * 플로팅 노출 타입
 */
export const FloatingStatusType = {
  SHOW: 'SHOW',
  HIGHLIGHT: 'HIGHLIGHT',
  HIDE: 'HIDE',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type FloatingStatusType = typeof FloatingStatusType[keyof typeof FloatingStatusType];

export const BenefitTagType = {
  NONE: 'NONE',
  PRIZM_ONLY: 'PRIZM_ONLY',
  LIVE_ONLY: 'LIVE_ONLY',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type BenefitTagType = typeof BenefitTagType[keyof typeof BenefitTagType];
