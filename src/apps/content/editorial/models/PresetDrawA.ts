import type { HTMLAttributes } from 'react';
import type {
  BackgroundInfoModel,
  ComponentRefModel,
  ContentInfoModel,
  DisplayMediaModel,
  DisplayNavigationOptionModel,
  DisplayTimeOptionModel,
} from './Presets';
import { EventModel } from './PresetDrawEvent';

/**
 * 응모 컴포넌트 - 경품 타입
 */
export type DrawAProps = DrawADisplayModel &
  HTMLAttributes<HTMLDivElement> & {
    contentInfo: ContentInfoModel;
    eventList: EventModel[];
    /** 미리보기시 기준시간 */
    displayDateTime: string;
    /** 컴포넌트 노출 여부 */
    visible: boolean;
  };

/**
 * 유저향 화면 요소에 대한 오피스와 프론트의 공통 인터페이스
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
export type DrawAComponentRefModel = ComponentRefModel;
