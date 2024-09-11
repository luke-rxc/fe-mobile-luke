import type {
  BackgroundInfoModel,
  DisplayMediaModel,
  DisplayNavigationOptionModel,
  DisplayTimeOptionModel,
} from './Presets';

/**
 * 드로우 A 컴포넌트
 * - 유저향 화면 요소에 대한 오피스와 프론트의 공통 인터페이스
 */
export type DrawADisplayModel = DisplayTimeOptionModel &
  DisplayNavigationOptionModel & {
    backgroundInfo: BackgroundInfoModel; // 백그라운드 정보
    backgroundMedia: DisplayMediaModel; // 백그라운드 이미지 정보
    isOverlay: boolean; // 백그라운드 딤드
    button: {
      background: string; // 버튼 bg컬러
      color: string; // 버튼 텍스트 컬러
      label: string;
    };
  };
