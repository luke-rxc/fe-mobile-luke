import type {
  AlignType,
  CTAButtonActionType,
  CTAButtonStyleType,
  CTAButtonTopSpacingType,
  LayoutDirectionType,
} from '../constants';
import type {
  BackgroundInfoModel,
  DisplayMediaModel,
  DisplayNavigationOptionModel,
  DisplayTimeOptionModel,
  TextItemModel,
} from './Presets';

/**
 * CTA 컴포넌트
 * - 유저향 화면 요소에 대한 오피스와 프론트의 공통 인터페이스
 */
export type CtaDisplayModel = DisplayTimeOptionModel &
  DisplayNavigationOptionModel & {
    direction: LayoutDirectionType; // 버튼 레이아웃 방향
    buttonTopSpacing: CTAButtonTopSpacingType; // 버튼 최상단 여백
    buttonStyle: CTAButtonStyleType; // 버튼 스타일
    buttonTextAlign: Omit<AlignType, 'RIGHT'>; // 버튼 텍스트 정렬
    textEffect: boolean; // 텍스트 모션 효과 사용여부
    title: Omit<TextItemModel, 'sizeType'>; // 타이틀
    subTitle: Omit<TextItemModel, 'sizeType'>; // 서브 타이틀
    description: Omit<TextItemModel, 'sizeType'>; // 디스크립션
    backgroundInfo: BackgroundInfoModel; // 백그라운드 정보
    backgroundMedia: DisplayMediaModel; // 백그라운드 이미지 정보
    isOverlay: boolean; // 백그라운드 딤드
    align: AlignType; // 텍스트 정렬
    buttons: CtaButtonModel[];
  };

export type CtaButtonModel = {
  buttonActionType: CTAButtonActionType;
  value: string;
  isRequiredLogin: boolean;
  bg: string;
  color: string;
  label: string;
};
