import React, { useState, useEffect, forwardRef, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import classnames from 'classnames';
import type { TransitionStatus } from 'react-transition-group';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useTouchTap } from '@hooks/useTouchTap';

export interface ModalWrapperRenderProps {
  /** Event : Modal 닫기 */
  onClose: () => void;
  /** Transition (dep: react-transition-group) */
  transitionState: TransitionStatus;
}

export interface ModalWrapperInnerProps {
  /** backdrop 배경에서 close 진행 여부 막음 */
  disableBackDropClose?: boolean;
  /** modal body내 터치시 body scroll 방지 여부 */
  disableScroll?: boolean;
  /** Modal 내부 기본 Bg 사용하지 않음 (컨텐츠에 직접 Bg 추가할때 사용) */
  nonInnerBg?: boolean;
  /** fadeIn/Off Time (opacity, second 기준) */
  fadeTime?: number;
  /** modal transition 의 Timeout
   * - modal 의 총 Transition 타임
   * - 값이 없으면 fadeTime 값을 기본으로 사용, second 기준
   * - modal이 닫힐때 root 에서 Dom이 제거되기 까지 걸리는 시간
   */
  timeout?: number;
  /** 내부 Content 사이즈의 Full Sizing 여부 */
  fullSize?: boolean;
  /** Content Width (fullSize 가 true라면 적용되지 않는다.) */
  width?: string;
  /** Content heigh (fullSize 가 true라면 적용되지 않는다.) */
  height?: string;
  /** border radius @default '0' */
  radius?: string;
  /** Modal zIndex */
  zIndex?: number;
  /** backdrop Click */
  onBackDropClick?: () => void;
}

export type ModalWrapperProps = ModalWrapperRenderProps & ModalWrapperInnerProps & React.HTMLAttributes<HTMLDivElement>;

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`;

const fadeInIosWebChrome = keyframes`
  0% { opacity: 0; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

/** Modal 의 Transition Time 계산 */
export const getTransitionTimeout = (timeout?: number, fadeTime?: number) => {
  if (timeout) {
    return timeout ? timeout * 1000 : 0;
  }
  if (fadeTime) {
    return fadeTime ? fadeTime * 1000 : 0;
  }
  return 0;
};

const ModalWrapperComponent = forwardRef<HTMLDivElement, ModalWrapperProps>(
  (
    {
      children,
      className,
      disableBackDropClose = false,
      disableScroll = false,
      nonInnerBg = false,
      fullSize,
      width,
      height,
      fadeTime,
      radius,
      transitionState,
      onBackDropClick: handleBackDropClick,
      onClose: handleClose,
      zIndex,
      ...rest
    },
    ref,
  ) => {
    const backDropRef = useRef<HTMLDivElement>(null);
    const modalBodyRef = useRef<HTMLDivElement>(null);
    const { isIOSWebChrome } = useDeviceDetect();
    const [active, setActive] = useState(true);
    const { addTapEvent, removeTapEvent } = useTouchTap();
    const handleBackDrop = () => {
      handleBackDropClick?.();
      !disableBackDropClose && handleClose();
    };

    // body scroll 방지
    useEffect(() => {
      const handleTouchMove = (evt: TouchEvent) => {
        active && evt.preventDefault();
      };
      window.addEventListener('touchmove', handleTouchMove);

      if (disableScroll && modalBodyRef.current) {
        modalBodyRef.current.addEventListener('touchmove', handleTouchMove);
      }

      addTapEvent({
        ref: backDropRef,
        listener: handleBackDrop,
      });
      return () => {
        window.removeEventListener('touchmove', handleTouchMove);

        if (disableScroll && modalBodyRef.current) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          modalBodyRef.current.removeEventListener('touchmove', handleTouchMove);
        }

        removeTapEvent({
          ref: backDropRef,
          listener: handleBackDrop,
        });
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active]);

    useEffect(() => {
      if (transitionState === 'exiting') {
        setActive(false);
      }
    }, [transitionState]);

    return (
      <div
        role="dialog"
        aria-modal
        tabIndex={-1}
        className={classnames(className, {
          'in-active': !active,
          'ios-web-chrome': isIOSWebChrome,
        })}
        ref={ref}
        {...rest}
      >
        <div className="modal-backdrop" ref={backDropRef} />
        <div className={classnames('modal-body-wrapper', { 'inner-bg': !nonInnerBg })}>
          <div className="modal-body" ref={modalBodyRef}>
            {children}
          </div>
        </div>
      </div>
    );
  },
);

/**
 * Modal 핵심 모듈 : ModalWrapper 를 기반으로 hook 또는 component 형(Modal.tsx)으로 사용
 */
export const ModalWrapper = styled(ModalWrapperComponent)`
  ${({ theme }) => theme.mixin.fixed({ t: 0, r: 0, b: 0, l: 0 })};
  ${({ theme }) => theme.mixin.z('modal')};
  display: flex;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;

  /** Transition : Normal */
  animation: ${fadeIn} cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
  animation-duration: ${({ fadeTime }) => `${fadeTime}s`};

  &.in-active {
    animation: ${fadeOut} cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
    animation-duration: ${({ fadeTime }) => `${fadeTime}s`};
  }

  /** Transition : iOS Web Chrome */
  &.ios-web-chrome {
    animation: ${fadeInIosWebChrome} cubic-bezier(0.34, 0.13, 0.455, 0.955);
    animation-duration: 500ms;
  }

  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
  }

  .modal-body-wrapper {
    position: relative;
    width: ${({ fullSize, width }) => (fullSize ? '100vw' : width)};
    height: ${({ fullSize, height }) => (fullSize ? '100vh' : height)};
    margin: 0 auto;
    font-size: ${({ theme }) => theme.fontSize.s15};
    border-radius: ${({ radius = '0' }) => radius};
    overflow: hidden;

    &.inner-bg {
      background: ${({ theme }) => theme.color.background.surface};
    }

    .modal-body {
      width: 100%;
    }
  }
`;
