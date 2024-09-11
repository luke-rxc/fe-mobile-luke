import type { TransitionStatus } from 'react-transition-group';

export interface ModalRenderProps {
  onClose: () => void;
  transitionState: TransitionStatus;
}
export interface ModalProps {
  // backdrop 배경에서 close 여부
  isDisableBackDropClose?: boolean;
  // Modal 내부 기본 Bg 사용하지 않음 (컨텐츠에 직접 Bg 추가할때 사용)
  isDisableInnerBg?: boolean;
  // fadeIn/Off Time (opacity)
  fadeTime?: number;
  // modal transition Time (modal 의 총 Transition 타임, 값이 없으면 fadeTime 값을 기본으로 사용)
  transitionTime?: number;
  // 내부 Content 사이즈의 Full Sizing 여부
  isFullSize?: boolean;
  // Content Width (isFullSize 가 true라면 적용되지 않는다.)
  width?: string;
  // Content heigh (isFullSize 가 true라면 적용되지 않는다.)
  height?: string;
  // Header 사용 여부
  isNonHeader?: boolean;
  // Header Title (isNonHeader가 true라면 적용되지 않는다.)
  title?: string;
  // border
  radius?: string;
  // Modal zindex
  modalZIndex?: number;
  // backdrop Click
  onBackDropClick?: () => void;
}
