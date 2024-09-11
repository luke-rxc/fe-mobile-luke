import { useEffect, useCallback, useRef } from 'react';
import { VideoReadyState } from '../constants';
import type { VideoEventCallbackType } from '../models';

/**
 * 비디오 element 제어 관리
 * ```
 * useVideo({
 *  videoEvents: {
 *    play: (e) => {},
 *    pause: (e) => {},
 *  }
 * })
 * ```
 */
export const useVideo = ({
  videoEvents,
  isPlayDeepCheck = true,
  forceLoadVideo = false,
}: {
  videoEvents: VideoEventCallbackType;
  isPlayDeepCheck?: boolean; // 비디오 재생 할수 있는 객체를 한번더 체크하기 위해서 사용 (기본 값 true)
  forceLoadVideo?: boolean; // 최초  비디오 재생을 위한 강제 로드
}) => {
  const videoElRef = useRef<HTMLVideoElement | null>(null);

  /**
   * 비디오 재생
   * @param initialVideoFrame : 재생 시작전 비디오 프레임 초기화 여부
   * @returns
   */
  const handleVideoPlay = useCallback(
    (initialVideoFrame = false) => {
      const videoEl = videoElRef.current;

      if (!videoEl) return;

      const readyStateCondition = videoEl.readyState >= VideoReadyState.HAVE_FUTURE_DATA;

      if (!isPlayDeepCheck || readyStateCondition) {
        if (initialVideoFrame === true) {
          videoEl.currentTime = 0;
        }
        // 저전력모드 play error에 대한 대응
        videoEl.play().catch(() => {});
      }
    },
    [isPlayDeepCheck],
  );

  /** 비디오 일시정지 */
  const handleVideoPaused = useCallback(() => {
    const videoEl = videoElRef.current;
    if (!videoEl) return;

    videoEl.pause();
  }, []);

  /**
   * 비디오 초기화
   * @param noResetVideoFrame : 비디오프레임 초기화 처리 비활성화
   * @returns
   */
  const handleVideoReset = useCallback((noResetVideoFrame = false) => {
    const videoEl = videoElRef.current;
    if (!videoEl) return;
    if (!videoEl.paused && videoEl.played.length > 0) {
      handleVideoPaused();
      if (!noResetVideoFrame) {
        videoEl.currentTime = 0;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** 비디오 타임라인 변경 */
  const handleUpdateVideoTime = useCallback((time: number) => {
    const videoEl = videoElRef.current;
    if (!videoEl) return;

    // 총 duration 값으로 currentTime 할당시, 리렌더될때 0으로 리셋되는 경우가 있어 임의 작은 값으로 - 계산 처리
    const timeValue = Math.max(time - 0.1, 0.02);
    videoEl.currentTime = timeValue;
  }, []);

  const handleVideoEvent = useCallback(
    (e) => {
      const { type } = e;
      const callbackFn = videoEvents[type as keyof typeof videoEvents];
      if (callbackFn) {
        callbackFn(e);
      }
    },
    [videoEvents],
  );

  /** 비디오 이벤트 추가 */
  const addEvents = useCallback(() => {
    const videoEl = videoElRef.current;
    if (!videoEl) return;

    (Object.keys(videoEvents) as (keyof typeof videoEvents)[]).forEach((key) => {
      videoEl.addEventListener(key, handleVideoEvent, false);
    });
  }, [handleVideoEvent, videoEvents]);

  /** 비디오 이벤트 제거 */
  const removeEvents = useCallback(() => {
    const videoEl = videoElRef.current;
    if (!videoEl) return;

    (Object.keys(videoEvents) as (keyof typeof videoEvents)[]).forEach((key) => {
      videoEl.removeEventListener(key, handleVideoEvent, false);
    });
  }, [handleVideoEvent, videoEvents]);

  const videoRef = useCallback((videoEl: HTMLVideoElement) => {
    if (videoEl) {
      videoElRef.current = videoEl;
      addEvents();

      if (forceLoadVideo) {
        videoEl.load();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      removeEvents();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    videoRef,
    videoElRef,
    handleVideoPlay,
    handleVideoPaused,
    handleVideoReset,
    handleUpdateVideoTime,
  };
};
