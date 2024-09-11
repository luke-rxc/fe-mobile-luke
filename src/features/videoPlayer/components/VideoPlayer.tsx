import { forwardRef, useEffect, useState, useCallback, useRef, useMemo } from 'react';
import type { HTMLAttributes } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { useTheme } from '@hooks/useTheme';
import { Conditional } from '@pui/conditional';
import { Video, VideoProps } from '@pui/video';
import { Image } from '@pui/image';
import { LottieRef, Mute } from '@pui/lottie';
import { Action } from '@pui/action';
import { isString } from '@utils/type';
import { VideoErrorState, VideoPlayState } from '../constants';
import { useVideo } from '../hooks';
import type { VideoControllerRef, VideoViewingTimeModel } from '../models';
import { VideoController } from './VideoController';
import { getInitMuteState } from '../utils';

export type VideoPlayerProps = HTMLAttributes<HTMLDivElement> & {
  /** 기본 비디오 정보 */
  video: VideoProps;
  /** 비디오 재생 할수 있는 객체를 한번더 체크하기 위해서 사용 */
  isPlayDeepCheck?: boolean;
  /** 비디오 레이지 처리 */
  lazy?: boolean;
  /** 비디오 영역 threshold */
  threshold?: number;
  /** 음소거 버튼 사용여부 */
  usableMuteButton?: boolean;
  /** 뷰포트 포함되지 않을때 음소거 초기화 여부 */
  outViewInitialMuted?: boolean;
  /** 최초 비디오 재생을 위한 강제 로드 */
  forceLoadVideo?: boolean;
  /** 비디오 재생상태 변경 시 */
  onChangePlayerState?: (v: VideoPlayState) => void;
  /** 음소거 상태 변경 시 */
  onChangeMutedState?: (v: boolean) => void;
  /** 음소거 버튼 클릭 시 */
  onClickMutedState?: (v: boolean) => void;
  /** 비디오 영역 체류 조회 */
  onViewingTime?: (v: VideoViewingTimeModel) => void;
};
const VideoPlayerComponent = forwardRef<HTMLDivElement, VideoPlayerProps>(
  (
    {
      className,
      video,
      isPlayDeepCheck = true,
      lazy = true,
      threshold = 0,
      usableMuteButton = true,
      outViewInitialMuted = false,
      forceLoadVideo = false,
      onChangePlayerState,
      onChangeMutedState,
      onClickMutedState,
      onViewingTime,
    },
    ref,
  ) => {
    const { theme } = useTheme();
    const { autoPlay, loop = false, ...videoProps } = video;
    const videoControlRef = useRef<VideoControllerRef>(null); // 비디오 커스텀 컨트롤러
    const mutedLottie = useRef<LottieRef | null>(null);
    const [isLoading, setIsLoading] = useState(false); // 로딩 여부
    const [videoError, setVideoError] = useState<VideoErrorState | null>(null); // 비디오 에러상태
    const [isShowPoster, setIsShowPoster] = useState(true); // 포스트 이미지 노출 상태
    const [playerState, setPlayerState] = useState<VideoPlayState>(VideoPlayState.PAUSE); // 비디오 재생상태
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const initMutateState = useMemo(() => getInitMuteState(video), []); // 초기 음소거
    const [mutedState, setMutedState] = useState<boolean>(initMutateState); // 비디오 음소거 상태
    const [canPlay, setCanPlay] = useState<boolean>(false);
    const totalViewTime = useRef<number>(0); // 총 재생 시간
    const currentViewTime = useRef<number>(0); // 현재 재생 시간
    const isStartedPlay = useRef<boolean>(false);
    const loopCount = useRef<number>(0);
    const [inView, setInView] = useState(false); // 컴포넌트 뷰 노출
    const observer = useRef<IntersectionObserver | null>(null);
    const sectionRef = useCallback((el) => {
      if (!el || observer.current) return;
      observer.current = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
          entries.forEach((entry: IntersectionObserverEntry) => setInView(entry.isIntersecting));
        },
        { rootMargin: `0px 0px 0px 0px`, threshold },
      );
      observer.current.observe(el);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const {
      videoRef,
      handleVideoPlay,
      handleVideoPaused,
      handleVideoReset: handleReset,
    } = useVideo({
      videoEvents: {
        loadstart: () => {
          setIsLoading(true);
        },
        progress: () => {
          setIsLoading(true);
        },
        canplay: () => {
          setIsLoading(false);
          setCanPlay(true);
          setPlayerState(VideoPlayState.CAN_PLAY);
        },
        canplaythrough: () => {
          setIsLoading(false);
        },
        play: () => {
          setPlayerState(VideoPlayState.PLAYING);
          setVideoError(null);
          isStartedPlay.current = true;
        },
        playing: () => {
          setPlayerState(VideoPlayState.PLAYING);
          setVideoError(null);
        },
        pause: () => {
          setPlayerState(VideoPlayState.PAUSE);
          setVideoError(null);
        },
        timeupdate: ({ target }) => {
          setIsLoading(false);
          // 타임 정보 업데이트
          const videoEl = target as HTMLVideoElement;
          const { duration = 0, currentTime } = videoEl;
          const videoDuration = duration || 0;
          totalViewTime.current = videoDuration * loopCount.current + currentTime;
          currentViewTime.current = currentTime;
        },
        ended: () => {
          setPlayerState(VideoPlayState.ENDED);
          setVideoError(null);
          if (loop) {
            handleVideoPlay();
            loopCount.current += 1;
          }
        },
        error: ({ target }) => {
          setIsLoading(false);
          const videoEl = target as HTMLVideoElement;
          const mediaError = videoEl?.error;
          if (!mediaError) return;
          const { code } = mediaError;
          setCanPlay(false);
          setPlayerState(VideoPlayState.ERROR);
          setVideoError(code as VideoErrorState);
        },
        click: () => {
          if (videoControlRef.current) {
            videoControlRef.current.fadeIn();
          }
        },
      },
      isPlayDeepCheck,
      forceLoadVideo,
    });

    /**
     * 음소거 상태 변경
     */
    const handleMuteState = useCallback((mute: boolean, isAnimation = true) => {
      if (mutedLottie?.current?.player) {
        const muteLottiePlayer = mutedLottie.current.player;
        muteLottiePlayer.setDirection(mute ? -1 : 1);
        if (isAnimation) {
          muteLottiePlayer.play();
        } else {
          const frame = mute ? 1 : muteLottiePlayer.totalFrames - 1;
          muteLottiePlayer.goToAndStop(frame, true);
        }
      }
      setMutedState(mute);
      onChangeMutedState?.(mute);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * 음소거 버튼 클릭
     */
    const handleClickMuteButton = useCallback(() => {
      const currentMuteState = mutedState;
      const targetState = !currentMuteState;
      handleMuteState(targetState);
      onClickMutedState?.(targetState);
    }, [handleMuteState, mutedState, onClickMutedState]);

    // 비디오 컨텐츠 재생
    const handleStartVideo = useCallback(
      (initial = false) => {
        if (!canPlay) return;
        // 비디오 포스터 1프레임 렌더링 될때 여백을 보간하기 위한 타이밍 조절
        setTimeout(() => setIsShowPoster(false), 100);
        handleVideoPlay(initial);
      },
      [canPlay, handleVideoPlay],
    );

    const handleVideoReset = useCallback((isTimeupdate = true) => {
      handleReset(isTimeupdate);
      if (outViewInitialMuted) {
        handleMuteState(initMutateState);
      }
      if (videoControlRef.current) {
        videoControlRef.current.fadeIn();
      }

      onViewingTime?.({
        totalViewTime: totalViewTime.current,
        currentViewTime: currentViewTime.current,
        isStartedPlay: isStartedPlay.current,
      });

      totalViewTime.current = 0;
      currentViewTime.current = 0;
      isStartedPlay.current = false;
      loopCount.current = 0;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRetry = useCallback(() => {
      setCanPlay(false);
      setPlayerState(VideoPlayState.PAUSE);
      setVideoError(null);
      setIsShowPoster(true);
    }, []);

    // 비디오 재생 상태 변경
    useEffect(() => {
      onChangePlayerState?.(playerState);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playerState]);

    useEffect(() => {
      if (!canPlay || !autoPlay) return;
      if (inView) {
        handleStartVideo(true);
      } else {
        handleVideoReset(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canPlay, inView]);

    useEffect(() => {
      // 초기 음소거 버튼 설정
      handleMuteState(mutedState, false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      const osv = observer.current;
      // 페이지 뷰 변경 될때 비디오 종료
      window.addEventListener('visibilitychange', () => handleVideoReset(true));

      return () => {
        if (osv) {
          osv.disconnect();
          observer.current = null;
        }
        window.removeEventListener('visibilitychange', () => handleVideoReset(true));
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const videoDefaultOption = {
      ...videoProps,
      playsInline: true,
      autoPlay: false,
      /** 비디오 loop 처리시 video end 이벤트를 캐치하기 위해 loop:alse로 설정 후 강제 플레이 함수 호출 */
      loop: false,
      controls: false,
      width: '100%',
      height: 'initial',
      src: videoProps.src,
    };
    return (
      <div ref={ref} className={className}>
        <div
          ref={sectionRef}
          className={classNames('player', {
            'is-error': videoError,
            'is-hidden-poster': !isShowPoster || videoError,
            'is-hide-mute': !usableMuteButton,
          })}
        >
          {!videoError && (
            <Conditional
              condition={lazy}
              trueExp={<Video ref={videoRef} lazy className="video" {...videoDefaultOption} muted={mutedState} />}
              falseExp={
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video ref={videoRef} className="video" {...videoDefaultOption} muted={mutedState} />
              }
            />
          )}
          <div className="video-poster">
            <Image src={videoProps.poster} lazy />
          </div>

          <VideoController
            ref={videoControlRef}
            className="controller"
            isLoading={isLoading}
            onPlay={handleStartVideo}
            onPause={handleVideoPaused}
            onRetry={handleRetry}
            state={playerState}
            error={videoError}
          />
          <Action is="button" className="muted" onClick={handleClickMuteButton}>
            <span className="ico-muted-wrapper">
              <span className="ico-muted">
                <Mute
                  ref={mutedLottie}
                  animationOptions={{ autoplay: false, loop: false }}
                  lottieColor={theme.color.whiteLight}
                />
              </span>
            </span>
          </Action>
        </div>
      </div>
    );
  },
);

export const VideoPlayer = styled(VideoPlayerComponent)`
  position: relative;
  width: 100%;

  & .player {
    &.is-error {
      width: 100%;
      height: 0;
      padding-top: ${({ video }) => {
        if (!video.height || isString(video.height) || isString(video.width)) return '100%';
        const { width = 0, height = 0 } = video;
        return `${Math.floor(height / width) * 100}%`;
      }};
      &:before {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: block;
        height: 100%;
        background: ${({ theme }) => theme.color.gray8};
        content: '';
      }

      & .muted {
        display: none;
      }
    }
    &.is-hidden-poster {
      & .video-poster {
        display: none;
      }
    }
    &.is-hide-mute {
      & ${Action}.muted {
        display: none;
      }
    }

    & .video {
      vertical-align: top;
    }

    & .video-poster {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      vertical-align: middle;
    }

    & .play-controller {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    & ${Action}.muted {
      position: absolute;
      top: 0.8rem;
      right: 0.8rem;
      width: 4.8rem;
      height: 4.8rem;
      display: flex;
      align-items: center;
      justify-content: center;

      & .ico-muted-wrapper {
        display: block;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 3.2rem;
        height: 3.2rem;
        background-color: ${({ theme }) => theme.color.gray50};
        border-radius: 50%;
        color: ${({ theme }) => theme.color.whiteLight};
        & .ico-muted {
          display: block;
          width: 2.4rem;
          height: 2.4rem;
        }
      }
    }
  }
`;
