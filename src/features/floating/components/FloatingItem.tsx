/* eslint-disable @typescript-eslint/no-unused-expressions, react-hooks/exhaustive-deps */
import {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useLayoutEffect,
  useImperativeHandle,
  useContext,
} from 'react';
import styled from 'styled-components';
import reverse from 'lodash/reverse';
import isFunction from 'lodash/isFunction';
import { useUnmount, useMount } from 'react-use';
import { setStyles, setStylesWithStep, getFloatingTransitionValue } from '../utils';
import { FloatingItemType, FloatingItemStateType } from '../types';
import { FloatingRootState, FloatingItemState } from '../constants';
import { FloatingContext } from '../contexts';
import { useTimeout } from '../hooks';

type FloatingItemProps = FloatingItemType & {
  className?: string;
};

const FloatingItemComponent = ({
  id,
  render,
  order,
  defaultVisible,
  className,
  onShown,
  onHidden,
  onAdded,
  onRemoved,
}: FloatingItemProps) => {
  // element refs
  const container = useRef<HTMLDivElement>(null);

  /**
   * Floating context value
   */
  const floating = useContext(FloatingContext);

  /**
   * 모션이 가능한 상태인가?
   */
  const isTransferable = useCallback(() => {
    return floating.rootController.current?.state !== FloatingRootState.hidden;
  }, []);

  /**
   * floating Item show/hide transition value
   */
  const transitionValue = useMemo(() => getFloatingTransitionValue(['transform']), []);

  /**
   * Floating Item 상태
   */
  const [state, setState] = useState<FloatingItemStateType>(
    // eslint-disable-next-line no-nested-ternary
    defaultVisible
      ? isTransferable()
        ? FloatingItemState.showing
        : FloatingItemState.shown
      : FloatingItemState.hidden,
  );

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
  const eventCallback = useRef<{ type: 'show' | 'hide' | 'remove'; action: (done: boolean) => void } | null>(null);

  /**
   * useImperativeHandle를 통해 외부에서 호출될 show/hide/remove 메소드를 만들어 반환
   */
  const createEventCallback = (type: 'show' | 'hide' | 'remove') => (instant?: boolean) =>
    new Promise<boolean>((resolve, reject) => {
      eventCallback.current?.action(false);
      eventCallback.current = { type, action: (done: boolean) => resolve(done) };

      if (type === 'show') {
        setState(FloatingItemState[instant || !isTransferable() ? 'shown' : 'showing']);
        return;
      }
      if (type === 'hide') {
        setState(FloatingItemState[instant || !isTransferable() ? 'hidden' : 'hiding']);
        return;
      }
      if (type === 'remove') {
        instant || !isTransferable() ? floating.del(id) : setState(FloatingItemState.removing);
        return;
      }

      reject(new Error('type error'));
    });

  const dispatchEventCallback = (done: boolean) => {
    if (eventCallback.current) {
      eventCallback.current.action(done);
      eventCallback.current = null;
    }
  };

  /**
   * shown상태의 스타일 설정
   */
  const setShownStyle = () => {
    container.current && setStyles(container.current, { display: '' });
  };

  /**
   * hidden상태의 스타일 설정
   */
  const setHiddenStyle = () => {
    container.current && setStyles(container.current, { display: 'none' });
  };

  /**
   * showing상태의 스타일 설정
   */
  const setShowStyle = () => {
    if (!container.current) return;

    setStylesWithStep(container.current, [
      { display: '', transform: 'translate3d(0px, calc(env(safe-area-inset-bottom) + 250%), 0px)' },
      { transition: transitionValue.show },
      () => {
        let posY = 0;

        reverse([...floating.list]).forEach((item) => {
          const { element, state: itemState } = floating.itemControllers.current.get(item.id) || {};
          const isVisible = itemState === FloatingItemState.shown || itemState === FloatingItemState.showing;

          if (element && isVisible) {
            element.style.transform = `translate3d(0px, -${posY}px, 0px)`;
            posY += element.offsetHeight || 0;
          }
        });

        return {};
      },
    ]);
  };

  /**
   * hiding상태의 스타일 설정
   */
  const setHideStyle = () => {
    if (!container.current) return;

    setStylesWithStep(container.current, [
      { transition: transitionValue.hide },
      () => {
        let posY = 0;

        reverse([...floating.list]).forEach((item) => {
          const { element, state: itemState } = floating.itemControllers.current.get(item.id) || {};
          const isVisible = itemState === FloatingItemState.shown || itemState === FloatingItemState.showing;

          if (element && isVisible) {
            element.style.transform = `translate3d(0px, -${posY}px, 0px)`;
            posY += element.offsetHeight || 0;
          }
        });

        return { display: '', transform: 'translate3d(0px, calc(env(safe-area-inset-bottom) + 250%), 0px)' };
      },
    ]);
  };

  /**
   * Transition이 끝나고 실행할 이벤트 핸들러
   */
  const handleTransitionEnd = (e: React.TransitionEvent) => {
    // 버블링, 캡처링에 의한 잘못된 이벤트 실행 방지
    if (e.target !== container.current || e.propertyName !== 'transform') {
      return;
    }

    if (state === FloatingItemState.showing) {
      setState(FloatingItemState.shown);
      return;
    }

    if (state === FloatingItemState.hiding) {
      setState(FloatingItemState.hidden);
      return;
    }

    if (state === FloatingItemState.removing) {
      floating.del(id);
    }
  };

  /**
   * 최초 렌더링시 DOM Style 초기화
   */
  useLayoutEffect(() => {
    container.current &&
      setStyles(container.current, { transform: 'translate3d(0px, calc(env(safe-area-inset-bottom) + 250%), 0px)' });
  }, []);

  /**
   * state 변경에 따른 style 적용
   */
  useEffect(() => {
    timer.clear();

    if (state === FloatingItemState.shown) {
      timer.set(() => {
        dispatchEventCallback(isTransferable() && eventCallback.current?.type === 'show');
        setShownStyle();
        onShown?.();
      }, 500);
      return;
    }

    if (state === FloatingItemState.hidden) {
      timer.set(() => {
        dispatchEventCallback(eventCallback.current?.type === 'hide');
        setHiddenStyle();
        onHidden?.();
      }, 500);
      return;
    }

    if (state === FloatingItemState.showing) {
      isTransferable() ? setShowStyle() : setState(FloatingItemState.shown);
      return;
    }

    if (state === FloatingItemState.hiding) {
      isTransferable() ? setHideStyle() : setState(FloatingItemState.hidden);
      return;
    }

    if (state === FloatingItemState.removing) {
      isTransferable() ? setHideStyle() : floating.del(id);
    }
  }, [state]);

  useImperativeHandle({ current: new Map() }, () => {
    return floating.itemControllers.current?.set(id, {
      element: container.current as HTMLDivElement,
      state,
      show: createEventCallback('show'),
      hide: createEventCallback('hide'),
      remove: createEventCallback('remove'),
    });
  });

  useMount(() => onAdded?.());

  useUnmount(() => {
    timer.clear();
    onRemoved?.();
    dispatchEventCallback(eventCallback.current?.type === 'remove');
  });

  return (
    <div
      ref={container}
      data-id={id}
      data-state={state}
      data-order={order}
      className={className}
      onTransitionEnd={handleTransitionEnd}
    >
      {isFunction(render) ? render({ id, order, state }) : render}
    </div>
  );
};

/**
 * FloatingItem
 */
export const FloatingItem = styled(FloatingItemComponent)`
  ${({ theme }) => theme.mixin.absolute({ b: 0, l: 0, r: 0 })};
  box-sizing: border-box;
  width: 100%;
  padding: 1.2rem 0;
`;
