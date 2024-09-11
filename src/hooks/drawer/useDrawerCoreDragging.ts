/**
 * Drawer dragging hook
 * @description '@component/drawer/Drawer.tsx' 내에서만 사용(다른 곳에서 사용 불가)
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { linearEquation } from '@utils/linearEquation';
import { WebHeaderHeight } from '@constants/ui';
import { useWebInterface } from '@hooks/useWebInterface';
import { DraggingCloseConfirmProps } from '@pui/drawer';

interface Props {
  contentRef: React.RefObject<HTMLElement>;
  backDropRef: React.RefObject<HTMLElement>;
  draggingRef: React.RefObject<HTMLElement>;
  dragging: boolean;
  backDropOpacity?: number;
  open: boolean;
  closePercent: number;
  layoutHeaderHeight: number;
  expandView?: boolean;
  initPosition?: number;
  fullHeight: boolean;
  closeConfirm?: DraggingCloseConfirmProps;
}

const getPositionY = (evt: TouchEvent) => {
  return evt.touches[0].clientY;
};

/** @deprecated */
export const useDrawerCoreDragging = ({
  contentRef,
  backDropRef,
  draggingRef,
  dragging,
  backDropOpacity = 0.4,
  open,
  closePercent,
  layoutHeaderHeight,
  expandView = false,
  initPosition = 0,
  fullHeight,
  closeConfirm,
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
  const prevContentWrapperHeight = useRef<number | null>(null);
  const contentWrapperHeight = useRef<number | null>(null);

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

  const [isCloseConfirm, setIsCloseConfirm] = useState(false);
  const { confirm } = useWebInterface();

  const moveToContentWrapper = useCallback((isMove: boolean, targetPositionY = 0) => {
    if (contentRef.current) {
      const $el = contentRef.current;
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

  const getCurrentTranslate = () => {
    return currentTranslate.current > 0 ? currentTranslate.current : 0;
  };

  const handleEnd = () => {
    if (expandView) {
      const currentTransPosY = getCurrentTranslate();
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
      const currentTransPosY = getCurrentTranslate();
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

      const currentTransPosY = getCurrentTranslate();
      const percent = Math.floor(linearEquation(currentTransPosY, 0, refWrapperHeight.current, 0, 100));

      if (!!closeConfirm && percent > 10) {
        setIsCloseConfirm(true);
        draggingRef.current && draggingRef.current.removeEventListener('touchmove', handleMove);
      }
    }
  };

  useEffect(() => {
    if (isCloseConfirm) {
      handleConfirm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCloseConfirm]);

  const handleConfirm = async () => {
    const confirmTitle = closeConfirm?.title || closeConfirm?.message || '';
    const confirmMsg = closeConfirm?.title ? closeConfirm?.message : undefined;

    const result = await confirm({ title: confirmTitle, message: confirmMsg });

    if (result) {
      !closeConfirm?.disableForceClose && setToClose(true);
      closeConfirm?.cb?.();
    } else {
      setIsCloseConfirm(false);
      draggingRef.current && draggingRef.current.addEventListener('touchmove', handleMove);
    }
  };

  const removeHandler = () => {
    if (draggingRef.current && dragging) {
      draggingRef.current.removeEventListener('touchstart', handleStart);
      draggingRef.current.removeEventListener('touchend', handleEnd);
      draggingRef.current.removeEventListener('touchcancel', handleCancel);
      draggingRef.current.removeEventListener('touchmove', handleMove);
    }
  };

  const addHandler = () => {
    if (draggingRef.current && dragging) {
      draggingRef.current.addEventListener('touchstart', handleStart);
      draggingRef.current.addEventListener('touchend', handleEnd);
      draggingRef.current.addEventListener('touchcancel', handleCancel);
      draggingRef.current.addEventListener('touchmove', handleMove);
    }
  };

  const setInitialPosition = () => {
    // Setting : Dragging
    if (contentRef.current && backDropRef.current) {
      // 초기값 설정
      innerHeightPos.current = window.innerHeight;
      const $contentWrapperEl = contentRef.current;
      const maxWrapperHeight = innerHeightPos.current - layoutHeaderHeight;

      const contentHeight = innerHeightPos.current - WebHeaderHeight;

      if (contentWrapperHeight.current === null) {
        contentWrapperHeight.current = $contentWrapperEl.offsetHeight;
      }

      /* console.log('Window 최상단 크기에서 높이값', contentHeight);
      console.log('$contentWrapperEl.offsetHeight', $contentWrapperEl.offsetHeight);
      console.log('컨텐츠 원래 크기값', contentWrapperHeight.current);
      console.log('현재 prevContentWrapperHeight.current', prevContentWrapperHeight.current); */

      if (contentWrapperHeight.current > maxWrapperHeight || expandView || fullHeight) {
        /**
         * 컨텐츠 height가 전체 height보다 클 경우 상단여백을 제외한 height를 지정
         * @author luke@rxc.co.kr (22.01.24)
         */
        $contentWrapperEl.style.height = `${contentHeight}px`;

        // Content Height 변경 부분 저장
        prevContentWrapperHeight.current = contentHeight;
      } else if (prevContentWrapperHeight.current !== null) {
        const backContentWrapperHeight = Math.max(prevContentWrapperHeight.current, contentWrapperHeight.current);

        // Content Height 변경 부분이 있다면 재계산
        $contentWrapperEl.style.height = `${backContentWrapperHeight}px`;
        prevContentWrapperHeight.current = null;
      } else {
        prevContentWrapperHeight.current = $contentWrapperEl.offsetHeight;
      }

      refWrapperHeight.current = $contentWrapperEl.offsetHeight;
      refPos.current = innerHeightPos.current - refWrapperHeight.current;
    }
  };

  /**
   * @issue ios safari 주소 하단창의 Resize 이슈 대응
   */
  const setVh = useCallback(() => {
    vhRef.current = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vhRef.current}px`);

    // removeHandler();
    open && setInitialPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // dragging
  useEffect(() => {
    if (!open) {
      setToClose(false);
      setIsCloseConfirm(false);
      removeHandler();
      if (prevContentWrapperHeight.current !== null) {
        prevContentWrapperHeight.current = null;
      }
      return;
    }
    setInitialPosition();
    addHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (open) {
      if (isDragging && positionY) {
        moveToContentWrapper(true, positionY);
      } else {
        !expandView && moveToContentWrapper(false);
      }
    } else {
      moveToContentWrapper(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isDragging, positionY]);

  useEffect(() => {
    if (toClose) {
      moveToContentWrapper(false);
    }
  }, [toClose, moveToContentWrapper]);

  useEffect(() => {
    window.addEventListener('resize', setVh);

    return () => {
      window.removeEventListener('resize', setVh);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    setVh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    positionY,
    isDragging,
    toClose,
    setPositionY,
  };
};
