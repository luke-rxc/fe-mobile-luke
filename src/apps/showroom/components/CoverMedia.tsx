import React, { forwardRef, useLayoutEffect } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { useMoveTopElementByScroll } from '@hooks/useMoveTopElementByScroll';
import { Image } from '@pui/image';
import { Video } from '@pui/video';

export interface CoverMediaProps {
  /** 비디오 URL */
  videoURL?: string;
  /** 이미지 URL */
  imageURL?: string;
  /** 비디오&이미지 플레이스 홀더 */
  blurHash?: string;
  /** 이미지 width */
  width?: number;
  /** 이미지 height */
  height?: number;
  /** 클래스명 */
  className?: string;
}

/**
 * CoverMedia 컴포넌트
 */
export const CoverMedia = styled(
  forwardRef<HTMLDivElement, CoverMediaProps>(
    ({ videoURL, imageURL, blurHash, width: imageWidth, height: imageHeight, className }, ref) => {
      const cover = React.useRef<HTMLDivElement>(null);
      const [height, setHeight] = React.useState<number>();
      const [isReady, setReadiedState] = React.useState<boolean>(false);

      /**
       * 비디오가 재생 준비 완료되면 isReady값 업데이트
       */
      const handleCanPlayVideo = () => {
        setReadiedState(true);
      };

      /**
       * 패러렐즈 적용
       */
      useMoveTopElementByScroll({ elementRef: cover });

      /**
       * 커버이미지 높이
       *
       * cover는 이미지타입과 비디오타입이 있고 비디오타입인 경우 비디오 소스와 이미지(비디오포스터)소스가 같이 내려온다.
       * 즉, 이미지 소스는 항상 존재 함으로 이미지의 높이 값을 기준으로 cover의 높이값을 지정함.
       */
      useLayoutEffect(() => {
        const coverHeight = (window.innerWidth * (imageHeight || 0)) / (imageWidth || 1);
        setHeight(Math.min(Math.max(coverHeight, 292), 520));
      }, [imageWidth, imageHeight]);

      return (
        <div ref={ref} className={classnames(className, { 'is-ready': isReady })} style={{ height }}>
          <div ref={cover} className="cover-inner" style={{ height }}>
            <div className="cover-image" style={{ height }}>
              <Image lazy src={imageURL} blurHash={blurHash} fallbackSize="large" alt="" />
            </div>

            {videoURL && (
              <div className="cover-video" style={{ height }}>
                <Video src={videoURL} onCanPlay={handleCanPlayVideo} autoPlay muted loop playsInline />
              </div>
            )}
          </div>
        </div>
      );
    },
  ),
)`
  overflow: hidden;
  position: relative;
  mask-image: linear-gradient(180deg, transparent 0px, #000 0, #000 calc(100% - 19.2rem), transparent 100%);

  .cover-inner {
    ${({ theme }) => theme.mixin.absolute({ t: 0, r: 0, l: 0 })};
  }

  .cover-image,
  .cover-video {
    ${({ theme }) => theme.mixin.absolute({ t: 0, r: 0, l: 0 })};
    overflow: hidden;
    z-index: -1;

    img,
    video {
      display: block;
      width: 100%;
      height: 100%;
      transform: scale(1.01);
      object-fit: cover;
    }
  }

  .cover-video {
    opacity: 0;
    transition: opacity 0s 0.5s;

    video {
      &::-webkit-media-controls-start-playback-button,
      &::-webkit-media-controls-play-button {
        -webkit-appearance: none;
        display: none !important;
        opacity: 0;
      }
    }
  }

  &.is-ready {
    .cover-video {
      opacity: 1;
    }
  }
`;
