import { VideoErrorState, VideoPlayState } from '@features/videoPlayer/constants';
import { createDebug } from '@utils/debug';
import Hls from 'hls.js';
import { useCallback, useEffect, useRef, useState } from 'react';

const debug = createDebug();

interface Props {
  streamUrl?: string | null;
  handleUpdateLoadedStreamVideo: () => void;
}

export const useVideo = ({ streamUrl, handleUpdateLoadedStreamVideo }: Props) => {
  const hls = useRef<Hls | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentViewTime = useRef<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [playerState, setPlayerState] = useState<VideoPlayState>(VideoPlayState.PAUSE);
  const [canPlay, setCanPlay] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<VideoErrorState | null>(null);

  const onLoadingVideo = () => {
    debug.log('onLoadingVideo');
    setIsLoading(true);
  };

  const onLoadedMetadata = () => {
    debug.log('onLoadedMetadata');
    setIsLoading(false);
    setCanPlay(true);
    setPlayerState(VideoPlayState.CAN_PLAY);
  };

  const onCanPlay = () => {
    debug.log('onCanPlay');
    setIsLoading(false);
    setCanPlay(true);
    setPlayerState(VideoPlayState.CAN_PLAY);
  };

  const onPlay = () => {
    debug.log('onPlay');
    setVideoError(null);
    setPlayerState(VideoPlayState.PLAYING);
  };

  const onPlaying = () => {
    debug.log('onPlaying');
    handleUpdateLoadedStreamVideo();
  };

  const onPause = () => {
    debug.log('onPause');
    setVideoError(null);
    setPlayerState(VideoPlayState.PAUSE);
  };

  const onTimeUpdate = ({ target }: Event) => {
    // debug.log('onTimeUpdate');
    const videoEl = target as HTMLVideoElement;
    const { currentTime } = videoEl;
    currentViewTime.current = currentTime;
  };

  const updateCanPlay = (canplay: boolean) => {
    setCanPlay(canplay);
  };

  const onError = ({ target }: Event) => {
    debug.log('onError');
    setIsLoading(false);
    const videoEl = target as HTMLVideoElement;
    const mediaError = videoEl?.error;
    if (!mediaError) return;
    const { code } = mediaError;
    setCanPlay(false);
    setPlayerState(VideoPlayState.ERROR);
    setVideoError(code as VideoErrorState);
  };

  const handleStartVideo = () => {
    debug.log('handleStartVideo');
    handleLoad();
  };

  const handleVideoPaused = useCallback(() => {
    debug.log('handleVideoPaused');
    const videoEl = videoRef.current;
    if (!videoEl) return;

    videoEl.pause();

    if (Hls.isSupported()) {
      hls.current?.destroy();
    }
  }, []);

  const handleRetry = useCallback(() => {
    setCanPlay(false);
    setPlayerState(VideoPlayState.PAUSE);
    setVideoError(null);
  }, []);

  const handleLoad = () => {
    if (videoRef.current && streamUrl) {
      if (Hls.isSupported()) {
        initVideo();
      } else {
        videoRef.current.src = streamUrl;
        videoRef.current.play();
      }
    }
  };

  const initVideo = useCallback(() => {
    if (videoRef.current && streamUrl) {
      if (Hls.isSupported()) {
        hls.current = new Hls();
        hls.current.loadSource(streamUrl);
        hls.current.attachMedia(videoRef.current);
        hls.current.startLoad(-1);
        hls.current.on(Hls.Events.ERROR, (event, data) => {
          debug.log(event, data);
        });
        hls.current.on(Hls.Events.MANIFEST_PARSED, () => {
          videoRef?.current?.play().catch(() => {});
        });
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = streamUrl;
      }
    }
  }, [streamUrl, videoRef]);

  const addEvents = () => {
    debug.log('addEvents');
    if (!videoRef.current) {
      return;
    }

    videoRef.current.addEventListener('loadstart', onLoadingVideo);
    videoRef.current.addEventListener('loadedmetadata', onLoadedMetadata);
    videoRef.current.addEventListener('canplay', onCanPlay);
    videoRef.current.addEventListener('play', onPlay);
    videoRef.current.addEventListener('playing', onPlaying);
    videoRef.current.addEventListener('pause', onPause);
    videoRef.current.addEventListener('timeupdate', onTimeUpdate);
    videoRef.current.addEventListener('error', onError);
  };

  const removeEvents = () => {
    debug.log('removeEvents');
    if (!videoRef.current) {
      return;
    }

    videoRef.current.removeEventListener('loadstart', onLoadingVideo);
    videoRef.current.removeEventListener('loadedmetadata', onLoadedMetadata);
    videoRef.current.removeEventListener('progress', onLoadingVideo);
    videoRef.current.removeEventListener('canplay', onCanPlay);
    videoRef.current.removeEventListener('play', onPlay);
    videoRef.current.removeEventListener('playing', onPlaying);
    videoRef.current.removeEventListener('pause', onPause);
    videoRef.current.removeEventListener('timeupdate', onTimeUpdate);
    videoRef.current.removeEventListener('error', onError);
  };

  useEffect(() => {
    addEvents();

    return () => {
      removeEvents();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef.current]);

  /**
   * 스트리밍 video 세팅
   */
  useEffect(() => {
    initVideo();

    return () => {
      hls.current && hls.current.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initVideo, videoRef.current]);

  return {
    hls,
    videoRef,
    isLoading,
    playerState,
    canPlay,
    currentViewTime,
    videoError,
    initVideo,
    updateCanPlay,
    handleLoad,
    handleStartVideo,
    handleVideoPaused,
    handleRetry,
  };
};
