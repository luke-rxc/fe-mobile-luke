import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import throttle from 'lodash/throttle';
import { LiveOpenStatus, LiveStatus } from '@constants/live';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useWebInterface } from '@hooks/useWebInterface';
import { FloatingDirectionStatus } from '../constants';
import type { ContentLiveModel, ContentShowroomModel } from '../models';

/**
 * 컨텐츠 내 플로팅 영역을 처리하기 위한 서비스
 */
export const useContentFloatingService = ({
  showroom,
  live,
}: {
  showroom: ContentShowroomModel;
  live: ContentLiveModel;
}) => {
  const { floatingLivePlayerStatus, floatingLivePlayerStatusValue } = useWebInterface();
  const { isApp } = useDeviceDetect();

  /**
   * 라이브 컴포넌트
   * 비공개 상태이거나, 라이브 종료인 경우, 앱 내 플로팅 플레이어 라이브와 동일한 라이브인 경우, 라이브 바 컴포넌트 미노출
   */
  const validLive = !(
    !live ||
    live.liveStatus === LiveStatus.END ||
    live.openStatus === LiveOpenStatus.DRAFT ||
    (isApp && floatingLivePlayerStatusValue && floatingLivePlayerStatusValue?.liveId === live.id)
  );

  /**
   * 팔로우 컴포넌트
   */
  const validFollow = !showroom.isFollow;

  /**
   * 플로팅 배너 페이지 업 다운
   */
  const [direction, setDirection] = useState<FloatingDirectionStatus>(FloatingDirectionStatus.NONE);
  const scrollDelay = 100;
  const prevScrollY = useRef<number>(window.scrollY);
  const prevDirection = useRef<FloatingDirectionStatus | null>(null);

  const initDisableScrolled = useRef<boolean>(true);
  const initDisableScrolledTime = 5000;

  const handleScrollChange = useCallback(() => {
    // 페이지 진입 후 초기 5초 동안은 플로팅 상시 노출
    if (initDisableScrolled.current) return;
    const { scrollY } = window;
    const prevY = prevScrollY.current;
    const scrollDirection = scrollY > prevY ? FloatingDirectionStatus.DOWN : FloatingDirectionStatus.UP;
    const distance = Math.abs(scrollY - prevY);
    const viewHeight = window.innerHeight;
    const scrollHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.body.clientHeight);
    const isOutOfBounds = scrollY < 0 || scrollY + viewHeight >= scrollHeight;
    const toleranceExceeded = distance > 0;
    const top = scrollY <= 0;

    const isDown = scrollDirection === FloatingDirectionStatus.DOWN && !top && toleranceExceeded;
    const isUp = (scrollDirection === FloatingDirectionStatus.UP && toleranceExceeded) || top;

    if (!isOutOfBounds) {
      let currentDirection: FloatingDirectionStatus | null = null;
      if (isDown) {
        currentDirection = FloatingDirectionStatus.DOWN;
      } else if (isUp) {
        currentDirection = FloatingDirectionStatus.UP;
      }

      if (currentDirection && currentDirection !== prevDirection.current) {
        setDirection(currentDirection);
        prevDirection.current = currentDirection;
      }
    }

    prevScrollY.current = scrollY;
  }, []);

  const handleScroll = throttle(handleScrollChange, scrollDelay);

  const handleAvailableScroll = useCallback((active: boolean) => {
    if (active) {
      window.removeEventListener('scroll', handleScroll);
      window.addEventListener('scroll', handleScroll);
    } else {
      window.removeEventListener('scroll', handleScroll);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 배너 dismiss 처리 후 팔로우 쿠폰 다운시 팔로우 영역만 노출
  const handleInitialFloating = useCallback(() => {
    setDirection(FloatingDirectionStatus.DOWN);

    prevScrollY.current = window.scrollY;
    prevDirection.current = null;
  }, []);

  useLayoutEffect(() => floatingLivePlayerStatus(), [floatingLivePlayerStatus]);

  useEffect(() => {
    if (validLive && validFollow) {
      handleAvailableScroll(true);
    }

    return () => {
      handleAvailableScroll(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTimeout(() => {
      initDisableScrolled.current = false;
    }, initDisableScrolledTime);
  }, []);

  return {
    direction,
    validLive,
    validFollow,
    handleAvailableScroll,
    handleInitialFloating,
  };
};
