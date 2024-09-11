import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useVideo } from '@features/videoPlayer/hooks';
import { VideoErrorState } from '@features/videoPlayer/constants';
import { Video } from '@pui/video';

/**
 * 비디오 재생 상태
 */
export const VideoStateType = {
  PLAYING: 'playing',
  PAUSE: 'pause',
  ENDED: 'ended',
  ERROR: 'error',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type VideoStateType = typeof VideoStateType[keyof typeof VideoStateType];

export type VideoCardProps = Omit<React.MediaHTMLAttributes<HTMLVideoElement>, 'css'> & {
  url: string;
  width?: number; // 비디오 가로 크기
  height?: number; // 비디오 세로 크기
  className?: string;
  muted?: boolean;
  loop?: boolean;
  autoPlay?: boolean; // 브라우저 정책상 autoPlay시 muted는 true값이 어야 동작.
  controls?: boolean;
  poster?: string;
  resetOutsideOfView?: boolean; // 비디오 재생중 뷰포트를 벗어나면 true일때는 비디오 리셋, false는 일시정지 처리한다
  thresholdOfView?: number; // intersection view threshold
  onPlayerState?: (state: VideoStateType) => void;
  onError?: (e: unknown) => void;
};

export const VisualVideo = styled<React.VFC<VideoCardProps>>(
  ({
    url,
    width,
    height,
    className,
    muted = true,
    loop = false,
    autoPlay,
    poster,
    resetOutsideOfView = true,
    thresholdOfView = 0,
    onPlayerState,
    onError,
    ...props
  }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);

    const [isLoading, setIsLoading] = useState(false); // 로딩 여부
    const [playerState, setPlayerState] = useState<VideoStateType>(VideoStateType.PAUSE); // 재생상태
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [errorType, setErrorType] = useState<VideoErrorState | null>(null); // 비디오 에러상태

    const { videoRef, videoElRef, handleVideoPlay, handleVideoReset, handleVideoPaused } = useVideo({
      videoEvents: {
        canplay: () => {},
        play: () => {
          setIsLoading(true);
          setPlayerState(VideoStateType.PLAYING);
          setErrorType(null);
        },
        playing: () => {
          setIsLoading(false);
          setPlayerState(VideoStateType.PLAYING);
          setErrorType(null);
        },
        pause: () => {
          setPlayerState(VideoStateType.PAUSE);
          setErrorType(null);
        },
        timeupdate: () => {
          setIsLoading(false);
        },
        ended: () => {
          setPlayerState(VideoStateType.ENDED);
          setErrorType(null);
        },
        error: (e) => {
          const mediaError = (e.target as HTMLVideoElement)?.error;
          if (mediaError) {
            const { code } = mediaError;
            setPlayerState(VideoStateType.ERROR);
            setErrorType(code as VideoErrorState);
            onError?.(e);
          }
        },
      },
    });

    // 뷰포트 교차에 따라 비디오 정지 처리
    useEffect(() => {
      if (inView && videoElRef.current) {
        handleVideoPlay();
        return;
      }
      if (videoElRef.current) {
        // 뷰포트 벗어날때 리셋 / 일시정지 처리
        if (resetOutsideOfView) {
          if (videoElRef.current.played.length !== 0) {
            handleVideoReset();
          }
          return;
        }
        if (videoElRef.current.played.length !== 0) {
          handleVideoPaused();
        }
      }
    }, [handleVideoPaused, handleVideoPlay, handleVideoReset, inView, resetOutsideOfView, videoElRef]);

    // video Play Statue (to onPlayerState)
    useEffect(() => {
      if (playerState === VideoStateType.PLAYING && !isLoading) {
        if (videoElRef.current) {
          const $video = videoElRef.current;
          const isContainVideoShow = $video.classList.contains('show');
          if (!isContainVideoShow) {
            videoElRef.current.classList.add('show');
          }
        }
        if (sectionRef.current) {
          const $section = sectionRef.current;
          const isSectionShow = $section.classList.contains('show');
          if (!isSectionShow) {
            sectionRef.current.classList.add('show');
          }
        }
      }

      onPlayerState?.(playerState);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playerState, isLoading]);

    // 뷰포트 교차
    useEffect(() => {
      if (sectionRef.current) {
        observer.current = new IntersectionObserver(
          (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry: IntersectionObserverEntry) => setInView(entry.isIntersecting));
          },
          { threshold: thresholdOfView },
        );
        observer.current.observe(sectionRef.current);
      }

      return () => {
        observer.current?.disconnect();
      };
    }, [sectionRef, thresholdOfView]);

    return (
      <div ref={sectionRef} className={className}>
        <div className="video-wrapper">
          <Video
            ref={videoRef}
            className="video"
            lazy
            loop={loop}
            muted={muted}
            autoPlay={autoPlay}
            playsInline
            poster={poster}
            style={{ width: '100%' }}
            src={url}
            {...props}
          />
        </div>
      </div>
    );
  },
)`
  position: relative;
  width: 100%;
  height: 100vh;
  &.show {
    height: 100%;
  }

  .video-wrapper {
    position: relative;
    height: 100%;
    z-index: 1;
  }

  .video {
    position: relative;
    width: 100%;
    height: 100%;
    object-fit: cover;
    vertical-align: middle;
    transition: opacity 1s ease 500ms;
    opacity: 0;
    &.show {
      opacity: 1;
    }
  }

  video::-webkit-media-controls-start-playback-button,
  video::-webkit-media-controls-play-button {
    -webkit-appearance: none;
    display: none !important;
    opacity: 0;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }
`;
