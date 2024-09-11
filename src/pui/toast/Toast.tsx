import React, { useEffect, useState, forwardRef } from 'react';
import type { TransitionStatus } from 'react-transition-group';
import classNames from 'classnames';
import styled, { keyframes } from 'styled-components';
import { useToast } from '@hooks/useToast';
import { ToastInner, ToastInnerProps } from './ToastInner';

/** Type */
/** direction type */
export type ToastDirectionType = 'top' | 'center' | 'bottom';
/** variants type */
export type ToastVariantsType = 'base' | 'failure' | 'success';

export interface ToastProps extends ToastInnerProps {
  /**
   * toast 배경 타입
   * @default base
   * @description failure, success는 v1에서 사용하지 않음, 21.12.22
   */
  variants?: ToastVariantsType;

  /**
   * toast 위치
   * @default bottom
   */
  direction?: ToastDirectionType;

  /** 활성화 된 후 자동으로 사라지는 시간, 자동 Remove (ms 기준) @default 3000 */
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
}

export interface ToastComponentProps extends React.HTMLAttributes<HTMLDivElement>, ToastProps {
  transitionState: TransitionStatus;
  toastId: string;
}

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`;

const BaseProps = {
  direction: 'bottom',
  autoDismiss: 3000,
  variants: 'base',
  fadeTime: 250,
  slide: false,
  top: '0px',
} as const;

/**
 * Figma Toast 컴포넌트
 */
const ToastComponent = forwardRef<HTMLDivElement, ToastComponentProps>(
  (
    {
      className,
      direction,
      autoDismiss = BaseProps.autoDismiss,
      variants,
      fadeTime = BaseProps.fadeTime,
      slide,
      top,
      toastId = '',
      transitionState,
      ...props
    },
    ref,
  ) => {
    const { removeToast } = useToast();
    const [active, setActive] = useState(true);
    const [isMount, setIsMount] = useState(false);

    useEffect(() => {
      const handleRemoveToast = () => {
        isMount && setActive(false);
      };

      if (!!autoDismiss && autoDismiss > 0) {
        const disMissTime = fadeTime ? fadeTime + autoDismiss : autoDismiss;
        const timeout = setTimeout(() => {
          handleRemoveToast();
        }, disMissTime);

        return () => {
          clearTimeout(timeout);
        };
      }

      // autoDismiss 가 설정되지 않은 경우에는 클릭시 바로 닫힘
      const $bodyEl = document.body as HTMLBodyElement;
      $bodyEl.addEventListener('click', handleRemoveToast);
      return () => {
        $bodyEl.removeEventListener('click', handleRemoveToast);
      };
    }, [autoDismiss, fadeTime, isMount]);

    useEffect(() => {
      if (!active) {
        setTimeout(() => {
          removeToast(toastId);
        }, fadeTime);
      }
    }, [active, fadeTime, toastId, removeToast]);

    useEffect(() => {
      const timeout = setTimeout(() => {
        setIsMount(true);
      }, 50);

      return () => {
        clearTimeout(timeout);
      };
    }, []);

    return (
      <div
        className={classNames(className, {
          'in-active': !active,
          mounted: isMount,
        })}
        ref={ref}
      >
        <ToastInner {...props} />
      </div>
    );
  },
);

export const Toast = styled(ToastComponent).attrs(({ direction, variants, fadeTime, slide, top }) => {
  return {
    direction: direction ?? BaseProps.direction,
    variants: variants ?? BaseProps.variants,
    fadeTime: fadeTime ?? BaseProps.fadeTime,
    slide: slide ?? BaseProps.slide,
    top: top ?? '0px',
  };
})`
  ${({ theme }) => theme.fixed({ r: 0, l: 0 })};
  margin: ${({ theme }) => theme.spacing.s16};
  border-radius: ${({ theme }) => theme.radius.r8};
  animation: ${fadeIn} linear forwards;
  animation-duration: ${({ fadeTime }) => `${fadeTime}ms`};
  transition: all ${({ fadeTime }) => `${fadeTime}ms`};
  color: ${({ theme }) => theme.color.white};
  ${({ theme }) => theme.mixin.z('toast')};
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
            transform: translateY(0);
            transition: transform ${fadeTime}ms ease-out;
          `;
        }
        return `
          bottom: ${top};
        `;
      }
      return ``;
    }}
  }

  &.in-active {
    animation: ${fadeOut} linear forwards;
    animation-duration: ${({ fadeTime }) => `${fadeTime / 2}ms`};
    ${({ direction, fadeTime, slide }) => {
      if (direction === 'bottom' && slide) {
        // transform : 크기 6.4rem + margin 1.6rem = 8rem
        return `
          transform: translateY(8rem);
          transition: transform ${fadeTime / 2}ms ease-in;
        `;
      }
      return ``;
    }}
  }
`;
