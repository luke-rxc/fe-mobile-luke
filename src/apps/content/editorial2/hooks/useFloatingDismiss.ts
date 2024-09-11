import { useCallback, useRef, useEffect } from 'react';

type PositionType = {
  x: number;
  y: number;
};
export const DirectionType = {
  DOWN: 'DOWN',
  UP: 'UP',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DirectionType = typeof DirectionType[keyof typeof DirectionType];

export const useFloatingDismiss = ({
  dismissDirection = DirectionType.DOWN,
  allowedTime = 200,
  threshold,
  usableTransition = true,
  transition,
  transitionTime = 300,
  transitionDistance = 300,
  removeElement = false,
  onTriggerDismiss,
  onAnimationEndDismiss,
}: {
  /** dismiss 처리 방향 */
  dismissDirection?: DirectionType;
  /** 터치무브 허용시간 ms */
  allowedTime?: number;
  /** dismiss를 허용할 distance 수치, 화면 dismiss 방향 움직임 기준 화면사이즈  [0 ~ 100]% 단위 */
  threshold?: number;
  /** 트랜지션 사용여부 */
  usableTransition?: boolean;
  /** 트랜지션 */
  transition?: string;
  /** 트랜지션 타임 ms */
  transitionTime?: number;
  /** 트랜지션시 이동 위치 % */
  transitionDistance?: number;
  /** 트랜지션 완료후 노드 삭제 여부 */
  removeElement?: boolean;
  /** complete Callback */
  onTriggerDismiss?: () => void;
  /** complete Animation End Callback */
  onAnimationEndDismiss?: () => void;
}) => {
  const elRef = useRef<HTMLElement | null>(null);
  const isDismissAble = useRef<boolean>(true);
  const startPosition = useRef<PositionType>({ x: 0, y: 0 });
  const prevPosition = useRef<PositionType>({ x: 0, y: 0 });
  const startTime = useRef<number>(0);
  const transitionValue = transition ?? `transform ${transitionTime}ms ease-in-out`;

  /**
   * 터치 position 조회
   */
  const handleGetPosition = useCallback((e: TouchEvent): PositionType => {
    if (e.touches && e.touches.length) {
      return {
        x: e.touches[0].pageX,
        y: e.touches[0].pageY,
      };
    }
    if (e.changedTouches && e.changedTouches.length) {
      return {
        x: e.changedTouches[0].pageX,
        y: e.changedTouches[0].pageY,
      };
    }

    return {
      x: 0,
      y: 0,
    };
  }, []);

  const addEvents = useCallback((el: HTMLElement) => {
    el.addEventListener('touchstart', handlerTouchAction, { passive: true });
    el.addEventListener('touchmove', handlerTouchAction, { passive: false });
    el.addEventListener('touchcancel', handlerTouchAction, { passive: true });
    el.addEventListener('touchend', handlerTouchAction, { passive: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeEvents = useCallback((el: HTMLElement) => {
    el.removeEventListener('touchstart', handlerTouchAction);
    el.removeEventListener('touchmove', handlerTouchAction);
    el.removeEventListener('touchcancel', handlerTouchAction);
    el.removeEventListener('touchend', handlerTouchAction);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlerTouchAction = useCallback(
    (e: TouchEvent) => {
      const currentPos = handleGetPosition(e);
      const startPos = startPosition.current;
      const prevPos = prevPosition.current;

      switch (e.type) {
        case 'touchstart':
          startPosition.current = currentPos;
          prevPosition.current = currentPos;
          startTime.current = new Date().getTime();
          break;
        case 'touchmove':
          if (e.cancelable) e.preventDefault();
          if (isDismissAble.current) {
            const diffX = currentPos.x - prevPos.x;
            const diffY = currentPos.y - prevPos.y;
            let direction: DirectionType;
            if (Math.abs(diffY) > Math.abs(diffX)) {
              direction = diffY > 0 ? DirectionType.DOWN : DirectionType.UP;
            } else {
              direction = diffX > 0 ? DirectionType.RIGHT : DirectionType.LEFT;
            }

            // 방향이 달라질 경우, dismiss 처리 불가
            if (direction !== dismissDirection) {
              isDismissAble.current = false;
              return;
            }

            // 터치 허용시간보다 길어질 경우, dismiss 처리 불가
            const elapsedTime = new Date().getTime() - startTime.current;
            if (allowedTime < elapsedTime) {
              isDismissAble.current = false;
              return;
            }
            const isVertical = direction === DirectionType.DOWN || direction === DirectionType.UP;
            const distance = isVertical ? currentPos.y - startPos.y : currentPos.x - startPos.x;
            const dragRatio = (Math.abs(distance) / (isVertical ? window.innerHeight : window.innerWidth)) * 100;

            const thresholdValue = threshold || (isVertical ? 4 : 25);
            if (dragRatio > thresholdValue) {
              isDismissAble.current = false;
              const $targetEl = elRef.current as HTMLElement;
              $targetEl.style.transition = transitionValue;

              if (usableTransition) {
                const targetPosition =
                  transitionDistance * (direction === DirectionType.DOWN || direction === DirectionType.RIGHT ? 1 : -1);
                $targetEl.style.transform = `${
                  isVertical ? `translate3d(0, ${targetPosition}%, 0)` : `translate3d(${targetPosition}%,0, 0)`
                }`;
              }
              onTriggerDismiss?.();
              if (onAnimationEndDismiss) {
                setTimeout(onAnimationEndDismiss, transitionTime);
              }

              if (removeElement) {
                setTimeout(() => {
                  removeEvents($targetEl);
                  $targetEl.remove();
                  elRef.current = null;
                }, transitionTime);
              }
            }

            prevPosition.current = currentPos;
          }

          break;
        case 'touchend':
        case 'touchcancel':
          // 초기화
          isDismissAble.current = true;
          prevPosition.current = { x: 0, y: 0 };
          startPosition.current = { x: 0, y: 0 };
          break;
        default:
          break;
      }
    },
    [
      allowedTime,
      dismissDirection,
      handleGetPosition,
      onAnimationEndDismiss,
      onTriggerDismiss,
      removeElement,
      removeEvents,
      threshold,
      transitionDistance,
      transitionTime,
      transitionValue,
      usableTransition,
    ],
  );

  const snackbarRef = useCallback(
    (snackbarEl: HTMLDivElement) => {
      if (snackbarEl) {
        elRef.current = snackbarEl;
        addEvents(snackbarEl);
      }
    },
    [addEvents],
  );

  useEffect(() => {
    return () => {
      if (elRef.current) {
        removeEvents(elRef.current);
      }
    };
  }, [removeEvents]);

  return {
    snackbarRef,
  };
};
