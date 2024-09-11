/**
 * Drawer dragging hook
 * @description '@component/drawer/Drawer.tsx' 내에서만 사용(다른 곳에서 사용 불가)
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { linearEquation } from '@utils/linearEquation';
import { WebHeaderHeight } from '@constants/ui';
import { useWebInterface } from '@hooks/useWebInterface';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useTouchTap } from '@hooks/useTouchTap';
import { DraggingCloseConfirmProps, DrawerProps, DrawerDefault } from '@pui/drawer/v2';

interface Props {
  contentRef: React.RefObject<HTMLElement>;
  contentInnerRef: React.RefObject<HTMLElement>;
  backDropRef: React.RefObject<HTMLElement>;
  draggingRef: React.RefObject<HTMLElement>;
  dragging: boolean;
  open: boolean;
  closePercent: number;
  layoutHeaderHeight: number;
  expandView?: boolean;
  to?: string;
  snapTopPercent?: number;
  initPosition?: number;
  fullHeight: boolean;
  closeConfirm?: DraggingCloseConfirmProps;
  backDropProps?: DrawerProps['backDropProps'];
  onClose: DrawerProps['onClose'];
}

const getPositionY = (evt: TouchEvent) => {
  return evt.touches[0].clientY;
};

export const useDrawerCoreDragging = ({
  contentRef,
  contentInnerRef,
  backDropRef,
  draggingRef,
  dragging,
  backDropProps,
  open,
  closePercent,
  layoutHeaderHeight,
  expandView = false,
  to = '0%',
  snapTopPercent = 85,
  initPosition = 0,
  fullHeight,
  closeConfirm,
  onClose: handleClose,
}: Props) => {
  const { isIOSSafari } = useDeviceDetect();
  const { addTapEvent, removeTapEvent } = useTouchTap();
  const backDropOpacity = backDropProps?.opacity ?? DrawerDefault.backDropProps.opacity;
  /** ***********************************
   * Touch 진행시 저장하기 위한 Ref
   ************************************* */
  // Drawer 의 Drag를 시작할때의 위치
  const startPosition = useRef(initPosition);
  // 현재 Drawer 위치
  const currentTranslate = useRef(initPosition);
  // 이전 Drawer 위치
  const prevTranslate = useRef(initPosition);

  /** ***********************************
   * contentRef
   ************************************* */
  // contentRef의 현재 TransformY(%)
  const currentContentPercent = useRef(initPosition);
  // contentRef의 초기 크기
  const currentContentHeight = useRef<number | null>(null);

  /** ***********************************
   * 초기 Element의 위치를 저장하기 위한 Ref
   ************************************* */
  // Drawer Element의 위치
  const refPos = useRef(0);

  // Drawer Wrapper 의 전체 Height
  const refWrapperHeight = useRef(0);

  /** ***********************************
   * State
   ************************************* */
  // 현재의 Position 값
  const [positionY, setPositionY] = useState(initPosition);
  // Drag 여부
  const [isDragging, setIsDragging] = useState(false);
  // Drawer Close 여부
  const [toClose, setToClose] = useState(false);
  // Close 시의 Confirm 활성화 여부
  const [isCloseConfirm, setIsCloseConfirm] = useState(false);
  // Content 내부의 ScrollTop 값
  const [innerScrollY, setInnerScrollY] = useState(0);

  // expandView인 경우 드래깅에 따른 snap 방향
  const snapDirection = useRef<string>('');
  /** resize시 --vh 스타일 설정 (resize prop 이 true 인 경우) */
  const vhRef = useRef(0);

  /** closeConfirm 실행 조건 */
  const closeConfirmCondition = useRef<boolean>(true);
  /** backDropProps.disabledBackDropClose ref */
  const disableBackDropCloseRef = useRef<boolean>(false);

  const { confirm } = useWebInterface();

  /** Drawer 초기화, Open시 실행 */
  const resetDrawer = () => {
    refPos.current = 0;
    startPosition.current = initPosition;
    currentTranslate.current = initPosition;
    prevTranslate.current = initPosition;
    updateContentHeight({
      top: '',
      maxHeight: '',
    });
    setPositionY(initPosition);
    setInnerScrollY(0);
  };

  /** Handler */
  const handleBackDrop = () => {
    backDropProps?.onBackDropClick?.();
    return disableBackDropCloseRef.current ? null : handleClose();
  };

  const moveToContentWrapper = useCallback((currentDragging: boolean, targetPositionY = 0) => {
    if (contentRef.current && refPos.current) {
      const $el = contentRef.current;
      if (currentDragging) {
        /**
         * 크기 Boundary (refPos.current ~ refPos.current + refWrapperHeight.current)
         * - 일반 모드 : not expandView 활성화된 위치 ~ 총 Drawer 크기
         * - expandView 모드 : 56(헤더높이) ~ 총 Drawer 크기
         */
        const result = linearEquation(
          targetPositionY,
          refPos.current,
          refPos.current + refWrapperHeight.current,
          0,
          100,
        );

        /** 현재의 컨텐츠 위치를 저장 */
        currentContentPercent.current = result;
        $el.style.transform = `translateY(${result}%)`;
        $el.style.transition = 'none';
      } else {
        if (targetPositionY) {
          const result = linearEquation(
            targetPositionY,
            refPos.current,
            refPos.current + refWrapperHeight.current,
            0,
            100,
          );

          /** 현재의 컨텐츠 위치를 저장 */
          currentContentPercent.current = result;
          $el.style.transform = `translateY(${result}%)`;
        } else {
          $el.style.transform = '';
        }
        $el.style.transition = '';
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

      if (currentDragging) {
        $el.style.opacity = `${opacityValue}`;
        $el.style.transition = 'none';
      } else {
        if (targetPositionY) {
          $el.style.opacity = `${opacityValue}`;
        } else {
          $el.style.opacity = '';
        }

        $el.style.transition = '';
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCurrentTranslate = () => {
    return currentTranslate.current > 0 ? currentTranslate.current : 0;
  };

  const handleStart = useCallback((evt: TouchEvent) => {
    evt.cancelable && evt.preventDefault();
    startPosition.current = getPositionY(evt);
    setIsDragging(true);
    if (expandView) {
      snapDirection.current = '';
      prevTranslate.current = startPosition.current;
      setPositionY(startPosition.current);
    } else {
      setPositionY(refPos.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTouchInnerContent = (evt: TouchEvent) => {
    if (!contentInnerRef.current) {
      return;
    }
    const { clientHeight, scrollHeight } = contentInnerRef.current;

    if (clientHeight > scrollHeight && evt.cancelable) {
      evt.preventDefault();
    }
  };

  const handleScrollInnerContent = () => {
    if (!contentInnerRef.current) {
      return;
    }
    const { scrollTop } = contentInnerRef.current;
    setInnerScrollY(scrollTop);
  };

  const handleEnd = useCallback((evt: TouchEvent) => {
    setIsDragging(false);
    if (expandView) {
      const currentPercent = 100 - currentContentPercent.current;
      let targetY: number;
      if (currentPercent > snapTopPercent) {
        // 상단 위치 이동
        targetY = Math.max(0, WebHeaderHeight);
        snapDirection.current = 'UP';
      } else {
        targetY = initPosition;

        if (currentPercent < closePercent) {
          // 하단 닫기 위치 이동
          snapDirection.current = 'DOWN';
          // 닫힘 처리
          setToClose(true);
        } else {
          // 초기 위치로 이동
          snapDirection.current = currentTranslate.current > initPosition ? 'UP' : 'DOWN';
        }
      }

      currentTranslate.current = targetY;
      prevTranslate.current = targetY;
      startPosition.current = targetY;
      setPositionY(targetY);
    } else {
      if (currentContentPercent.current > closePercent) {
        setToClose(true);
      }
      // ref 초기화
      currentTranslate.current = 0;
      prevTranslate.current = 0;
      startPosition.current = refPos.current;
    }
    currentContentPercent.current = 0;

    evt.cancelable && evt.preventDefault();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMove = useCallback((evt: TouchEvent) => {
    evt.cancelable && evt.preventDefault();
    if (expandView) {
      const currentPosition = getPositionY(evt);
      currentTranslate.current = prevTranslate.current + currentPosition - startPosition.current;
      snapDirection.current = '';
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

    if (closeConfirm && closeConfirmCondition.current) {
      const toValueNum = Math.abs(+to.split('%')[0]);
      const currentTransPosY = getCurrentTranslate();

      const currentPercent = expandView
        ? currentContentPercent.current
        : Math.floor(linearEquation(currentTransPosY, 0, refWrapperHeight.current, 0, 100));
      /**
       * Drawer 활성화시 Position 위치 값(% 기준) + 15% 를 기준으로 잡음
       */
      const closeConfirmPercent = expandView ? toValueNum * 1.15 : 10;

      if (currentPercent > closeConfirmPercent) {
        setIsCloseConfirm(true);
        draggingRef.current?.removeEventListener('touchmove', handleMove);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      draggingRef.current?.addEventListener('touchmove', handleMove);
    }
  };

  const removeHandler = () => {
    if (draggingRef.current && dragging) {
      draggingRef.current.removeEventListener('touchstart', handleStart);
      draggingRef.current.removeEventListener('touchend', handleEnd);
      draggingRef.current.removeEventListener('touchcancel', handleCancel);
      draggingRef.current.removeEventListener('touchmove', handleMove);
    }

    if (contentInnerRef.current) {
      contentInnerRef.current.removeEventListener('touchmove', handleTouchInnerContent);
      contentInnerRef.current.removeEventListener('scroll', handleScrollInnerContent);
    }

    removeTapEvent({
      ref: backDropRef,
      listener: handleBackDrop,
    });
  };

  const addHandler = () => {
    if (draggingRef.current && dragging) {
      draggingRef.current.addEventListener('touchstart', handleStart);
      draggingRef.current.addEventListener('touchend', handleEnd);
      draggingRef.current.addEventListener('touchcancel', handleCancel);
      draggingRef.current.addEventListener('touchmove', handleMove);
    }

    if (contentInnerRef.current) {
      contentInnerRef.current.addEventListener('touchmove', handleTouchInnerContent);
      contentInnerRef.current.addEventListener('scroll', handleScrollInnerContent);
    }

    addTapEvent({
      ref: backDropRef,
      listener: handleBackDrop,
    });
  };

  const setInitialPosition = () => {
    // 초기값 설정
    const windowInnerHeight = window.innerHeight;

    // Setting : Dragging
    if (contentRef.current && backDropRef.current) {
      const $contentWrapperEl = contentRef.current;
      const maxWrapperHeight = windowInnerHeight - layoutHeaderHeight + WebHeaderHeight;

      if (!currentContentHeight.current) {
        currentContentHeight.current = $contentWrapperEl.offsetHeight;
      }

      /* console.log('currentContentHeight.current', currentContentHeight.current);
      console.log('$contentWrapperEl.offsetHeight', $contentWrapperEl.offsetHeight);
      console.log('$contentWrapperEl.offsetTop', $contentWrapperEl.offsetTop);
      console.log('maxWrapperHeight', maxWrapperHeight); */

      if (currentContentHeight.current > maxWrapperHeight || expandView || fullHeight) {
        /**
         * 컨텐츠 height가 전체 height보다 클 경우 상단여백을 제외한 height를 지정
         * @author luke@rxc.co.kr (22.01.24)
         */
        updateContentHeight({
          top: `${WebHeaderHeight / 10}rem`,
          maxHeight: `${(windowInnerHeight - WebHeaderHeight) / 10}rem`,
        });
      } else if (
        ($contentWrapperEl.offsetTop > WebHeaderHeight || currentContentHeight.current <= maxWrapperHeight) &&
        !expandView
      ) {
        updateContentHeight({
          top: '',
          maxHeight: '',
        });
      }

      /* console.log('End::$contentWrapperEl.offsetHeight', $contentWrapperEl.offsetHeight);
      console.log('End::$contentWrapperEl.offsetTop', $contentWrapperEl.offsetTop);
      console.log('End::maxWrapperHeight', maxWrapperHeight);
      console.log('======================================================================'); */

      refWrapperHeight.current = $contentWrapperEl.offsetHeight;
      refPos.current = windowInnerHeight - refWrapperHeight.current;
    }
  };

  const updateContentHeight = ({ top, maxHeight }: { top: string; maxHeight: string }) => {
    if (contentRef.current) {
      // eslint-disable-next-line no-param-reassign
      contentRef.current.style.maxHeight = maxHeight;
      // eslint-disable-next-line no-param-reassign
      contentRef.current.style.top = top;
    }
  };

  /**
   * @issue ios safari 주소 하단창의 Resize 이슈 대응
   */
  const updateResize = () => {
    if (isIOSSafari) {
      vhRef.current = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vhRef.current}px`);
    }

    setInitialPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  useEffect(() => {
    if (!closeConfirm) {
      return;
    }

    const { condition } = closeConfirm;

    /** condition(실행 조건)이 있을 경우에만 해당 값 적용, condition(실행 조건)이 없는 경우 true */
    closeConfirmCondition.current = condition ?? true;
  }, [closeConfirm]);

  useEffect(() => {
    disableBackDropCloseRef.current = backDropProps?.disableBackDropClose ?? false;
  }, [backDropProps?.disableBackDropClose]);

  // dragging
  useEffect(() => {
    if (!open) {
      setToClose(false);
      setIsCloseConfirm(false);
      removeHandler();
      return;
    }

    addHandler();
    resetDrawer();
    setInitialPosition();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (open) {
      if (isDragging && positionY) {
        moveToContentWrapper(true, positionY);
      } else {
        // 디시 원상복구 or 닫기 진행
        !expandView && moveToContentWrapper(false);
        // expandView인 경우 snap에 따라 특정 위치로 이동
        expandView && moveToContentWrapper(false, positionY);
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
    return () => {
      if (isIOSSafari) {
        document.documentElement.style.removeProperty('--vh');
      }
      removeHandler();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    positionY,
    isDragging,
    innerScrollY,
    snapDirection: snapDirection.current,
    toClose,
    setPositionY,
    updateResize,
  };
};
