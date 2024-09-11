import { useState, forwardRef, useImperativeHandle, useRef, useEffect, useCallback } from 'react';
import type { MouseEvent, HTMLAttributes } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { PageError } from '@features/exception/components';
import { Wifi } from '@pui/icon';
import { LottieRef, VideoPlay } from '@pui/lottie';
import { Spinner } from '@pui/spinner';
import { theme } from '@styles/theme';
import { FadeState, VideoErrorState, VideoPlayState } from '../constants';
import type { VideoControllerRef } from '../models';
import { Fade } from './Fade';

export type VideoControlProps = HTMLAttributes<HTMLDivElement> & {
  /** 비디오 재생상태 */
  state: VideoPlayState;
  /** 비디오 로딩여부 */
  isLoading: boolean;
  /** 비디오 에러 */
  error: VideoErrorState | null;
  /** play button cb */
  onPlay?: () => void;
  /** pause button cb */
  onPause?: () => void;
  /** 재시도 */
  onRetry?: () => void;
};

const VideoControllerComponent = forwardRef<VideoControllerRef, VideoControlProps>(
  ({ className, state, isLoading, error, onPlay, onPause, onRetry = () => {} }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [fadeState, setFadeState] = useState<FadeState>(FadeState.IN);
    const timeId = useRef<number | null>(null);
    const FADE_TIME = 3000;
    const playLottie = useRef<LottieRef | null>(null);

    // 비디오를 클릭 할때 오버레이 노출
    const fadeIn = useCallback(() => {
      setFadeState(FadeState.IN);
      if (state === VideoPlayState.PLAYING) {
        // 플레이 중일때는 3초후 오버레이 제거
        clearTimeOverlay();
        setTimeOverlay();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    const reset = useCallback(() => {
      setFadeState(FadeState.IN);
      clearTimeOverlay();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * 오버레이 클릭
     */
    const handleOverlay = useCallback(() => {
      if (state === VideoPlayState.ERROR) {
        return;
      }

      if (fadeState === FadeState.IN) {
        setFadeState(FadeState.OUT);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    /**
     * 비디오 play 제어
     */
    const handlePlayControl = useCallback(
      (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (state === VideoPlayState.PLAYING) {
          onPause?.();
        } else if (
          state === VideoPlayState.CAN_PLAY ||
          state === VideoPlayState.PAUSE ||
          state === VideoPlayState.ENDED
        ) {
          onPlay?.();
        }
      },
      [onPause, onPlay, state],
    );

    /**
     * 재생 로띠 애니
     */
    const handlePlayLottie = useCallback(() => {
      clearTimeOverlay();
      setTimeout(() => handleOverlay(), 500); // 로띠 애니메이션 노출 최소 타이밍

      if (playLottie.current && playLottie.current.player) {
        const playButton = playLottie.current.player;
        playButton.setDirection(1);
        playButton.play();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleOverlay]);

    /**
     * 일시정지 로띠 애니
     */
    const handlePauseLottie = useCallback(() => {
      clearTimeOverlay();
      if (playLottie.current && playLottie.current.player) {
        const playButton = playLottie.current.player;
        playButton.setDirection(-1);
        playButton.play();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clearTimeOverlay = useCallback(() => {
      if (timeId.current) {
        window.clearTimeout(timeId.current);
        timeId.current = null;
      }
    }, []);

    const setTimeOverlay = useCallback(() => {
      timeId.current = window.setTimeout(() => {
        setFadeState(FadeState.OUT);
      }, FADE_TIME);
    }, []);

    const playLottieRef = useCallback((target) => {
      if (target) {
        playLottie.current = target as LottieRef;
      }
    }, []);

    useEffect(() => {
      if (state === VideoPlayState.PLAYING) {
        handlePlayLottie();
      } else if (state === VideoPlayState.PAUSE || state === VideoPlayState.ENDED) {
        handlePauseLottie();
      }

      if (state === VideoPlayState.ENDED) {
        if (playLottie.current && playLottie.current.player) {
          const playButton = playLottie.current.player;
          playButton.setDirection(1);
          playButton.goToAndStop(1, true);
        }
      }
    }, [handlePauseLottie, handlePlayLottie, state]);

    useImperativeHandle(ref, () => ({
      ref: containerRef.current as HTMLDivElement,
      fadeIn: () => fadeIn(),
      reset: () => reset(),
    }));

    return (
      <div ref={containerRef} className={className}>
        <Fade state={fadeState}>
          <div
            className={classNames('controller', {
              'is-loading': isLoading,
            })}
            onClick={handleOverlay}
          >
            <Spinner size="small" />
            <div className="btn-container">
              {state !== VideoPlayState.ERROR && (
                <div onClick={handlePlayControl} className="btn-play-wrapper">
                  <VideoPlay
                    ref={playLottieRef}
                    animationOptions={{ autoplay: false, loop: false }}
                    lottieColor={theme.color.whiteLight}
                  />
                </div>
              )}

              {state === VideoPlayState.ERROR && (
                <>
                  {error && (
                    <div className="error-wrapper">
                      <div className="ic-box">
                        <Wifi size="4.8rem" color="text.textDisabled" />
                      </div>
                      <PageError
                        className="error-message"
                        title="네트워크 연결이 원활하지 않습니다"
                        description="Wi-Fi 또는 데이터 연결을 확인해주세요"
                        isFull={false}
                        actionLabel="다시 시도"
                        onAction={onRetry}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </Fade>
      </div>
    );
  },
);

export const VideoController = styled(VideoControllerComponent)`
  & .controller {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    &.is-loading {
      ${Spinner} {
        display: flex;
        position: absolute;
        left: 0;
        right: 0;
        justify-content: center;
      }
    }

    ${Spinner} {
      display: none;
    }
    .btn-container {
      display: block;
    }

    .btn-play-wrapper {
      width: 5.8rem;
      height: 5.8rem;
    }
    & .error-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      & .ic-box {
        margin-bottom: 1.2rem;
      }

      & .error-message {
        width: 100%;
        position: relative;
      }
    }
  }
`;
