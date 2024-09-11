/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unused-expressions, react-hooks/exhaustive-deps */
import React, { useRef, useState, useMemo, useEffect, useContext, useLayoutEffect, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';
import { useMountedState, useUnmount } from 'react-use';
import styled from 'styled-components';
import classnames from 'classnames';
import { useWebInterface } from '@hooks/useWebInterface';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { setStyles, setStylesWithStep, getFloatingTransitionValue, getSyncBottomTransitionValue } from '../utils';
import { FloatingRootStateType } from '../types';
import { FloatingRootState } from '../constants';
import { FloatingContext } from '../contexts';
import { useTimeout } from '../hooks';
import { FloatingItem } from './FloatingItem';

/**
 * FloatingPortal
 */
const FloatingPortal: React.FC = ({ children }) => {
  const root = useMemo(() => {
    return document.querySelector('#floating') as HTMLElement;
  }, []);

  useEffect(() => {
    !root && window.console.error('<div id="floating" />가 없습니다');
  }, []);

  return root && createPortal(children, root);
};

/**
 * FloatingRootComponent
 */
const FloatingRootComponent: React.FC<{ className?: string }> = ({ className }) => {
  // callWeb interface & device info
  const { isAndroid, isApp } = useDeviceDetect();
  const { bottomSafeAreaUpdatedValue } = useWebInterface();

  // 마운트 상태 체크 (componentDidMount를 체크하기 위한 hook)
  const isMounted = useMountedState();

  // element refs
  const container = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  /**
   * floating context value
   */
  const floating = useContext(FloatingContext);

  /**
   * FloatingRoot 상태
   */
  const [state, setState] = useState<FloatingRootStateType>(FloatingRootState.shown);

  /**
   * style 적용시 딜레이가 필요한 케이스를 위한 유틸성 setTimeout hooks
   */
  const timer = useTimeout();

  /**
   * promise의 resolve를 호출하기 위한 ref
   *
   * useImperativeHandle를 통해 외부에서 호출되는 show/hide/clear의 모션이 끝난시점에
   * 결과를 받을 수 있도록 promise의 resolve를 저장함
   */
  const eventCallback = useRef<{ type: 'show' | 'hide' | 'clear'; action: (done: boolean) => void } | null>(null);

  /**
   * useImperativeHandle를 통해 외부에서 호출될 show/hide/clear 메소드를 만들어 반환
   */
  const createEventCallback = (type: 'show' | 'hide' | 'clear') => (instant?: boolean) =>
    new Promise<boolean>((resolve, reject) => {
      eventCallback.current?.action(false);
      eventCallback.current = { type, action: (done: boolean) => resolve(done) };

      if (type === 'show') {
        setState(FloatingRootState[instant ? 'shown' : 'showing']);
        return;
      }
      if (type === 'hide') {
        setState(FloatingRootState[instant ? 'hidden' : 'hiding']);
        return;
      }
      if (type === 'clear') {
        instant ? floating.clear() : setState(FloatingRootState.clearing);
        return;
      }

      reject(new Error('type error'));
    });

  /**
   * PromiseControlEvent이벤트 호출
   */
  const dispatchEventCallback = (done: boolean) => {
    if (eventCallback.current) {
      eventCallback.current.action(done);
      eventCallback.current = null;
    }
  };

  /**
   * 모션이 끝나고 실행할 이벤트 핸들러
   */
  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== content.current || e.propertyName !== 'opacity') {
      return;
    }

    if (state === FloatingRootState.showing) {
      setState(FloatingRootState.shown);
    }

    if (state === FloatingRootState.hiding) {
      setState(FloatingRootState.hidden);
    }

    if (state === FloatingRootState.clearing) {
      floating.clear(); // 실제 데이터 삭제
      setState(FloatingRootState.shown);
      dispatchEventCallback(eventCallback.current?.type === 'clear');
    }
  };

  /**
   * Floating Root의 bottom 위치를 조정
   */
  const updateFloatingRootPosition = (posY: number, isAnimated: boolean) => {
    const containerEl = container.current;
    const { show, hide } = getSyncBottomTransitionValue(['transform']);

    if (containerEl) {
      setStyles(containerEl, {
        transform: `translate3d(0, -${posY}px, 0)`,
        transition: isAnimated ? (posY ? show : hide) : '',
      });
    }
  };

  /**
   * ios와 aos간의 구현 차이가 있어 aos의 경우 별도의 callWeb을 이용하여
   * bottomBar(하단 글로벌 네비게이션바)의 show/hide에 따라 Floating Root의
   * 위치를 조정
   */
  useLayoutEffect(() => {
    if (!isApp || !isAndroid || !bottomSafeAreaUpdatedValue || !container.current) {
      return;
    }

    updateFloatingRootPosition(
      bottomSafeAreaUpdatedValue.inset,
      // mount시에만 isAnimated와 상관없이 모션 적용 X
      isMounted() && bottomSafeAreaUpdatedValue.isAnimated,
    );
  }, [bottomSafeAreaUpdatedValue]);

  /**
   * 변경된 state에 따른 모션등의 스타일 적용
   */
  useEffect(() => {
    const contentEl = content.current;

    // element 참조 불가시 바로 종료
    if (!contentEl) return;

    // shown, hidden에서 실행한 setTimeout 제거
    timer.clear();

    // shown
    if (state === FloatingRootState.shown) {
      timer.set(() => {
        dispatchEventCallback(eventCallback.current?.type === 'show');
        setStyles(contentEl, { display: '', opacity: '', transform: '', transition: '' });
      }, 500);
      return;
    }

    // showing
    if (state === FloatingRootState.showing) {
      setStylesWithStep(contentEl, [
        { display: '', opacity: '0', transform: 'translate3d(0, 5rem, 0)' },
        { transition: getFloatingTransitionValue(['transform', 'opacity']).show },
        { transform: 'translate3d(0, 0, 0)', opacity: '1' },
      ]);
      return;
    }

    // hidden
    if (state === FloatingRootState.hidden) {
      timer.set(() => {
        dispatchEventCallback(eventCallback.current?.type === 'hide');
        setStyles(contentEl, { display: 'none', opacity: '', transform: '', transition: '' });
      }, 500);
      return;
    }

    // hiding or clearing
    setStylesWithStep(contentEl, [
      { display: '', opacity: '1', transform: 'translate3d(0, 0, 0)' },
      { transition: getFloatingTransitionValue(['transform', 'opacity']).hide },
      { transform: 'translate3d(0, 5rem, 0)', opacity: '0' },
    ]);
  }, [state]);

  useImperativeHandle(floating.rootController, () => ({
    state,
    show: createEventCallback('show'),
    hide: createEventCallback('hide'),
    clear: createEventCallback('clear'),
  }));

  useUnmount(() => timer.clear());

  return (
    <FloatingPortal>
      <div ref={container} className={classnames(className, { 'is-ios': isApp && !isAndroid })}>
        <div ref={content} className="floating-list" onTransitionEnd={handleTransitionEnd}>
          {floating.list.map((item) => (
            <FloatingItem key={item.id} {...item} />
          ))}
        </div>
      </div>
    </FloatingPortal>
  );
};

/**
 * FloatingRoot
 */
export const FloatingRoot = styled(FloatingRootComponent)`
  ${({ theme }) => theme.mixin.fixed({ b: 'env(safe-area-inset-bottom)', l: 0, r: 0 })};
  ${({ theme }) => theme.mixin.z('floating', -1)};

  &.is-ios {
    transition: ${getSyncBottomTransitionValue(['bottom']).show};
  }

  .floating-list {
    ${({ theme }) => theme.mixin.absolute({ b: 0, l: 0, r: 0 })};
    margin: 0.4rem 1.6rem;
  }
`;
