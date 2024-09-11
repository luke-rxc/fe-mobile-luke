import { Video } from '@pui/video';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { Image } from '@pui/image';
import { getImageLink } from '@utils/link';
import { RaffleMediaModel } from '../models';
import { startDelayDuration } from '../constants';

interface WinnerAnnounceVideoProps {
  goodsMedia: RaffleMediaModel;
  onScrollStop: () => void;
  onScrollStart: () => void;
}

export const WinnerAnnounceVideo = styled(
  ({
    goodsMedia,
    onScrollStop: handleScrollStop,
    onScrollStart: handleScrollStart,
    ...props
  }: WinnerAnnounceVideoProps) => {
    const { path, thumbnailImage, chromaKey } = goodsMedia;

    const imageRef = useRef<HTMLImageElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const originVideoRef = useRef<HTMLCanvasElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const videoSource = useMemo(() => {
      return path && getImageLink(path);
    }, [path]);

    // 크로마키 비디오 처리
    useEffect(() => {
      const videoEl = videoRef.current;
      if (videoEl && videoEl instanceof HTMLVideoElement) {
        removeEvents();
        doLoad();
      }
      return () => {
        removeEvents();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoRef]);

    const handleStart = () => {
      setTimeout(() => {
        handleScrollStart();
      }, startDelayDuration);
    };

    const timerCallback = useCallback(() => {
      const videoEl = videoRef.current;
      if (videoEl?.paused || videoEl?.ended) {
        return;
      }
      computeFrame();
      setTimeout(() => {
        timerCallback();
      }, 0);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoRef]);

    const doLoad = useCallback(() => {
      const videoEl = videoRef.current;
      if (videoEl) {
        videoEl.addEventListener(
          'play',
          () => {
            chromaKey && timerCallback();
          },
          true,
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoRef]);

    const removeEvents = useCallback(() => {
      const videoEl = videoRef.current;
      if (videoEl) {
        videoEl.removeEventListener(
          'play',
          () => {
            chromaKey && timerCallback();
          },
          true,
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoRef]);

    const computeFrame = (loaded?: boolean) => {
      const imageEl = imageRef.current;
      const videoEl = videoRef.current;
      const originVideoEl = originVideoRef.current;
      const canvasEl = canvasRef.current;

      if (videoEl && originVideoEl && canvasEl) {
        const originCtx = originVideoEl.getContext('2d');
        const ctx = canvasEl.getContext('2d');

        let frame;
        if (loaded && imageEl) {
          /**
           * videoEl로 그릴경우 간혹 loaded 되어도 ImageData안의 rgb값이 전부 0으로 나와 썸네일로 대체
           * */
          originCtx?.drawImage(imageEl, 0, 0, canvasEl.width, canvasEl.height);
          frame = originCtx?.getImageData(0, 0, canvasEl.width, canvasEl.height);
        } else {
          originCtx?.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
          frame = originCtx?.getImageData(0, 0, canvasEl.width, canvasEl.height);
        }

        if (frame) {
          if (chromaKey) {
            for (let i = 0; i < frame.data.length; i += 4) {
              const r = frame.data[i]; // red
              const g = frame.data[i + 1]; // green
              const b = frame.data[i + 2]; // blue
              /**
               * grenn screen rgb 기준값
               * @default #04F404(rgb(4, 244, 4))
               */
              if (r <= 100 && g >= 175 && b <= 100) {
                frame.data[i + 3] = 0; // alpha
              }
            }
          } else {
            videoEl
              .play()
              .then(() => {
                videoEl.style.opacity = '1';
                canvasEl.style.visibility = 'hidden';
              })
              .catch(() => {});
          }
          ctx?.putImageData(frame, 0, 0);
        }
        loaded && handleStart();
      }
    };

    /**
     * 저전력모드일 경우 크로마키 배경만 뺀 canvas 생성(동영상 재생 X)
     * */
    const handleLoaded = () => {
      computeFrame(true);
    };

    return (
      <div {...props}>
        {thumbnailImage && <Image ref={imageRef} src={thumbnailImage.path} crossOrigin="anonymous" />}

        <Video
          ref={videoRef}
          src={videoSource}
          onLoadStart={handleScrollStop}
          onLoadedData={handleLoaded}
          crossOrigin="annoymous"
          autoPlay
          muted
          loop
          playsInline
        />

        <canvas ref={originVideoRef} className="origin-canvas" />
        <canvas ref={canvasRef} />
      </div>
    );
  },
)`
  margin: 0 auto;
  width: 32rem;
  height: 16rem;
  ${({ theme }) => theme.mixin.centerItem()};
  flex-direction: column;
  ${({ theme }) => theme.mixin.position('relative')};

  ${Image} {
    width: 27.2rem;
    height: 16rem;
    object-fit: fill;
    opacity: 0;
  }

  ${Video} {
    width: 27.2rem;
    height: 16rem;
    object-fit: fill;
    opacity: 0;
  }

  canvas {
    width: 27.2rem;
    height: 16rem;
    ${({ theme }) => theme.mixin.center()};
  }

  .origin-canvas {
    visibility: hidden;
  }
`;
