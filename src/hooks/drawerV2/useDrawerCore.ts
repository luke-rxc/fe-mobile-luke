import { useState, useEffect, useRef } from 'react';
import { WebHeaderHeight } from '@constants/ui';
import { DrawerProps, DrawerDefault } from '@pui/drawer/v2';
import { useDrawerCoreDragging } from './useDrawerCoreDragging';

interface DrawerCoreProps extends Omit<DrawerProps, 'dragging' | 'expandView' | 'title' | 'fullHeight'> {
  dragging: boolean;
  expandView: boolean;
  fullHeight: boolean;
}

/** 초기 포지션 계산 */
const getInitPosition = (expandView: boolean, to?: string) => {
  const toValueNum = to && to.length ? to.split('%')[0] : '0';
  const initNum = expandView
    ? (window.innerHeight - WebHeaderHeight) * (Math.abs(+toValueNum) / 100) + WebHeaderHeight
    : 0;
  return initNum;
};

export const useDrawerCore = ({
  dragging,
  open,
  onClose: handleClose,
  onCloseComplete: handleCloseComplete,
  to,
  backDropProps,
  draggingProps,
  expandView,
  snapTopPercent,
  transitionDuration,
  fullHeight,
}: DrawerCoreProps) => {
  /** Refs */
  const draggingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const contentInnerRef = useRef<HTMLDivElement>(null);
  const backDropRef = useRef<HTMLDivElement>(null);

  /** Init Position */
  const [initPosition, setInitPosition] = useState<number>(getInitPosition(expandView, to));
  const currentPosition = useRef(initPosition);
  const [currentPositionTop, setCurrentPositionTop] = useState<number>(currentPosition.current);

  /** Custom Hook: useDrawerDragging */
  const { toClose, isDragging, innerScrollY, positionY, snapDirection, setPositionY, updateResize } =
    useDrawerCoreDragging({
      contentRef,
      backDropRef,
      draggingRef,
      dragging,
      contentInnerRef,
      backDropProps,
      closePercent: draggingProps?.closePercent ?? DrawerDefault.draggingProps.closePercent,
      layoutHeaderHeight: draggingProps?.layoutHeaderHeight ?? DrawerDefault.draggingProps.layoutHeaderHeight,
      open,
      expandView,
      to,
      snapTopPercent: snapTopPercent ?? DrawerDefault.snapTopPercent,
      initPosition,
      fullHeight,
      closeConfirm: draggingProps?.closeConfirm,
      onClose: handleClose,
    });

  // body scroll 방지
  useEffect(() => {
    const $body = document.body as HTMLBodyElement;

    /**
     * @issue drawer 이 2개이상 활성화 되었을 경우에 중복으로 body, html 옵션을 변경하지 않는다.
     */
    const $floating = document.getElementById('floating-root') as HTMLDivElement;
    const isFirstDrawer = !($floating.querySelectorAll('[aria-label=drawer]').length > 1);

    if (isFirstDrawer) {
      $body.style.overflow = open ? 'hidden' : '';
    }

    if (open) {
      // inner content scroll 영역 Reset
      contentInnerRef.current && contentInnerRef.current.scrollTo(0, 0);
    }

    return () => {
      if (open) {
        if (handleCloseComplete) {
          setTimeout(() => {
            handleCloseComplete();
          }, transitionDuration);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, toClose, contentRef, expandView]);
  // }, [open, contentRef, expandView]);

  useEffect(() => {
    if (toClose) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toClose]);

  useEffect(() => {
    if (!expandView) {
      return;
    }

    if (!open) {
      /**
       * expandView 상태에서 닫을 경우 내부 content height가 초기 initPosition 높이 값으로 변경이 되면서 닫히기 전에 내부 content가 짤리는 경우 대응
       */
      if (initPosition !== positionY) {
        return;
      }
      currentPosition.current = initPosition;
      setPositionY(initPosition);
      setCurrentPositionTop(initPosition);
    } else {
      currentPosition.current = positionY;
      setCurrentPositionTop(currentPosition.current);
    }
  }, [expandView, initPosition, isDragging, open, positionY, setPositionY, transitionDuration]);

  useEffect(() => {
    /**
     * @issue ios safari 주소 하단창의 Resize 이슈 대응
     */
    const setPosition = () => {
      const newPosition = getInitPosition(expandView, to);
      setInitPosition(newPosition);
      // AOS chrome 주소 노출되면서 Resize 이슈 대응
      currentPosition.current !== WebHeaderHeight && setPositionY(newPosition);
      updateResize();
    };

    if (open) {
      window.addEventListener('resize', setPosition);
    } else {
      window.removeEventListener('resize', setPosition);
    }

    return () => {
      window.removeEventListener('resize', setPosition);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    updateResize();

    return () => {
      const $body = document.body as HTMLBodyElement;
      const $floating = document.getElementById('floating-root') as HTMLDivElement;
      const isDrawerOpen = $floating.querySelectorAll('[aria-label=drawer].open').length > 0;

      /** Drawer open 상태인 element가 없을 경우에만 overflow 초기화 */
      if (!isDrawerOpen) {
        $body.style.overflow = '';
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    refs: {
      backDropRef,
      contentRef,
      draggingRef,
      contentInnerRef,
    },
    isDragging,
    innerScrollY,
    currentPositionTop,
    snapDirection,
  };
};
