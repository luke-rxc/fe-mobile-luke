import type { HTMLAttributes } from 'react';
import type {
  BackgroundInfoModel,
  ComponentRefModel,
  ContentInfoModel,
  DisplayMediaModel,
  ShowroomModel,
} from './Presets';

/**
 * footer 컴포넌트 타입
 */
export type FooterProps = FooterDisplayModel &
  HTMLAttributes<HTMLDivElement> &
  ShowroomModel & {
    contentInfo: ContentInfoModel;
    /** 컴포넌트 노출 여부 */
    visible: boolean;
  };

export type FooterDisplayModel = {
  color: string; // 컨텐츠 컬러
  backgroundInfo: BackgroundInfoModel; // 백그라운드 정보
  backgroundMedia: DisplayMediaModel; // 백그라운드 이미지 정보
  isOverlay: boolean; // 백그라운드 딤드
};

export type FooterComponentRefModel = ComponentRefModel;
