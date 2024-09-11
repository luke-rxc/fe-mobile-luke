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
 * 쿠폰 컴포넌트 타입
 */
export type CouponFollowProps = CouponFollowDisplayModel &
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
export type CouponFollowDisplayModel = DisplayTimeOptionModel &
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
    cards: CardListModel[];
    button: {
      background: string; // 버튼 bg컬러
      color: string; // 버튼 텍스트 컬러
      label: string;
    };
  };
export type CouponFollowComponentRefModel = ComponentRefModel;
