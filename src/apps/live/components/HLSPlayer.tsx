/* eslint-disable jsx-a11y/media-has-caption */
import { CSSProperties, useCallback, useEffect, useState } from 'react';
import { VideoController } from '@features/videoPlayer/components/VideoController';
import { VideoPlayState } from '@features/videoPlayer/constants';
import styled from 'styled-components';
import classNames from 'classnames';
import { ReturnTypeUseLiveService } from '../services';

export type HLSPlayerProps = Omit<ReturnTypeUseLiveService['viewer'], 'liveMode'> & {
  style?: CSSProperties;
  onPlayStreamVideo: () => number;
  onPauseStreamVideo: () => void;
};

export const HLSPlayer = ({
  muted = true,
  style,
  reloadVideo,
  videoProps,
  fullscreenProps,
  isPortait,
  onPlayStreamVideo: handlePlayStreamVideo,
  onPauseStreamVideo: handlePauseStreamVideo,
  onUpdateReloadVideo: handleUpdateReloadVideo,
  onToggleUiView: handleToggleUiView,
}: HLSPlayerProps) => {
  const [inView, setInView] = useState<boolean>(true);

  const {
    videoRef,
    isLoading,
    playerState,
    canPlay,
    initVideo,
    updateCanPlay,
    handleLoad,
    handleStartVideo,
    handleVideoPaused,
  } = videoProps;

  const { wrapperRef } = fullscreenProps;
  const isError = playerState === VideoPlayState.ERROR;

  useEffect(() => {
    if (playerState === VideoPlayState.PAUSE) {
      videoRef.current?.play().catch(() => {});
    }
  }, [playerState, videoRef]);

  /**
   * visibility change event
   */
  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'hidden') {
      updateCanPlay(false);
      setInView(false);
      handleVideoPaused();
      handlePauseStreamVideo();
    } else {
      setInView(true);
      handleLoad();
      handlePlayStreamVideo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handlePauseStreamVideo, handlePlayStreamVideo]);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange, false);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange, false);
    };
  }, [handleVisibilityChange]);

  useEffect(() => {
    if (reloadVideo) {
      initVideo();
      handleUpdateReloadVideo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadVideo]);

  /**
   * 재생 준비에 따른 영상 재생
   */
  useEffect(() => {
    if (videoRef.current) {
      /**
       * ios 저전력 배터리 모드에서 HLS Video를 실행시 NotAllowedError 에러가 발생
       * => play()에 catch 적용
       */
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      inView && canPlay ? videoRef.current.play().catch(() => {}) : videoRef.current.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canPlay, videoRef.current]);

  return (
    // playsInline : unhandled rejection (not allowed error)
    <WrapperStyled ref={wrapperRef} className={classNames({ landscape: !isPortait })}>
      <video
        ref={videoRef}
        muted={muted}
        playsInline
        style={style}
        onClick={isError ? undefined : handleToggleUiView}
      />
      <VideoController
        ref={null}
        className="controller"
        isLoading={isLoading}
        onPlay={handleStartVideo}
        onPause={handleVideoPaused}
        state={playerState}
        error={null}
      />
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  position: relative;
  width: 100%;

  &.landscape {
    height: 100%;
  }
`;
