import { useState, useEffect, useRef } from 'react';
import { WebHeaderHeight } from '@constants/ui';
import { BaseDomProps, DrawerProps, DrawerDefault } from '@pui/drawer';
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

/** @deprecated */
export const useDrawer = ({
  dragging,
  open,
  onClose: handleClose,
  onCloseComplete: handleCloseComplete,
  to,
  backDropProps,
  draggingProps,
  expandView,
  transitionDuration,
  fullHeight,
}: DrawerCoreProps) => {
  /** Refs */
  const draggingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const contentInnerRef = useRef<HTMLDivElement>(null);
  const backDropRef = useRef<HTMLDivElement>(null);
  const baseDomRef = useRef<BaseDomProps>({});
  const scrollRef = useRef(0);

  /** Init Position */
  const [initPosition, setInitPosition] = useState<number>(getInitPosition(expandView, to));
  const currentPosition = useRef(initPosition);
  const [currentPositionTop, setCurrentPositionTop] = useState<number>(currentPosition.current);

  /** Custom Hook: useDrawerDragging */
  const { toClose, isDragging, positionY, setPositionY } = useDrawerCoreDragging({
    contentRef,
    backDropRef,
    draggingRef,
    dragging,
    backDropOpacity: backDropProps?.opacity ?? DrawerDefault.backDropProps.opacity,
    closePercent: draggingProps?.closePercent ?? DrawerDefault.draggingProps.closePercent,
    layoutHeaderHeight: draggingProps?.layoutHeaderHeight ?? DrawerDefault.draggingProps.layoutHeaderHeight,
    open,
    expandView,
    initPosition,
    fullHeight,
    closeConfirm: draggingProps?.closeConfirm,
  });

  /** Handler */
  const handleBackDrop = () => {
    backDropProps?.onBackDropClick?.();
    return backDropProps?.disableBackDropClose ? null : handleClose();
  };

  const areaDisabled = () => {
    scrollRef.current = window.scrollY;
    const $html = document.querySelector('html') as HTMLHtmlElement;
    const $body = document.body as HTMLBodyElement;
    const $root = document.getElementById('root') as HTMLDivElement;

    $root.style.position = 'relative';
    $root.style.transform = `translateY(-${scrollRef.current}px)`;
    $html.style.height = '100vh';
    $body.style.height = '100vh';
    $body.style.position = 'fixed';
    $body.style.left = '0';
    $body.style.right = '0';
  };

  const areaEnabled = () => {
    const $html = document.querySelector('html') as HTMLHtmlElement;
    const $body = document.body as HTMLBodyElement;
    const $root = document.getElementById('root') as HTMLDivElement;
    $html.style.height = baseDomRef.current.htmlHeight ?? '';
    $body.style.height = baseDomRef.current.bodyHeight ?? '';
    $body.style.position = baseDomRef.current.bodyPosition ?? '';
    $root.style.transform = '';
    $root.style.position = '';
    $body.style.left = '';
    $body.style.right = '';
    window.scrollTo(0, scrollRef.current);
  };

  // body scroll 방지
  useEffect(() => {
    let eventRef: HTMLDivElement | null = null;

    const $body = document.body as HTMLBodyElement;

    /**
     * @issue drawer 이 2개이상 활성화 되었을 경우에 중복으로 body, html 옵션을 변경하지 않는다.
     */
    const $floating = document.getElementById('floating-root') as HTMLDivElement;
    const isFirstDrawer = !($floating.querySelectorAll('[aria-label=drawer].open').length > 1);

    if (isFirstDrawer) {
      $body.style.overflow = open ? 'hidden' : '';
    }

    const onTouchEvent = (event: TouchEvent) => {
      event.stopPropagation();
    };

    if (open) {
      // inner content scroll 영역 Reset
      contentInnerRef.current && contentInnerRef.current.scrollTo(0, 0);

      if (isFirstDrawer) {
        areaDisabled();
      }

      if (contentRef.current) {
        contentRef.current.addEventListener('touchmove', onTouchEvent);
        eventRef = contentRef.current;
      }
    }

    return () => {
      if (open) {
        if (isFirstDrawer) {
          areaEnabled();
        }

        if (handleCloseComplete) {
          setTimeout(() => {
            handleCloseComplete();
          }, transitionDuration);
        }
      }

      if (eventRef) {
        eventRef.removeEventListener('touchmove', onTouchEvent);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, contentRef, expandView]);

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
      setInitPosition(getInitPosition(expandView, to));
    };

    window.addEventListener('resize', setPosition);

    return () => {
      window.removeEventListener('resize', setPosition);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const $html = document.querySelector('html') as HTMLHtmlElement;
    const $body = document.body as HTMLBodyElement;
    const baseDomProps = {
      htmlHeight: $html.style.height,
      bodyHeight: $body.style.height,
      bodyPosition: $body.style.position,
    };

    if (baseDomRef.current) {
      baseDomRef.current = baseDomProps;
    }

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
    currentPositionTop,
    handleBackDrop,
  };
};
