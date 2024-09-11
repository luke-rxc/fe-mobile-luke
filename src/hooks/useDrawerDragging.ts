/**
 * Drawer dragging hook
 * @description '@component/drawer/Drawer.tsx' 내에서만 사용(다른 곳에서 사용 불가)
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { linearEquation } from '@utils/linearEquation';
import { WebHeaderHeight } from '@constants/ui';

interface Props {
  contentWrapperRef: React.RefObject<HTMLElement>;
  backDropRef: React.RefObject<HTMLElement>;
  draggingRef: React.RefObject<HTMLElement>;
  dragging: boolean;
  direction: 'top' | 'right' | 'bottom' | 'left';
  backDropOpacity?: number;
  isOpen: boolean;
  closePercent: number;
  layoutHeaderHeight: number;
  expandView?: boolean;
  initPosition?: number;
  resize?: boolean;
}

const getPositionY = (evt: TouchEvent) => {
  return evt.touches[0].clientY;
};

export const useDrawerDragging = ({
  contentWrapperRef,
  backDropRef,
  draggingRef,
  dragging,
  direction,
  backDropOpacity = 1,
  isOpen,
  closePercent,
  layoutHeaderHeight,
  expandView = false,
  initPosition = 0,
  resize = false,
}: Props) => {
  /**
   * Touch 진행시 저장하기 위한 Ref
   */
  const startPosition = useRef(initPosition);
  const currentTranslate = useRef(initPosition);
  const prevTranslate = useRef(initPosition);

  /**
   * 초기 Element의 위치를 저장하기 위한 Ref
   */
  /** Drawer Drag Element의 초기 위치 */
  const refPos = useRef(0);
  /** Window 의 inner Height */
  const innerHeightPos = useRef(0);
  /** Drawer Wrapper 의 전체 Height */
  const refWrapperHeight = useRef(0);
  /** resize시 --vh 스타일 설정 (resize prop 이 true 인 경우) */
  const vhRef = useRef(0);

  /**
   * State
   */
  const [positionY, setPositionY] = useState(initPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [toClose, setToClose] = useState(false);

  const moveToContentWrapper = useCallback((isMove: boolean, targetPositionY = 0) => {
    if (contentWrapperRef.current) {
      const $el = contentWrapperRef.current;
      if (isMove) {
        $el.style.transform = `translateY(${targetPositionY}px)`;
        $el.style.transition = 'none';
      } else {
        $el.style.transition = '';
        $el.style.transform = '';
      }
    }

    if (backDropRef.current) {
      const $el = backDropRef.current;
      const opacityValue = linearEquation(
        targetPositionY,
        refPos.current,
        refPos.current + refWrapperHeight.current,
        backDropOpacity,
        0,
      );

      if (isMove) {
        $el.style.opacity = `${opacityValue}`;
        $el.style.transition = 'none';
      } else {
        $el.style.opacity = '';
        $el.style.transition = '';
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStart = (evt: TouchEvent) => {
    evt.preventDefault();
    startPosition.current = getPositionY(evt);
    setIsDragging(true);
    if (expandView) {
      prevTranslate.current = startPosition.current;
      setPositionY(startPosition.current);
    } else {
      setPositionY(refPos.current);
    }
  };

  const handleEnd = () => {
    if (expandView) {
      const currentTransPosY = currentTranslate.current > 0 ? currentTranslate.current : 0;
      setIsDragging(false);
      const percent = 100 - (currentTransPosY / window.innerHeight) * 100;

      if (percent < closePercent) {
        setToClose(true);
        // ref 초기화
        currentTranslate.current = initPosition;
        prevTranslate.current = initPosition;
        startPosition.current = initPosition;
        setPositionY(initPosition);
      }
    } else {
      const currentTransPosY = currentTranslate.current > 0 ? currentTranslate.current : 0;
      const percent = Math.floor(linearEquation(currentTransPosY, 0, refWrapperHeight.current, 0, 100));
      if (percent > closePercent) {
        setToClose(true);
      }
      setIsDragging(false);

      // ref 초기화
      currentTranslate.current = 0;
      prevTranslate.current = 0;
      startPosition.current = 0;
    }
  };

  const handleCancel = () => {
    setIsDragging(false);
  };

  const handleMove = (evt: TouchEvent) => {
    evt.preventDefault();
    if (expandView) {
      const currentPosition = getPositionY(evt);
      currentTranslate.current = prevTranslate.current + currentPosition - startPosition.current;
      const result = Math.max(Math.min(currentTranslate.current, window.innerHeight), WebHeaderHeight);
      setPositionY(result);
    } else {
      const currentPosition = getPositionY(evt);
      currentTranslate.current = prevTranslate.current + currentPosition - startPosition.current;
      const movedBy = currentTranslate.current - prevTranslate.current;
      const result = Math.floor(
        linearEquation(movedBy, 0, refWrapperHeight.current, refPos.current, refPos.current + refWrapperHeight.current),
      );
      setPositionY(result);
    }
  };

  const removeHandler = () => {
    if (draggingRef.current && dragging && direction === 'bottom') {
      draggingRef.current.removeEventListener('touchstart', handleStart);
      draggingRef.current.removeEventListener('touchend', handleEnd);
      draggingRef.current.removeEventListener('touchcancel', handleCancel);
      draggingRef.current.removeEventListener('touchmove', handleMove);
    }
  };

  const addHandler = () => {
    // direction 이 bottom 인 경우에만 dragging 모드 작동
    if (draggingRef.current && dragging && direction === 'bottom') {
      draggingRef.current.addEventListener('touchstart', handleStart);
      draggingRef.current.addEventListener('touchend', handleEnd);
      draggingRef.current.addEventListener('touchcancel', handleCancel);
      draggingRef.current.addEventListener('touchmove', handleMove);
    }
  };

  const setInitialPosition = () => {
    // 초기값 설정
    if (draggingRef.current && contentWrapperRef.current && backDropRef.current) {
      innerHeightPos.current = window.innerHeight;
      const $contentWrapperEl = contentWrapperRef.current;
      const maxWrapperHeight = innerHeightPos.current - layoutHeaderHeight;
      if ($contentWrapperEl.offsetHeight > maxWrapperHeight || expandView) {
        /**
         * 컨텐츠 height가 전체 height보다 클 경우 상단여백을 제외한 height를 지정
         * @author luke@rxc.co.kr (22.01.24)
         */
        $contentWrapperEl.style.height = `${innerHeightPos.current - WebHeaderHeight}px`;
      }

      refWrapperHeight.current = $contentWrapperEl.offsetHeight;
      refPos.current = innerHeightPos.current - refWrapperHeight.current;
    }
  };

  // dragging
  useEffect(() => {
    setInitialPosition();

    if (!isOpen) {
      setToClose(false);
      removeHandler();
      return;
    }
    addHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (isDragging && positionY) {
        moveToContentWrapper(true, positionY);
      } else {
        !expandView && moveToContentWrapper(false);
      }
    } else {
      moveToContentWrapper(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isDragging, positionY]);

  useEffect(() => {
    if (toClose) {
      moveToContentWrapper(false);
    }
  }, [toClose, moveToContentWrapper]);

  useEffect(() => {
    /**
     * @issue ios safari 주소 하단창의 Resize 이슈 대응
     */
    const setVh = () => {
      vhRef.current = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vhRef.current}px`);

      // removeHandler();
      setInitialPosition();
    };
    if (resize) {
      window.addEventListener('resize', setVh);
      setVh();
    }

    return () => {
      resize && window.removeEventListener('resize', setVh);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    positionY,
    isDragging,
    toClose,
    setPositionY,
  };
};
