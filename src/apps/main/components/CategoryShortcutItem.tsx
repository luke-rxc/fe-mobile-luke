/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
import Hls from 'hls.js';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import noop from 'lodash/noop';
import classnames from 'classnames';
import { Image } from '@pui/image';
import { Action, ActionProps } from '@pui/action';
import { useInView } from '../hooks';

export interface CategoryShortcutItemProps extends Omit<Extract<ActionProps, { is?: 'a' }>, 'is' | 'onClick'> {
  id: string;
  image: string;
  index?: number;
  title?: string;
  blurHash?: string;
  className?: string;
  onClick?: (item: CategoryShortcutItemProps) => void;
  video?: string;
}

const CategoryShortcutItemComponent: React.FC<CategoryShortcutItemProps> = (props) => {
  const { index, image, blurHash, title, video, className, onClick, ...rest } = props;
  const hls = useRef<Hls | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setReadiedState] = useState<boolean>(false);

  const inView = useInView(videoRef);

  const isStreaming = useMemo<boolean>(() => {
    return !!video && video.endsWith('.m3u8');
  }, [video]);

  /**
   * 비디오가 재생 준비 완료되면 isReady값 업데이트
   */
  const handleCanPlayVideo = () => {
    setReadiedState(true);
  };

  /**
   * HLS 세팅
   */
  useEffect(() => {
    if (video && isStreaming && videoRef.current) {
      if (Hls.isSupported()) {
        hls.current = new Hls();
        hls.current.loadSource(video);
        hls.current.attachMedia(videoRef.current);
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = video;
      }
    }

    return () => {
      isStreaming && hls.current && hls.current.destroy();
    };
  }, [video]);

  /**
   * 비디오 재생/정지
   */
  useEffect(() => {
    inView && isReady ? videoRef.current?.play().catch(noop) : videoRef.current?.pause();
  }, [inView, isReady]);

  const handleClick = () => {
    onClick?.(props);
  };

  return (
    <Action is="a" className={className} {...rest} onClick={handleClick}>
      <span className="shortcut-media" aria-hidden>
        <span className="media-image">
          <Image src={image} blurHash={blurHash} />
        </span>
        {video && (
          <span className={classnames('media-video', { 'is-ready': isReady })}>
            <video ref={videoRef} muted loop playsInline onLoadedMetadata={handleCanPlayVideo}>
              {!isStreaming && <source src={video} type="video/mp4" />}
            </video>
          </span>
        )}
      </span>
      {title && <span className="shortcut-title">{title}</span>}
    </Action>
  );
};

export const CategoryShortcutItem = styled(CategoryShortcutItemComponent)`
  display: block;
  overflow: hidden;
  position: relative;
  z-index: 1;
  width: 14.4rem;
  height: 9.6rem;
  border-radius: ${({ theme }) => theme.radius.r8};
  transform: scale(1);
  transition: transform 200ms;

  &::after {
    ${({ theme }) => theme.mixin.absolute({ b: 0, l: 0 })}
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 200ms;
    background: ${({ theme }) => theme.color.states.pressedMedia};
    content: '';
  }

  &:active {
    transform: scale(0.96);

    &::after {
      opacity: 1;
    }
  }

  .shortcut-title {
    ${({ theme }) => theme.mixin.ellipsis()}
    ${({ theme }) => theme.mixin.absolute({ b: 0, l: 0 })}
    z-index: 2;
    overflow: hidden;
    box-sizing: border-box;
    width: 100%;
    padding: ${({ theme }) => theme.spacing.s8};
    font: ${({ theme }) => theme.fontType.smallB};
    color: ${({ theme }) => theme.light.color.white};
    transform: translate3d(0, 0, 0);
  }

  .shortcut-media {
    ${({ theme }) => theme.mixin.center()};
    transform: ${({ index = 0 }) => `translate3d(var(--progress${index + 1}, -50%), -50%, 0)`};
    transition-duration: var(--duration, 0ms);
    width: 100%;
    height: 100%;
  }

  .media-image,
  .media-video {
    ${({ theme }) => theme.mixin.center()};
    height: 100%;

    ${Image} {
      width: auto;
    }

    img,
    video {
      width: auto;
      max-width: initial;
      height: 100%;
      object-fit: cover;
    }

    .image-blurhash {
      width: 100%;
    }
  }

  .media-video {
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

    &.is-ready {
      opacity: 1;
    }
  }
`;
