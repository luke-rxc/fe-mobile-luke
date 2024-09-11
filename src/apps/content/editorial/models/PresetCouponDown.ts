import type { HTMLAttributes } from 'react';
import { AlignType } from '../constants';
import type {
  BackgroundInfoModel,
  ComponentRefModel,
  ContentInfoModel,
  DisplayMediaModel,
  DisplayNavigationOptionModel,
  DisplayTimeOptionModel,
  TextItemModel,
} from './Presets';
import type { CardListDisplayModel, CardListModel, CouponModel } from './PresetCoupons';

/**
 * 쿠폰 다운 컴포넌트 타입
 */
export type CouponDownProps = CouponDownDisplayModel &
  HTMLAttributes<HTMLDivElement> & {
    contentInfo: ContentInfoModel;
    couponList: CouponModel[];
    /** 미리보기시 기준시간 */
    displayDateTime: string;
    /** 컴포넌트 노출 여부 */
    visible: boolean;
    deepLink?: string;
  };

/**
 * 유저향 화면 요소에 대한 오피스와 프론트의 공통 인터페이스
 */
export type CouponDownDisplayModel = DisplayTimeOptionModel &
  DisplayNavigationOptionModel & {
    align: AlignType; // 가로 정렬
    textEffect: boolean; // 텍스트 모션 효과 사용여부
    mainTitle: Omit<TextItemModel, 'sizeType'>; // 타이틀
    subTitle: Omit<TextItemModel, 'sizeType'>; // 서브타이틀
    description: Omit<TextItemModel, 'sizeType'>; // 디스크립션
    backgroundInfo: BackgroundInfoModel; // 백그라운드 정보
    backgroundMedia: DisplayMediaModel; // 백그라운드 이미지 정보
    isOverlay: boolean; // 백그라운드 딤드
    displayCard: CardListDisplayModel; // 카드 공통 정보
    cards: CardListModel[]; // 카드별 부가 정보
    button: {
      background: string; // 쿠폰다운 버튼 bg컬러
      color: string; // 쿠폰다운 버튼 텍스트 컬러
      label: string;
    };
    isSticky: boolean; // 패럴 여부
  };
export type CouponDownComponentRefModel = ComponentRefModel;

export type TitleSectionStyledModel = CouponDownStyledModel & {
  /** card 리스트 영역 높이 */
  contentHeight: string;
  /** 텍스트 영역 높이 */
  textAreaHeight: string;
  /** card sticky 처리를 위한 카드 상단 blank 영역 */
  blankHeight: string;
  /** card 리스트, 텍스트 영역 사이 여백 */
  marginHeight: string;
};
export type CouponSectionStyledModel = {
  /** sticky 여부 */
  isSticky: boolean;
  /** 타일내 카드 개수 */
  tilesChildNum: number[];
  /** 카드 높이 */
  cardHeight: number;
  /** 카드 사이 여백 */
  cardMargin: number;
  /** 카드 노출 사이즈 */
  visibleCardHeight: number;
  /** 타일사이 노출 사이즈 */
  tileStepValue: number;
};

export type CouponDownStyledModel = Pick<CouponDownDisplayModel, 'textEffect'> & {
  isSticky: boolean;
  introTranslateY: number;
  visibleCardHeight: number;
};
