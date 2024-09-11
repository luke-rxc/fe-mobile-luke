import React, { forwardRef } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { useDrawerCore } from '@hooks/drawerV2';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { DrawerPortal } from '../DrawerPortal';

export interface BackDropProps {
  /**
   * bgColor
   * @default #000
   */
  bgColor?: string;
  /**
   * opacity
   * @default 0.4
   */
  opacity?: number;
  /**
   * backdrop 배경 클릭시 Close 방지 여부
   * @default false
   */
  disableBackDropClose?: boolean;
  /** backdrop Click Function */
  onBackDropClick?: () => void;
  /** transition ms */
  transitionDuration?: number;
}

export interface DraggingCloseConfirmProps {
  /** Dialog Confirm: Title */
  title?: string;
  /** Dialog Confirm: Message */
  message: string;
  /** 버튼이 아닌 다른 곳을 탭했을때 닫히는 여부 방지 */
  disableForceClose?: boolean;
  /** Dialog Confirm 실행 조건 */
  condition?: boolean;
  /** Close Callback */
  cb?: () => void;
}

export interface DraggingProps {
  /**
   * Dragging 시에 위에서 아래로 몇 퍼센트 정도 내려간 상황에서 드래그가 끝났을때, Close 할지 여부
   * @default 40
   */
  closePercent?: number;
  /**
   * 리스트 height 설정을 하지않고 자동으로 컨텐츠 사이즈가 잡힐때, 상단 header 가 있다면 그 height 바로 밑으로까지 컨텐츠 이동 가능
   * @default 0
   */
  layoutHeaderHeight?: number;
  /**
   * Dragging 하여 닫을 경우에 Confirm 활성화, expandView에서는 작동하지 않음
   * @default undefined
   */
  closeConfirm?: DraggingCloseConfirmProps;
}

export interface TitleProps {
  /** 타이틀 Label */
  label: string;
}

export interface DrawerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Dragging 여부
   * @default false
   */
  dragging?: boolean;
  /** Drawer Open */
  open: boolean;
  /** Close Function */
  onClose: () => void;
  /** Close Complete Function */
  onCloseComplete?: () => void;
  /**
   * [dragging + expandView only] Drawer 활성화시 Position 위치 값(% 기준으로 입력)
   */
  to?: string;
  /** backDrop Props */
  backDropProps?: BackDropProps;
  /** dragging Props */
  draggingProps?: DraggingProps;
  /**
   * [dragging only] to 위치 ~ 상단까지 확장
   * @default false
   */
  expandView?: boolean;
  /** 확장뷰인 경우, Dragging 시에 위로 몇 퍼센트 정도 올라간 상황에서 드래그가 끝났을때, TOP으로 이동 할지 여부  */
  snapTopPercent?: number;
  /**
   * transition ms
   * @default 300
   */
  transitionDuration?: number;
  /** title Props */
  title?: TitleProps;
  /** Portal 미사용 여부 */
  nonPortal?: boolean;
  /** Full Height 상태로 활성화 */
  fullHeight?: boolean;
  /** drag Handle Height */
  dragHandleHeight?: string;
  /**
   * horizontal scroll
   * @issue content class 내 overflow: hidden 값으로 인해 가로 스크롤 영역이 달라지는 이슈
   */
  horizontalScroll?: boolean;
  /** title 우측 영역 커스터마이징 요소 */
  toolbarSuffix?: React.ReactNode;
  /** vertical scroll */
  verticalScroll?: boolean;
  /** disabled bg blur */
  disabledBlur?: boolean;
}

interface DrawerInnerContentProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPositionTop: number;
  expandView: boolean;
  snapDirection?: string;
  currentDragging: boolean;
  verticalScroll?: boolean;
}

export interface BaseDomProps {
  htmlHeight?: string;
  bodyHeight?: string;
  bodyPosition?: string;
}

/** 기본 Drawer Default Prop Value */
export const DrawerDefault = {
  transitionDuration: 300,
  dragging: false,
  expandView: false,
  snapTopPercent: 85,
  backDropProps: {
    bgColor: '#000',
    opacity: 0.4,
  },
  draggingProps: {
    closePercent: 40,
    layoutHeaderHeight: 0,
  },
  nonPortal: false,
  fullHeight: false,
  dragHandleHeight: '3.2rem',
  horizontalScroll: false,
  verticalScroll: true,
  disabledBlur: false,
} as const;

const DrawerWrapperComponent = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      dragging = DrawerDefault.dragging,
      open,
      to,
      backDropProps,
      draggingProps,
      onClose,
      onCloseComplete,
      expandView = DrawerDefault.expandView,
      snapTopPercent = DrawerDefault.snapTopPercent,
      transitionDuration,
      title,
      nonPortal = DrawerDefault.nonPortal,
      fullHeight = DrawerDefault.fullHeight,
      dragHandleHeight,
      horizontalScroll,
      toolbarSuffix,
      verticalScroll = DrawerDefault.verticalScroll,
      disabledBlur,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const { isIOSWebChrome } = useDeviceDetect();
    const {
      refs: { backDropRef, contentRef, draggingRef, contentInnerRef },
      isDragging,
      innerScrollY,
      currentPositionTop,
      snapDirection,
    } = useDrawerCore({
      dragging,
      open,
      to,
      backDropProps,
      draggingProps,
      onClose,
      onCloseComplete,
      expandView,
      snapTopPercent,
      transitionDuration,
      fullHeight,
    });

    return (
      <DrawerPortal disable={nonPortal}>
        <div role="dialog" aria-label="drawer" ref={ref} className={classnames(className, { open })} {...props}>
          <div className="backdrop" ref={backDropRef} />
          <div className={classnames('content', { horizontal: horizontalScroll })} ref={contentRef}>
            <div
              className={classnames('drag-handle-bar-wrapper', {
                'inner-title': !!title,
              })}
            >
              <div
                className={classnames('inner-bg', {
                  scrolling: !disabledBlur && innerScrollY > 0,
                })}
              />
              {dragging && <div className="inner-bar" />}
              {title && (
                <div className="title">
                  <p className="title-label">{title.label}</p>
                </div>
              )}
            </div>
            {toolbarSuffix && <div className="inner-toolbar-suffix">{toolbarSuffix}</div>}
            {dragging && (
              <div
                className={classnames('drag-handle', {
                  'inner-title': !!title,
                })}
                ref={draggingRef}
              />
            )}
            <DrawerInnerContentStyled
              currentPositionTop={currentPositionTop}
              expandView={expandView}
              verticalScroll={verticalScroll}
              snapDirection={snapDirection}
              currentDragging={isDragging}
              className={classnames('drawer-inner', {
                'inner-title': !!title,
                'not-ios-web-chrome': !isIOSWebChrome,
              })}
              ref={contentInnerRef}
            >
              {children}
            </DrawerInnerContentStyled>
          </div>
        </div>
      </DrawerPortal>
    );
  },
);

const DrawerInnerContent = forwardRef<HTMLDivElement, DrawerInnerContentProps>(
  ({ currentPositionTop, expandView, snapDirection, currentDragging, className, ...props }, ref) => {
    return <div {...props} className={className} ref={ref} />;
  },
);

const DrawerInnerContentStyled = styled(DrawerInnerContent)`
  overflow-y: ${({ verticalScroll }) => {
    if (verticalScroll) {
      return 'auto';
    }
    return 'hidden';
  }};
  height: ${({ currentPositionTop, expandView }) => {
    if (expandView) {
      return `calc(100% - ${currentPositionTop}px + 5.6rem)`;
    }
    return '100%';
  }};
  padding-top: 3.2rem;
  padding-bottom: constant(safe-area-inset-bottom);
  transition: ${({ snapDirection, expandView }) => {
    if (expandView) {
      // down snap시 drawer 위치가 트랜지션 되는 동안, height값 리사이즈가 보이지 않도록 delay 처리
      return `height 0s ${snapDirection === 'DOWN' ? '0.2s' : '0s'}`;
    }
    return null;
  }};

  /**
  * IOS chrome에서 스크롤해서 주소창 및 하단바 영역이 사라졌을 경우에도 해당 safe area를 잡고있는 이슈로 인해 수정
  */
  &.not-ios-web-chrome {
    padding-bottom: env(safe-area-inset-bottom);
  }

  &.inner-title {
    padding-top: 5.6rem;
  }
`;

/**
 * #### Figma의 MWeb Custom Modal ([Guide 문서 링크](https://www.notion.so/rxc/Drawer-44ad7b56025e401383b3292f6054ca64))
 * ###### Proto Example Router : /proto/drawer
 * ###### todo 220925
 *  * Storybook 관련 보완 필요
 *  * Mweb Modal 에 대한 확정 디자인 나올 시 수정이 있을 수도 없을 수도 있어 체크 필요
 */
export const DrawerV2 = styled(DrawerWrapperComponent).attrs(({ transitionDuration, dragHandleHeight }) => {
  return {
    transitionDuration: transitionDuration ?? DrawerDefault.transitionDuration,
    dragHandleHeight: dragHandleHeight ?? DrawerDefault.dragHandleHeight,
  };
})`
  /* Main Wrapper */
  ${({ theme }) => theme.mixin.fixed({ t: 0, r: 0, b: 0, l: 0 })}
  ${({ theme }) => theme.mixin.z('floating')};
  box-sizing: border-box;
  overflow: hidden;
  font-size: ${({ theme }) => theme.fontSize.s15};
  visibility: hidden;
  transition: visibility 0ms linear ${({ transitionDuration }) => `${transitionDuration}ms`};

  &.open {
    visibility: visible;
    transition: visibility 0ms linear 50ms;
  }

  /* Back Drop */
  .backdrop {
    position: absolute;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: ${({ backDropProps }) => backDropProps?.bgColor ?? DrawerDefault.backDropProps.bgColor};
    opacity: 0;
    transition: opacity ${({ transitionDuration }) => `${transitionDuration}ms`} ease-in;
  }

  &.open .backdrop {
    height: 100%;
    opacity: ${({ backDropProps }) => backDropProps?.opacity ?? DrawerDefault.backDropProps.opacity};
    transition: opacity ${({ transitionDuration }) => `${transitionDuration}ms`} ease-in;
  }

  /* Content */
  .content {
    overflow: hidden;
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    border-radius: ${({ theme }) => `${theme.radius.r12} ${theme.radius.r12} 0 0`};
    background-color: ${({ theme }) => theme.color.background.surface};

    /* bottom */
    transform: translateY(100%);
    transition: transform ${({ transitionDuration }) => `${transitionDuration}ms`} ease-in-out;
    will-change: transform;

    &.horizontal {
      overflow: visible;
    }

    .drag-handle {
      position: absolute;
      top: 0;
      z-index: 2;
      width: 100%;
      height: ${({ dragHandleHeight }) => dragHandleHeight};
      opacity: 0;

      &.inner-title {
        height: 5.6rem;
      }
    }

    .inner-toolbar-suffix {
      display: flex;
      position: absolute;
      right: 0;
      z-index: 3;
      align-items: center;
      padding: ${({ theme }) => `${theme.spacing.s12} ${theme.spacing.s8} 0 0`};
    }

    .drag-handle-bar-wrapper {
      position: absolute;
      z-index: 2;
      width: 100%;
      height: 3.2rem;
      padding-top: 0.5rem;

      &.inner-title {
        height: 5.6rem;

        .title {
          position: relative;
          height: 4.4rem;
          will-change: transform;

          .title-label {
            padding-top: ${({ theme }) => theme.spacing.s12};
            padding-bottom: 0.95rem;
            padding-left: ${({ theme }) => theme.spacing.s24};
            color: ${({ theme }) => theme.color.text.textPrimary};
            font: ${({ theme }) => theme.fontType.title2B};
          }
        }
      }

      .inner-bar {
        position: relative;
        width: 3.6rem;
        height: 0.5rem;
        margin-right: auto;
        margin-left: auto;
        border-radius: 0.3rem;
        background-color: ${({ theme }) => theme.color.gray20};
        will-change: transform;
      }

      .inner-bg {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: ${({ theme }) => `${theme.radius.r12} ${theme.radius.r12} 0 0`};
        /** IOS 쌓임 맥락 버그로 background 값 적용이 안되어 transform 값으로 쌓임 맥락에 추가 */
        transform: translateZ(0);

        &.scrolling {
          background: ${({ theme }) => theme.color.webHeader};
          box-shadow: 0 0.1rem 0 rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(1rem);
        }
      }
    }
  }

  &.open .content {
    ${({ expandView, to }) => `transform: translateY(calc(0% - ${expandView && to ? to : '0%'}));`}
  }
`;
