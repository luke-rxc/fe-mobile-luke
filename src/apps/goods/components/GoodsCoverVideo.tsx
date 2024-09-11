import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useVideo } from '@features/videoPlayer/hooks';
import { VideoErrorState } from '@features/videoPlayer/constants';
import { Video } from '@pui/video';
import { Info } from '@pui/icon';

type GoodsCoverVideoProps = Omit<React.MediaHTMLAttributes<HTMLVideoElement>, 'css'> & {
  src: string;
  width?: number; // 비디오 가로 크기
  height?: number; // 비디오 세로 크기
  className?: string;
  loop?: boolean;
  controls?: boolean;
  poster?: string;
  isActive: boolean;
  onError?: (e: unknown) => void;
};

export const GoodsCoverVideo = styled<React.VFC<GoodsCoverVideoProps>>(
  ({ src, width, height, className, loop = false, isActive = false, poster, onError, ...props }) => {
    const videoCoverRef = useRef<HTMLDivElement>(null); // 비디오 Cover el
    const [errorType, setErrorType] = useState<VideoErrorState | null>(null); // 비디오 에러상태

    const BinaryImage = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    const { videoRef, videoElRef, handleVideoPlay, handleVideoReset, handleVideoPaused } = useVideo({
      videoEvents: {
        error: (e) => {
          const mediaError = (e.target as HTMLVideoElement)?.error;
          if (mediaError) {
            const { code } = mediaError;
            setErrorType(code as VideoErrorState);
          }
        },
        timeupdate: (e) => {
          const target = e.target as HTMLVideoElement;
          const { currentTime } = target;
          if (videoCoverRef.current && currentTime && currentTime > 0.5) {
            videoCoverRef.current.classList.add('playing');
          }
        },
      },
    });

    const handleVideoStopAndReset = useCallback(() => {
      if (videoElRef.current) {
        if (!isActive) {
          if (videoElRef.current.played.length !== 0) {
            if (videoCoverRef.current) {
              videoCoverRef.current.classList.remove('playing');
            }
            handleVideoReset();
          }
          return;
        }
        if (videoElRef.current.played.length !== 0) {
          if (videoCoverRef.current) {
            videoCoverRef.current.classList.remove('playing');
          }
          handleVideoPaused();
        }
      }
    }, [handleVideoPaused, handleVideoReset, isActive, videoElRef]);

    useEffect(() => {
      if (errorType !== null) {
        return;
      }
      if (isActive && videoElRef.current) {
        handleVideoPlay();
        return;
      }
      handleVideoStopAndReset();
    }, [errorType, handleVideoPlay, handleVideoStopAndReset, isActive, videoElRef]);

    useEffect(() => {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          isActive && videoElRef.current && handleVideoPlay();
        } else {
          handleVideoStopAndReset();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        document.addEventListener('visibilitychange', handleVisibilityChange);
      };
    }, [isActive, handleVideoPlay, handleVideoStopAndReset, videoElRef]);

    return (
      <div className={className}>
        <div className="loading-cover" ref={videoCoverRef}>
          <img aria-hidden src={poster ?? BinaryImage} alt="" />
        </div>
        <Video
          ref={videoRef}
          className="video"
          loop={loop}
          muted
          autoPlay
          playsInline
          poster={poster}
          style={{ width: '100%' }}
          src={src}
          {...props}
        />
        {errorType && (
          <div className="error">
            <>
              {errorType === VideoErrorState.MEDIA_ERR_ABORTED && (
                <>
                  <Info name="info" size="6.4rem" colorCode="#fff" /> MEDIA_ERR_ABORTED
                </>
              )}
              {errorType === VideoErrorState.MEDIA_ERR_NETWORK && (
                <>
                  <Info name="info" size="6.4rem" colorCode="#fff" /> MEDIA_ERR_NETWORK
                </>
              )}
              {errorType === VideoErrorState.MEDIA_ERR_DECODE && (
                <>
                  <Info name="info" size="6.4rem" colorCode="#fff" /> MEDIA_ERR_DECODE
                </>
              )}
              {errorType === VideoErrorState.MEDIA_ERR_SRC_NOT_SUPPORTED && (
                <>
                  <Info name="info" size="6.4rem" colorCode="#fff" /> MEDIA_ERR_SRC_NOT_SUPPORTED
                </>
              )}
            </>
          </div>
        )}
      </div>
    );
  },
)`
  width: 100%;
  height: 100%;

  & .loading-cover {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    opacity: 1;
    z-index: 1;
    background: ${({ theme }) => theme.color.background.bg};
    &.playing {
      transition: opacity 500ms ease;
      opacity: 0;
    }
    & > img {
      width: 100%;
      height: 100%;
    }
  }

  & video {
    width: 100%;
    height: 100%;
    object-fit: cover;

    &::-webkit-media-controls-fullscreen-button {
      display: inline !important;
    }
  }

  & .error {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  & video::-webkit-media-controls-start-playback-button,
  & video::-webkit-media-controls-play-button {
    -webkit-appearance: none;
    display: none !important;
    opacity: 0;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }
`;
