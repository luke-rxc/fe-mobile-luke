/**
 * 각 애니메이션을 위한 데이터 정보
 */
export type AnimationSet = {
  id: string; // 애니메이션 구분값
  animations: AnimationSection[]; // 애니메이션 구간 정보 리스트
};

/**
 * 애니메이션 구간별 정보
 */
export type AnimationSection = {
  startRange: number; // 시작 범위
  endRange: number; // 종료 범위
  startValue: number; // 시작 값
  endValue: number; // 종료 값
};

/**
 * 현재 스크롤을 기준으로, 구간에 따른 퍼센테이지로 계산된 애니메이션 결과값
 */
export type AnimationSetForScroll = {
  id: string; // 애니메이션 구분값
  value: number; // 현재 스크롤 기준, 애니메이션 결과 값
  contentRatio: number; // 컨텐츠 스크롤 수치 (0~1)
};
