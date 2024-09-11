/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback, forwardRef, useImperativeHandle, useRef } from 'react';
import type { TransitionStatus } from 'react-transition-group';
import classNames from 'classnames';
import styled from 'styled-components';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useSnackbar } from '@hooks/useSnackbar';
import { SnackbarInner, SnackbarInnerProps } from './SnackbarInner';

/** Type */
/** direction type */
export type SnackbarDirectionType = 'top' | 'center' | 'bottom';
/** variants type */
export type SnackbarVariantsType = 'base' | 'failure' | 'success';

export interface SnackbarProps extends SnackbarInnerProps {
  /**
   * Snackbar 배경 타입
   * @default base
   * @description failure, success는 v1에서 사용하지 않음, 21.12.22
   */
  variants?: SnackbarVariantsType;

  /**
   * Snackbar 위치
   * @default bottom
   */
  direction?: SnackbarDirectionType;

  /** 활성화 된 후 자동으로 사라지는 시간, 자동 Remove (ms 기준) @default false */
  autoDismiss?: number | false;

  /**
   * fadeIn 되는 시간(ms), fadeOut은 fadeIn / 2로 계산하여 진행, Slide를 사용할때 같은 값으로 반영
   * @default 250
   */
  fadeTime?: number;

  /**
   * slide Option 사용 여부
   * @issue 현재 Direction Bottom 모드만 사용 가능
   * @default false
   */
  slide?: boolean;

  /**
   * 기본 설정된 위치(Direction)기준에서, Top만큼 더 차이를 두고 조정
   * @default 0px
   */
  top?: string;

  /**
   * 드래그를 통한 스낵바 삭제기능 사용 여부
   */
  dragDismiss?: boolean;

  /**
   * 수동 zIndex 처리
   */
  zIndex?: number;

  /**
   * floatingBanner를 이용하는지 확인 여부
   */
  isFloatingBanner?: boolean;

  onRemove?: () => void;
}

export interface SnackbarComponentProps extends React.HTMLAttributes<HTMLDivElement>, SnackbarProps {
  transitionState: TransitionStatus;
  snackbarId: string;
}

const BaseProps = {
  direction: 'bottom',
  autoDismiss: false,
  variants: 'base',
  fadeTime: 250,
  slide: false,
  top: '0px',
  zIndex: 0,
} as const;

const SnackbarComponent = forwardRef<HTMLDivElement, SnackbarComponentProps>(
  (
    {
      className,
      direction,
      autoDismiss = BaseProps.autoDismiss,
      variants,
      fadeTime = BaseProps.fadeTime,
      slide,
      top,
      snackbarId = '',
      transitionState,
      dragDismiss,
      zIndex,
      isFloatingBanner,
      onRemove,
      ...props
    },
    ref,
  ) => {
    const { isApp, isIOS } = useDeviceDetect();
    const { removeSnackbar } = useSnackbar();
    const [active, setActive] = useState(true);
    const [isMount, setIsMount] = useState(false);
    const snackbar = useRef<HTMLDivElement>(null);

    const dismissTimer = useRef<number | undefined | void>();
    const snackbarHeight = useRef<number | undefined>();
    const startTouchY = useRef<number | undefined>();

    /**
     * Snackbar Dismiss
     */
    const handleRemoveSnackbar = useCallback(() => {
      isMount && setActive(false);
      onRemove?.();
    }, [isMount]);

    /**
     * Snackbar Dismiss를 위한 setTimeout 설정
     */
    const setAutoDismiss = useCallback(
      (time: number) => {
        dismissTimer.current = window.setTimeout(() => {
          handleRemoveSnackbar();
        }, time);
      },
      [removeSnackbar],
    );

    /**
     * Snackbar Dismiss를 위한 setTimeout 삭제
     */
    const clearAutoDismiss = () => {
      dismissTimer.current = dismissTimer.current && window.clearTimeout(dismissTimer.current);
    };

    /**
     * Snackbar Touch Start
     */
    const handleTouchStart = useCallback((e: TouchEvent) => {
      if (e.touches.length > 1) {
        return;
      }

      startTouchY.current = e.touches[0].clientY;
      snackbarHeight.current = snackbar.current?.offsetHeight;

      clearAutoDismiss();
    }, []);

    /**
     * Snackbar Touch Move
     */
    const handleTouchMove = useCallback(
      (e: TouchEvent) => {
        if (e.touches.length > 1 || !snackbarHeight.current) {
          return;
        }
        e.cancelable && e.preventDefault();

        const threshold = Math.floor(snackbarHeight.current * 0.5);
        const moved = Math.floor(e.touches[0].clientY - (startTouchY.current || 0));
        threshold < moved && handleRemoveSnackbar();
      },
      [handleRemoveSnackbar],
    );

    /**
     * Snackbar Touch Cancel & End
     */
    const handleTouchCancel = useCallback(
      (e: TouchEvent) => {
        if (e.touches.length > 1) {
          return;
        }
        autoDismiss && setAutoDismiss(fadeTime ? fadeTime + autoDismiss : autoDismiss);
      },
      [fadeTime, autoDismiss],
    );

    /**
     * Dismiss 설정
     */
    useEffect(() => {
      if (autoDismiss) {
        setAutoDismiss(fadeTime ? fadeTime + autoDismiss : autoDismiss);
        return clearAutoDismiss;
      }

      // floatingBanner로 호출되지 않고 autoDismiss와 dragDismiss가 설정되지 않은 경우에는 클릭시 바로 닫힘
      if (!dragDismiss && !isFloatingBanner) {
        document.body.addEventListener('click', handleRemoveSnackbar);
        return () => {
          document.body.removeEventListener('click', handleRemoveSnackbar);
        };
      }

      return undefined;
    }, [dragDismiss, autoDismiss, fadeTime]);

    /**
     * 실제 스낵바 삭제
     */
    useEffect(() => {
      !active && setTimeout(() => removeSnackbar(snackbarId), fadeTime);
    }, [active, fadeTime, snackbarId, removeSnackbar]);

    /**
     * dragDismiss을 위한 이벤트 설정
     */
    useEffect(() => {
      if (dragDismiss && direction === 'bottom') {
        snackbar.current?.addEventListener('touchstart', handleTouchStart, false);
        snackbar.current?.addEventListener('touchmove', handleTouchMove, false);
        snackbar.current?.addEventListener('touchend', handleTouchCancel, false);
        snackbar.current?.addEventListener('touchcancel', handleTouchCancel, false);
      }

      return () => {
        snackbar.current?.removeEventListener('touchstart', handleTouchStart);
        snackbar.current?.removeEventListener('touchmove', handleTouchMove);
        snackbar.current?.removeEventListener('touchend', handleTouchCancel);
        snackbar.current?.removeEventListener('touchcancel', handleTouchCancel);
      };
    }, [isMount, direction, dragDismiss]);

    useEffect(() => {
      const timeout = setTimeout(() => setIsMount(true), 50);
      return () => clearTimeout(timeout);
    }, []);

    /**
     * setting ref
     */
    useImperativeHandle(ref, () => snackbar.current as HTMLDivElement);

    return (
      <div
        ref={snackbar}
        className={classNames(className, { mounted: isMount, 'in-active': !active, 'is-ios': isApp && isIOS })}
      >
        <SnackbarInner {...props} snackbarId={snackbarId} className={classNames({ 'is-ios': isApp && isIOS })} />
      </div>
    );
  },
);

/**
 * Figma Snackbar 컴포넌트
 */
export const Snackbar = styled(SnackbarComponent).attrs(
  ({ direction, variants, fadeTime, slide, top, zIndex, isFloatingBanner }) => {
    return {
      direction: direction ?? BaseProps.direction,
      variants: variants ?? BaseProps.variants,
      fadeTime: fadeTime ?? BaseProps.fadeTime,
      slide: slide ?? BaseProps.slide,
      top: top ?? '0px',
      zIndex: zIndex ?? BaseProps.zIndex,
      isFloatingBanner: isFloatingBanner ?? false,
    };
  },
)`
  ${({ theme }) => theme.mixin.fixed({ l: 0, r: 0 })};
  ${({ theme }) => theme.mixin.z('floating')};
  border-radius: ${({ theme }) => theme.radius.r8};
  color: ${({ theme }) => theme.color.white};
  margin: ${({ theme }) => theme.spacing.s16};
  opacity: 0;

  ${({ isFloatingBanner }) =>
    isFloatingBanner &&
    `
    position: static;
    margin: 0;
  `}

  ${({ zIndex, theme }) => {
    if (zIndex > 0) {
      return `
        z-index: ${zIndex};
      `;
    }
    return theme.mixin.z('floating');
  }};

  ${({ variants, theme }) => {
    if (variants === 'failure') {
      return `
        background: ${theme.color.red};
      `;
    }
    if (variants === 'success') {
      return `
        background: ${theme.color.green};
      `;
    }
    return `
      background: ${theme.isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)'};
    `;
  }};

  ${({ direction, top, slide }) => {
    if (direction === 'bottom') {
      if (slide) {
        // transform : 크기 6.4rem + margin 1.6rem = 8rem
        return `
          bottom: ${top};
          transform: translateY(8rem);
        `;
      }
      return `
        bottom: ${top};
      `;
    }
    if (direction === 'center') {
      // top (calc) : margin-top 값(1.6rem) 계산
      return `
        top: calc(50% - 1.6rem + ${top});
        transform: translateY(-50%);
      `;
    }
    return `
      top: ${top || 0};
    `;
  }}

  &.mounted {
    ${({ direction, top, fadeTime, slide }) => {
      if (direction === 'bottom') {
        if (slide) {
          return `
            bottom: ${top};
            opacity: 1;
            transform: translateY(0);
            transition: transform ${fadeTime}ms ease-out;
          `;
        }
        return `
          bottom: ${top};
          opacity: 1;
        `;
      }
      return `
        opacity: 1;
      `;
    }}
  }

  &.in-active {
    ${({ direction, fadeTime, slide }) => {
      if (direction === 'bottom' && slide) {
        // transform : 크기 6.4rem + margin 1.6rem = 8rem
        return `
          transform: translateY(8rem);
          opacity: 1;
          transition:  transform ${fadeTime / 2}ms ease-in;
        `;
      }
      return `
        opacity: 1;
      `;
    }}
  }

  &.is-ios {
    background: rgba(44, 44, 44, 0.4);
    backdrop-filter: blur(2.5rem);
  }
`;
