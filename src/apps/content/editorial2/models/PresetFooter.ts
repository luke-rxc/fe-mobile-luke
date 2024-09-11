import type { BackgroundInfoModel, DisplayMediaModel } from './Presets';

/**
 * 푸터 컴포넌트
 * - 유저향 화면 요소에 대한 오피스와 프론트의 공통 인터페이스
 */
export type FooterDisplayModel = {
  color: string; // 컨텐츠 컬러
  backgroundInfo: BackgroundInfoModel; // 백그라운드 정보
  backgroundMedia: DisplayMediaModel; // 백그라운드 이미지 정보
  isOverlay: boolean; // 백그라운드 딤드
};
