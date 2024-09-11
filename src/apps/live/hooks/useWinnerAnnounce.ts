import { useAuth } from '@hooks/useAuth';
import { useCallback, useEffect, useRef, useState } from 'react';
import { closeDuration, contentHeight, startDelayDuration, transitionDuration } from '../constants';
import { RaffleUserInfoModel } from '../models';
import { useScrollEnd } from './useScrollEnd';

export interface WinnerAnnounceProps {
  // Close Functoin
  onClose?: () => void;
  // 리스트
  list: RaffleUserInfoModel[];
  /**
   * 당첨자 발표 전체 height 100%
   * @default 40
   */
  closePercent?: number;
}

export const useWinnerAnnounce = ({ onClose: handleClose, list, closePercent = 40 }: WinnerAnnounceProps) => {
  const { userInfo } = useAuth();
  // 당첨자 발표 준비 상태
  const [ready, setReady] = useState(false);
  // 당첨자 발표 closed 될 상태
  const [closed, setClosed] = useState<boolean>(false);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);

  // 당첨자 발표 wrapper ref
  const announceRef = useRef<HTMLDivElement>(null);
  // 당첨자 발표 scroll ref
  const scrollRef = useRef<HTMLDivElement>(null);
  // 당첨자 발표 content list ref
  const contentRef = useRef<HTMLDivElement>(null);
  // 당첨자 발표 dragbar ref
  const draggingRef = useRef<HTMLDivElement>(null);
  // 당첨자 발표 노출 시간 타이머 ref
  const timeoutRef = useRef<number | null>(null);
  // autoscroll requestAnimationFrame ref
  const requestId = useRef<number | null>(null);
  // 현재까지 진행된 autoscroll duration ref
  const currentDuration = useRef<number>(0);

  // Drag 시작점 위치
  const startPosition = useRef(0);
  // Drag 현재 위치
  const currentPosition = useRef(0);
  // Drag close 위치
  const closePosition = useRef(0);

  const userId = userInfo?.userId ?? '';
  const nickname = userInfo?.nickname ?? '';

  // '다음에 다시 도전해주세요' 셀 추가
  const listLength = list.filter((item) => item.userId === userId).length > 0 ? list.length : list.length + 1;

  const autoScrollDuration = autoScroll ? listLength * 1500 : 0;

  const winnerList = list
    .sort((item) => {
      if (item.userId === userId) {
        return -1;
      }
      return 0;
    })
    .map((item) => item.nickname);

  useEffect(() => {
    if (list.length > 0) {
      setReady(true);
    }
  }, [list]);

  useEffect(() => {
    if (announceRef.current) {
      closePosition.current = (announceRef.current.offsetHeight * closePercent) / 100;
    }
  }, [closePercent]);

  // content 높이가 와우드로우 높이보다 작다면 autoScroll = false
  useEffect(() => {
    if (contentRef.current && contentRef.current.offsetHeight <= contentHeight) {
      setAutoScroll(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentRef]);

  // open시 와우드로우 노출시간 설정
  useEffect(() => {
    if (ready) {
      addEvents();
      timeoutRef.current = window.setTimeout(() => {
        handleAnnounceClose();
      }, startDelayDuration + autoScrollDuration + closeDuration);
    } else {
      timeoutRef.current && window.clearTimeout(timeoutRef.current);
    }

    return () => {
      removeEvents();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // 당첨자 발표 close
  const handleAnnounceClose = () => {
    setClosed(true);

    setTimeout(() => {
      setReady(false);
      setClosed(false);
      setAutoScroll(true);
      scrollRef.current?.scrollTo(0, 0);
      handleClose && handleClose();
    }, transitionDuration);
  };

  /**
   * autoscroll 함수
   */
  useEffect(() => {
    if (autoScroll && contentRef.current) {
      const scrollStartPosition = 0;
      // masking area 추가
      if (contentRef.current.offsetHeight - contentHeight > 0) {
        contentRef.current.style.padding = '2.4rem 0';
      }
      const scrollEndPosition = contentRef.current.offsetHeight - contentHeight;

      setTimeout(() => {
        requestId.current = requestAnimationFrame((timestamp) =>
          moveToScroll(timestamp, timestamp, scrollStartPosition, scrollEndPosition, autoScrollDuration),
        );
      }, startDelayDuration);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoScroll]);

  const linearScrollAnimation = (
    startTime: number,
    currentTime: number,
    startValue: number,
    finishValue: number,
    duration: number,
  ) => {
    const progress = 1 - (1 - (currentTime - startTime) / duration);
    const value = finishValue - startValue;

    return startValue + value * progress;
  };

  const moveToScroll = useCallback(
    (start: number, current: number, startValue: number, endValue: number, duration: number) => {
      const startTime = start ?? current;
      const elapsedTime = current - startTime;
      currentDuration.current = elapsedTime;

      if (Math.floor(elapsedTime) < duration && contentRef.current && scrollRef.current) {
        scrollRef.current.scrollTop = linearScrollAnimation(startTime, current, startValue, endValue, duration);

        requestId.current = requestAnimationFrame((timestamp) =>
          moveToScroll(startTime, timestamp, startValue, endValue, duration),
        );
      }
    },
    [],
  );

  const handleScrollStop = () => {
    if (requestId.current && autoScroll) {
      cancelAnimationFrame(requestId.current);
      timeoutRef.current && window.clearTimeout(timeoutRef.current);
    }
  };

  const handleScrollStart = () => {
    if (contentRef.current && scrollRef.current) {
      const scrollStartPosition = scrollRef.current.scrollTop;
      const scrollEndPosition = contentRef.current.offsetHeight - contentHeight;
      const duration = scrollEndPosition
        ? (autoScrollDuration / scrollEndPosition) * (scrollEndPosition - scrollStartPosition)
        : autoScrollDuration;

      requestId.current = requestAnimationFrame((timestamp) => {
        moveToScroll(timestamp, timestamp, scrollStartPosition, scrollEndPosition, duration);
      });

      timeoutRef.current = window.setTimeout(() => {
        handleAnnounceClose();
      }, duration + closeDuration);
    }
  };

  const { scrollEnd } = useScrollEnd({
    element: scrollRef.current,
    callback: {
      touchStartCb: handleScrollStop,
      touchCancelCb: handleScrollStart,
    },
  });

  useEffect(() => {
    if (scrollEnd && autoScroll) {
      handleScrollStart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollEnd, autoScroll]);

  /**
   * 드래그바 드래그 함수
   */
  const getPositionY = (e: TouchEvent) => {
    return e.touches[0].clientY;
  };

  const moveToContentWrapper = useCallback((translateY = 0) => {
    if (announceRef.current) {
      announceRef.current.style.transform = `translateY(-${translateY}px)`;
      announceRef.current.style.transition = 'none';
    }
  }, []);

  const handleDrggingStart = (e: TouchEvent) => {
    startPosition.current = getPositionY(e);
  };

  const handleDrgging = (e: TouchEvent) => {
    currentPosition.current = getPositionY(e);
    const diff = startPosition.current - currentPosition.current;
    moveToContentWrapper(diff);
  };

  const handleDrggingEnd = () => {
    if (announceRef.current) {
      const diff = startPosition.current - currentPosition.current;
      announceRef.current.style.transform = '';
      announceRef.current.style.transition = '';
      if (diff > closePosition.current) {
        handleAnnounceClose();
      }
    }
  };

  const addEvents = useCallback(() => {
    const draggingEl = draggingRef.current;
    if (draggingEl) {
      draggingEl.addEventListener('touchstart', handleDrggingStart, true);
      draggingEl.addEventListener('touchmove', handleDrgging, true);
      draggingEl.addEventListener('touchend', handleDrggingEnd, true);
      draggingEl.addEventListener('touchcancel', handleDrggingEnd, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollRef, draggingRef, autoScroll]);

  const removeEvents = useCallback(() => {
    const draggingEl = draggingRef.current;
    if (draggingEl) {
      draggingEl.removeEventListener('touchstart', handleDrggingStart, true);
      draggingEl.removeEventListener('touchmove', handleDrgging, true);
      draggingEl.removeEventListener('touchend', handleDrggingEnd, true);
      draggingEl.removeEventListener('touchcancel', handleDrggingEnd, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollRef, draggingRef, autoScroll]);

  return {
    refs: {
      announceRef,
      scrollRef,
      draggingRef,
      contentRef,
    },
    ready,
    closed,
    nickname,
    autoScroll,
    winnerList,
    duration: autoScrollDuration,
    onScrollStop: handleScrollStop,
    onScrollStart: handleScrollStart,
  };
};
