/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
import Hls from 'hls.js';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import noop from 'lodash/noop';
import classnames from 'classnames';
import { Image } from '@pui/image';
import { Divider } from '@pui/divider';
import { useInView } from '../hooks';

export interface SectionHeaderProps {
  image?: string;
  video?: string;
  title?: string;
  blurHash?: string;
  description?: string;
  className?: string;
}

const SectionHeaderComponent: React.FC<SectionHeaderProps> = ({
  image,
  video,
  blurHash,
  title,
  description,
  className,
}) => {
  const hls = useRef<Hls | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setReadiedState] = useState<boolean>(false);

  const theme = useTheme();
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

  return (
    <div className={className}>
      <div className="header-media">
        <div className="media-image">
          <Image lazy src={image} blurHash={blurHash} />
        </div>
        {video && (
          <div className={classnames('media-video', { 'is-ready': isReady })}>
            <video ref={videoRef} muted loop playsInline onLoadedMetadata={handleCanPlayVideo}>
              {!isStreaming && <source src={video} type="video/mp4" />}
            </video>
          </div>
        )}
      </div>
      {(title || description) && (
        <>
          <div className="header-info">
            {title && <div className="info-title">{title}</div>}
            {description && <div className="info-description">{description}</div>}
          </div>
          <Divider b={theme.spacing.s12} />
        </>
      )}
    </div>
  );
};

export const SectionHeader = styled(SectionHeaderComponent)`
  .header-media {
    overflow: hidden;
    position: relative;
    height: 14.4rem;

    &:only-child {
      margin-bottom: ${({ theme }) => theme.spacing.s12};
    }
  }

  .media-image,
  .media-video {
    ${({ theme }) => theme.mixin.center()}
    display: block;
    overflow: hidden;
    width: 100%;
    height: 100%;

    img,
    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .media-video {
    opacity: 0;
    transition: opacity 200ms;

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

  .header-info {
    padding: ${({ theme }) => theme.spacing.s24};
  }

  .info-title {
    ${({ theme }) => theme.mixin.multilineEllipsis(2, 24)};
    ${({ theme }) => theme.mixin.wordBreak()};
    font: ${({ theme }) => theme.fontType.title2B};
    color: ${({ theme }) => theme.color.text.textPrimary};
    white-space: pre-line;
    width: 100%;

    &:not(:only-child) {
      margin-bottom: ${({ theme }) => theme.spacing.s8};
    }
  }

  .info-description {
    ${({ theme }) => theme.mixin.wordBreak()};
    font: ${({ theme }) => theme.fontType.medium};
    color: ${({ theme }) => theme.color.text.textPrimary};
    white-space: pre-line;
  }
`;
