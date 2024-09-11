import React, { useMemo, useState } from 'react';
import { useUpdateEffect } from 'react-use';
import { flushSync } from 'react-dom';
import { v4 as uuid } from 'uuid';
import omit from 'lodash/omit';
import isNumber from 'lodash/isNumber';

type Style = React.CSSProperties;

/**
 * 리턴 타입
 */
export interface UseCollapseReturnType<T extends HTMLElement = HTMLElement> {
  /** 확장여부 */
  isExpanded: boolean;
  /** 확장/축소 setter */
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  /** collapse section에 전달될 props */
  collapseProps: {
    id: string;
    style: Style;
    'aria-hidden': boolean;
    onTransitionEnd: (e: React.TransitionEvent<T>) => void;
  };
  /** collapse section을 제어할 버튼 요소에 적용될 props */
  controllerProps: {
    'aria-controls': string;
    'aria-expanded': boolean;
  };
}

/**
 * Collapse Options
 */
export type UseCollapseOptions = {
  /** 확장 상태 */
  expanded?: boolean;
  /** 최초 확장 상태 */
  defaultExpanded?: boolean;
  /** 축소된 상태에서의 높이값 */
  collapsedHeight?: number;
  /** 축소된 상태에서의 style */
  collapsedStyle?: Style;
  /** 축소된 상태에서의 높이값 */
  expandedHeight?: number;
  /** 확장된 상태에서의 style */
  expandedStyle?: Style;
  /** css easing */
  easing?: string;
  /** 모션 속도 */
  duration?: number;
  /** 모션 딜레이 숫자타입인 경우 ms 단위 */
  delay?: number | string;
  /** 모션 비활성화 여부 */
  disabledAnimation?: boolean;
  /** 축소전 실행할 콜백 함수 */
  onCollapseStart?: () => void;
  /** 축소후 실행할 콜백 함수 */
  onCollapseEnd?: () => void;
  /** 확장전 실행할 콜백 함수 */
  onExpandStart?: () => void;
  /** 확장후 실행할 콜백 함수 */
  onExpandEnd?: () => void;
};

/**
 * Collapse hooks
 * 세로형태의 확장/축소 기능을 제공
 *
 * @TODO - collapse 모션에 대한 style 확장 가능하도록 기능 추가
 */
export const useCollapse = <T extends HTMLElement = HTMLElement>(
  /** collapse section의 ref */
  element: React.RefObject<T>,
  options?: UseCollapseOptions,
): UseCollapseReturnType<T> => {
  const id = useMemo(() => uuid().slice(0, 8), []);
  const collapsedHeight = options?.collapsedHeight || 0;
  const collapsedStyle = {
    overflow: 'hidden',
    height: collapsedHeight,
    display: collapsedHeight === 0 ? 'none' : undefined,
    ...(options?.collapsedStyle || {}),
  };
  const expandedStyle = {
    height: options?.expandedHeight,
    ...(options?.expandedStyle || {}),
  };

  const [isExpanded, setExpanded] = useState<boolean>(options?.expanded || !!options?.defaultExpanded);
  const [style, setStyle] = useState<Style>(isExpanded ? expandedStyle : collapsedStyle);

  /**
   * style 업데이트(적용)
   */
  const updateStyle = (newStyle: Style | ((oldStyle: Style) => Style)): void => {
    flushSync(() => setStyle(newStyle));
  };

  /**
   * style 오버라이딩
   */
  const mergeStyle = (newStyle: Style, omitStyleKey?: Array<keyof Style>): void => {
    updateStyle((oldStyle) => omit({ ...oldStyle, ...newStyle }, omitStyleKey || []));
  };

  /**
   * collapse section의 높이값을 반환
   * (만약, expandedHeight옵션이 있는 경우 expandedHeight을 반환)
   */
  const getElementHeight = (): string | number => {
    return options?.expandedHeight ?? element.current?.scrollHeight ?? 'auto';
  };

  /**
   * 확장/축소 모션 속도값을 반한.
   */
  const getAutoHeightDuration = (height: number | string): number => {
    if (!height || typeof height === 'string') {
      return 0;
    }

    const constant = height / 36;
    return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
  };

  /**
   * css transition value반환
   */
  const getTransitionStyle = (height: number | string): Style => {
    if (options?.disabledAnimation) {
      return {};
    }

    const duration = options?.duration || getAutoHeightDuration(height);
    // eslint-disable-next-line no-nested-ternary
    const delay = options?.delay ? (isNumber(options.delay) ? `${options.delay}ms` : options.delay) : '';

    return {
      transition: `height ${duration}ms ${options?.easing || ''} ${delay}`,
    };
  };

  /**
   * 트랜지션 완료후 실행할 콜백
   */
  const handleTransitionEnd = (e: React.TransitionEvent<T>) => {
    if (e.target !== element.current || e.propertyName !== 'height') {
      return;
    }

    if (isExpanded && style.height === getElementHeight()) {
      updateStyle({
        ...(options?.expandedStyle || {}),
        height: options?.expandedHeight ?? 'auto',
      });

      options?.onExpandEnd?.();
    } else if (style.height === `${collapsedHeight / 10}rem`) {
      updateStyle(collapsedStyle);
      options?.onCollapseEnd?.();
    }
  };

  /**
   * 확장 or 축소 제어
   */
  useUpdateEffect(() => {
    if (isExpanded) {
      window.requestAnimationFrame(() => {
        options?.onExpandStart?.();

        // 확장전 style 초기화
        mergeStyle({ overflow: 'hidden', willChange: 'height' }, ['display']);

        // 확장 적용
        window.requestAnimationFrame(() => {
          const height = getElementHeight();
          mergeStyle({ height, ...getTransitionStyle(height) });
        });
      });
    } else {
      window.requestAnimationFrame(() => {
        options?.onCollapseStart?.();
        const height = getElementHeight();

        // 축소전 style 초기화
        mergeStyle({ height, willChange: 'height', ...getTransitionStyle(height) });

        // 축소 적용
        window.requestAnimationFrame(() => {
          mergeStyle({ overflow: 'hidden', height: `${collapsedHeight / 10}rem` });
        });
      });
    }
  }, [isExpanded, collapsedHeight]);

  /**
   * expanded props가 변경되면 내부의 isExpanded state를 업데이트
   */
  useUpdateEffect(() => {
    setExpanded(!!options?.expanded);
  }, [options?.expanded]);

  return {
    isExpanded,
    setExpanded,
    controllerProps: {
      'aria-controls': id,
      'aria-expanded': isExpanded,
    },
    collapseProps: {
      id,
      style,
      'aria-hidden': !isExpanded,
      onTransitionEnd: handleTransitionEnd,
    },
  };
};
