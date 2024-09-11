import type { HTMLAttributes } from 'react';
import { AlignType, StyleBackgroundType, TextItemSizeType } from '../constants';
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
 * 미디어 B 컴포넌트 타입
 */
export type MediaBProps = MediaBDisplayModel &
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
export type MediaBDisplayModel = DisplayTimeOptionModel &
  DisplayNavigationOptionModel & {
    backgroundInfo: BackgroundInfoModel; // 백그라운드 정보
    backgroundMedia: DisplayMediaModel; // 백그라운드 이미지 정보
    isOverlay: boolean; // 백그라운드 딤드
    frontImage: DisplayMediaModel; // front 이미지 (모션적용)
    middleImage: DisplayMediaModel; // 오브젝트 이미지 (고정)
    align: AlignType; // 가로 정렬
    textEffect: boolean; // 텍스트 모션 효과 사용여부
    title: TextItemModel; // 타이틀
    subTitle: Omit<TextItemModel, 'sizeType'>; // 서브 타이틀
    description: Omit<TextItemModel, 'sizeType'>; // 디스크립션
  };

export type MediaBStyledProps = {
  background: {
    type: StyleBackgroundType;
    color: string;
    autoPlay?: boolean | null; // 비디오 자동 재생, false 시 패럴럭스
    videoDuration?: number; // 비디오 재생시간
  };
  align: AlignType; // 가로 정렬
  textEffect: boolean;
  titleBold: boolean;
  titleColor: string;
  titleSize: TextItemSizeType;
  subTitleBold: boolean;
  subTitleColor: string;
  descBold: boolean;
  descColor: string;
  frontImageTranslateY: number;
  titleOpacity: number;
  titleTranslateY: number;
  subTitleOpacity: number;
  subTitleTranslateY: number;
  descOpacity: number;
  descTranslateY: number;
  isOverlay: boolean; // 백그라운드 딤드
  isApp: boolean;
  isIOS: boolean;
};
export type MediaBComponentRefModel = ComponentRefModel;
