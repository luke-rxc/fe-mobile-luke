import type { HTMLAttributes } from 'react';
import { MediaViewerRatio, OverlayColorTypes } from '../constants';
import type {
  ComponentRefModel,
  ContentInfoModel,
  DisplayMediaModel,
  DisplayNavigationOptionModel,
  DisplayTimeOptionModel,
  LandingActionModel,
} from './Presets';

/**
 * 미디어뷰어 A 컴포넌트 타입
 */
export type MediaViewerAProps = MediaViewerADisplayModel &
  HTMLAttributes<HTMLDivElement> & {
    contentInfo: ContentInfoModel;
    /** 미리보기시 기준시간 */
    displayDateTime: string;
    /** 컴포넌트 노출 여부 */
    visible: boolean;
  };

/**
 * 유저향 화면 요소에 대한 오피스와 프론트의 공통 인터페이스
 */
export type MediaViewerADisplayModel = DisplayTimeOptionModel &
  DisplayNavigationOptionModel & {
    mediaViewRatio: MediaViewerRatio; // 미디어 노출 비율 정보
    mediaLists: MediaViewerACardItemModel[];
    controller: MediaViewControllerModel; // 페이지네이션 컨트롤러 영역
  };

export type MediaViewerACardItemModel = DisplayMediaModel & {
  actions: LandingActionModel; // 랜딩 액션
  visibleMediaMute: boolean; // 음소거 버튼 노출 여부
};

type MediaViewControllerModel = {
  bulletColor: string; // 인디케이터 색상
  background: OverlayColorTypes; // 오버레이 색상타입
};
export type MediaViewerAComponentRefModel = ComponentRefModel;
