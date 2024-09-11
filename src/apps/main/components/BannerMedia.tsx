/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import Hls from 'hls.js';
import noop from 'lodash/noop';
import styled from 'styled-components';
import classnames from 'classnames';
import { forwardRef, useRef, useState, useMemo, useEffect } from 'react';
import { Image } from '@pui/image';

export interface BannerMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 미디어 경로 */
  path: string;
  /** 파일 타입 */
  type?: 'VIDEO' | 'IMAGE' | 'ETC';
  /** 파일 확장자 */
  extension?: string;
  /** blurHash */
  blurHash?: string | null;
  /** 비디오 타입을 위한 썸네일 이미지 데이터 */
  poster?: { path: string; blurHash?: string | null } | null;
  /** view에 표시 여부 */
  inView?: boolean;
}

/**
 * Main Banner Media
 */
export const BannerMedia = styled(
  forwardRef<HTMLDivElement, BannerMediaProps>(({ type, path, extension, blurHash, poster, inView, ...props }, ref) => {
    const hls = useRef<Hls | null>(null);
    const video = useRef<HTMLVideoElement>(null);
    const image = useRef<HTMLImageElement>(null);
    const [isReadied, setIsReadied] = useState<boolean>(false);

    /**
     * 스트리밍 video 여부
     */
    const isStreaming = useMemo<boolean>(() => {
      return extension === 'm3u8';
    }, [type, extension]);

    /**
     * 비디오가 재생 준비 완료되면 isReadied값 업데이트
     */
    const handleCanPlayVideo = () => {
      setIsReadied(true);
    };

    /**
     * 스트리밍 video 세팅
     */
    useEffect(() => {
      if (isStreaming && video.current) {
        if (Hls.isSupported()) {
          hls.current = new Hls();
          hls.current.loadSource(path);
          hls.current.attachMedia(video.current);
        } else if (video.current.canPlayType('application/vnd.apple.mpegurl')) {
          video.current.src = path;
        }
      }

      return () => {
        isStreaming && hls.current && hls.current.destroy();
      };
    }, [isStreaming, path]);

    /**
     * inView에 따른 영상 재생
     */
    useEffect(() => {
      if (video.current) {
        /**
         * ios 저전력 배터리 모드에서 HLS Video를 실행시 NotAllowedError 에러가 발생
         * => play()에 catch 적용
         */
        inView && isReadied ? video.current.play().catch(noop) : video.current.pause();
      }
    }, [inView, isReadied, video.current]);

    return (
      <div ref={ref} {...props}>
        {type === 'IMAGE' && (
          <div className="banner-image">
            <Image ref={image} lazy src={path} blurHash={blurHash} />
          </div>
        )}

        {(type === 'VIDEO' || isStreaming) && poster && (
          <div className="banner-image">
            <Image ref={image} lazy src={poster.path} blurHash={poster.blurHash} />
          </div>
        )}

        {(type === 'VIDEO' || isStreaming) && (
          <div className={classnames('banner-video', { 'is-readied': isReadied })}>
            {/*
             * hls를 사용시 onCanPlay 이벤트가 emit되지 않아 onLoadedMetadata이벤트를 활용
             * ref: https://github.com/video-dev/hls.js/issues/1686
             */}
            <video ref={video} muted loop playsInline onLoadedMetadata={handleCanPlayVideo}>
              {!isStreaming && <source src={path} type="video/mp4" />}
            </video>
          </div>
        )}
      </div>
    );
  }),
)`
  position: relative;
  overflow: hidden;
  width: 100%;
  padding-top: 133.3333%;

  .banner-image,
  .banner-video {
    ${({ theme }) => theme.mixin.absolute({ t: 0, l: 0, b: 0 })};
    overflow: hidden;
    width: 100%;
    height: 100%;

    img,
    video {
      display: block;
      width: 100%;
      height: 100%;
      transform: scale(1.01);
      object-fit: cover;
    }
  }

  .banner-video {
    opacity: 0;
    transition: opacity 0s 0.5s;

    &.is-readied {
      opacity: 1;
    }

    video {
      &::-webkit-media-controls-start-playback-button,
      &::-webkit-media-controls-play-button {
        -webkit-appearance: none;
        display: none !important;
        opacity: 0;
      }
    }
  }
`;
