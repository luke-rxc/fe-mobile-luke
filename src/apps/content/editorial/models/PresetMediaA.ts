import type { HTMLAttributes } from 'react';
import { AlignType, StyleBackgroundType, TextItemSizeType, VerticalAlignType } from '../constants';
import type {
  BackgroundInfoModel,
  ComponentRefModel,
  ContentInfoModel,
  DisplayMediaModel,
  DisplayNavigationOptionModel,
  DisplayTimeOptionModel,
  TextItemModel,
} from './Presets';

/**
 * 미디어 A 컴포넌트 타입
 */
export type MediaAProps = MediaADisplayModel &
  Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
    contentInfo: ContentInfoModel;
    /** 미리보기시 기준시간 */
    displayDateTime: string;
    /** 컴포넌트 노출 여부 */
    visible: boolean;
  };

/**
 * 유저향 화면 요소에 대한 오피스와 프론트의 공통 인터페이스
 */
export type MediaADisplayModel = DisplayTimeOptionModel &
  DisplayNavigationOptionModel & {
    align: AlignType; // 가로 정렬
    verticalAlign: VerticalAlignType; // 세로 정렬
    mainImage: DisplayMediaModel; // 메인이미지  정보
    textEffect: boolean; // 텍스트 모션 효과 사용여부
    title: TextItemModel; // 타이틀
    subTitle: Omit<TextItemModel, 'sizeType'>; // 서브 타이틀
    description: Omit<TextItemModel, 'sizeType'>; // 디스크립션
    backgroundInfo: BackgroundInfoModel; // 백그라운드 정보
    backgroundMedia: DisplayMediaModel; // 백그라운드 미디어 정보
    parallaxMode: boolean; // 패럴럭스 모드(sticky타입)
    isOverlay: boolean; // 백그라운드 딤드
  };

export type MediaAStyledProps = {
  verticalAlign: VerticalAlignType;
  parallaxMode: boolean;
  background: {
    type: Omit<StyleBackgroundType, 'COLOR'>;
    autoPlay: boolean | null; // 비디오 자동 재생, false 시 패럴럭스
    videoDuration?: number; // 비디오 재생시간
    color: string; // 배경 컬러
  };
  align: AlignType;
  textEffect: boolean;
  titleBold: boolean;
  titleColor: string;
  titleSize: TextItemSizeType;
  subTitleBold: boolean;
  subTitleColor: string;
  descBold: boolean;
  descColor: string;
  objectTranslateY: number;
  objectOpacity: number;
  titleOpacity: number;
  titleTranslateY: number;
  subTitleOpacity: number;
  subTitleTranslateY: number;
  descOpacity: number;
  descTranslateY: number;
  isOverlay: boolean;
  isApp: boolean;
  isIOS: boolean;
};
export type MediaAComponentRefModel = ComponentRefModel;
