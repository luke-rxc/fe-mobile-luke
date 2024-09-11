import React, { forwardRef } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { useDrawer } from '@hooks/drawer';
import { DrawerPortal } from './DrawerPortal';

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
}

export interface DrawerInnerContentProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPositionTop: number;
  expandView: boolean;
  currentDragging: boolean;
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
      transitionDuration,
      title,
      nonPortal = DrawerDefault.nonPortal,
      fullHeight = DrawerDefault.fullHeight,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const {
      refs: { backDropRef, contentRef, draggingRef, contentInnerRef },
      isDragging,
      currentPositionTop,
      handleBackDrop,
    } = useDrawer({
      dragging,
      open,
      to,
      backDropProps,
      draggingProps,
      onClose,
      onCloseComplete,
      expandView,
      transitionDuration,
      fullHeight,
    });

    return (
      <DrawerPortal disable={nonPortal}>
        <div role="dialog" aria-label="drawer" ref={ref} className={classnames(className, { open })} {...props}>
          <div className="backdrop" onClick={handleBackDrop} ref={backDropRef} />
          <div className="content" ref={contentRef}>
            <div
              className={classnames('drag-handle-bar-wrapper', {
                'inner-title': !!title,
              })}
            >
              <div className="inner-bg" />
              {dragging && <div className="inner-bar" />}
              {title && (
                <div className="title">
                  <p className="title-label">{title.label}</p>
                </div>
              )}
            </div>
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
              currentDragging={isDragging}
              className={classnames('drawer-inner', {
                'inner-title': !!title,
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
  ({ currentPositionTop, expandView, currentDragging, className, ...props }, ref) => {
    return <div {...props} className={className} ref={ref} />;
  },
);

const DrawerInnerContentStyled = styled(DrawerInnerContent)`
  overflow-y: auto;
  padding-top: 3.2rem;
  /* padding-bottom: 2.4rem; */

  &.inner-title {
    padding-top: 5.6rem;
  }

  height: ${({ currentPositionTop, expandView, currentDragging }) => {
    /** Dragging을 마무리했을때 반영 */
    if (expandView && !currentDragging) {
      return `calc(100vh - ${currentPositionTop}px)`;
    }
    // return `calc(100% - 1.2rem)`;
    return '100%';
  }};
`;

/**
 * #### Figma의 MWeb Custom Modal ([Guide 문서 링크](https://www.notion.so/rxc/Drawer-44ad7b56025e401383b3292f6054ca64))
 * ###### Proto Example Router : /proto/drawer
 * ###### todo 220925
 *  * Storybook 관련 보완 필요
 *  * Mweb Modal 에 대한 확정 디자인 나올 시 수정이 있을 수도 없을 수도 있어 체크 필요
 * @deprecated
 */
export const Drawer = styled(DrawerWrapperComponent).attrs(({ transitionDuration }) => {
  return {
    transitionDuration: transitionDuration ?? DrawerDefault.transitionDuration,
  };
})`
  /* Main Wrapper */
  ${({ theme }) => theme.mixin.fixed({ t: 0, r: 0, b: 0, l: 0 })};
  ${({ theme }) => theme.mixin.z('floating')};
  box-sizing: border-box;
  overflow: hidden;
  font-size: ${({ theme }) => theme.fontSize.s15};
  visibility: hidden;
  transition: visibility 0ms ease-in ${({ transitionDuration }) => `${transitionDuration}ms`};

  &.open {
    visibility: visible;
    transition: visibility 0ms ease-in 50ms;
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
    opacity: ${({ backDropProps }) => backDropProps?.opacity ?? DrawerDefault.backDropProps.opacity};
    transition: opacity ${({ transitionDuration }) => `${transitionDuration}ms`} ease-in;
    height: 100%;
  }

  /* Content */
  .content {
    position: absolute;
    top: 0;
    z-index: 1;
    overflow: hidden;
    border-radius: 1.2rem;
    transition: transform ${({ transitionDuration }) => `${transitionDuration}ms`} ease-in-out;
    background-color: ${({ theme }) => theme.color.surface};

    /* bottom */
    transform: translateY(100vh);
    transform: translateY(calc(var(--vh, 1vh) * 100));
    width: 100%;
    border-radius: 1.2rem 1.2rem 0 0;

    .drag-handle {
      position: absolute;
      top: 0;
      width: 100%;
      height: 3.2rem;
      opacity: 0;
      z-index: 2;

      &.inner-title {
        height: 5.6rem;
      }
    }

    .drag-handle-bar-wrapper {
      position: absolute;
      width: 100%;
      height: 3.2rem;
      padding-top: 0.5rem;
      z-index: 1;

      &.inner-title {
        height: 5.6rem;
        .title {
          height: 4.4rem;
          position: relative;
          will-change: transform;

          .title-label {
            padding-left: 2.4rem;
            padding-top: 1.2rem;
            padding-bottom: 0.95rem;
            color: ${({ theme }) => theme.color.black};
            font: ${({ theme }) => theme.fontType.t20B};
          }
        }
      }

      .inner-bar {
        width: 3.6rem;
        height: 0.5rem;
        background-color: ${({ theme }) => theme.color.gray20};
        border-radius: 0.3rem;
        margin-left: auto;
        margin-right: auto;
        position: relative;
        will-change: transform;
      }

      .inner-bg {
        backdrop-filter: blur(1rem);
        box-shadow: 0 0.1rem 0 rgba(0, 0, 0, 0.1);
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        background: ${({ theme }) => theme.color.webHeader};
      }
    }
  }

  &.open .content {
    ${({ expandView, to }) => `transform: translateY(calc(100vh - 100% - ${expandView && to ? to : '0%'}));`}
    ${({ expandView, to }) =>
      `transform: translateY(calc(var(--vh, 1vh) * 100 - 100% - ${expandView && to ? to : '0%'} ));`}
  }
`;
