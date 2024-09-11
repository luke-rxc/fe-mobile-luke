import Hls from 'hls.js';
import classnames from 'classnames';
import { useEffect, useMemo, useRef, useState } from 'react';
import styled, { useTheme, keyframes } from 'styled-components';
import { SVG } from '@pui/svg';
import { Image } from '@pui/image';
import { Video } from '@pui/video';
import { Action } from '@pui/action';
import { Lottie, LottieRef } from '@pui/lottie';

export interface ShortcutBannerItemProps {
  id: number;
  titleType: 'none' | 'lottie' | 'svg' | 'text';
  title: string;
  description?: string;
  titleImage?: {
    path: string;
  };
  primaryMedia: {
    path: string;
    extension: string;
    blurHash?: string;
    fileType?: string;
    videoRepeatType: 'once' | 'loop';
    thumbnailImage?: {
      path: string;
      blurHash?: string;
      fileType?: string;
    };
  };
  link: string;
  // 이벤트 로깅을 위한 데이터
  'data-index': number;
  'data-type': string;
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  item: ShortcutBannerItemProps;
  onlyOne: boolean;
  isPlay: boolean;
  lottieData?: { default: unknown };
  onReady?: () => void;
  onClickLink?: () => void;
  onCountLoaded?: () => void;
}

const FadeIn = keyframes`
  0% { width: 100%; height: 0; }
  100% { width: 100%; height: var(--shortcut-height); }
`;

const firstItemFadeIn = keyframes`
  0% { width: 100%; height: 0; }
  100% { width: 50%; height: var(--shortcut-height); }
`;

const secondItemFadeIn = keyframes`
  0% { width: 0; height: 0; }
  100% { width: 50%; height: var(--shortcut-height); }
`;

const contentFadeIn = keyframes`
  0% { opacity: 0 }
  100% { opacity: 1 }
`;

export const ShortcutBannerItem = styled(
  ({
    item,
    lottieData,
    onlyOne,
    isPlay,
    onReady: handleOnReady,
    onClickLink: handleClickLink,
    onCountLoaded: handleCountLoaded,
    className,
    ...props
  }: Props) => {
    const theme = useTheme();
    const { titleType, title, description, titleImage, primaryMedia } = item;
    const { fileType, extension, path, blurHash, videoRepeatType, thumbnailImage } = primaryMedia;

    const hlsRef = useRef<Hls | null>(null);
    const itemRef = useRef<HTMLDivElement>(null);
    const mediaRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const lottieRef = useRef<LottieRef>(null);

    const [isError, setIsError] = useState<boolean>(false);

    const isLoop = videoRepeatType === 'loop';

    /**
     * 스트리밍 video 여부
     */
    const isStreaming = useMemo<boolean>(() => {
      return extension === 'm3u8';
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fileType, extension]);

    useEffect(() => {
      if (isStreaming && videoRef.current) {
        if (Hls.isSupported()) {
          hlsRef.current = new Hls();
          hlsRef.current.loadSource(path);
          hlsRef.current.attachMedia(videoRef.current);
          hlsRef.current.on(Hls.Events.ERROR, () => {
            setIsError(true);
            videoRef.current?.pause();
            hlsRef.current?.destroy();
          });
        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
          videoRef.current.src = path;
        }
      }

      return () => {
        isStreaming && hlsRef.current && hlsRef.current.destroy();
      };
    }, [isStreaming, path]);

    const handleAnimationEnd = (e: React.AnimationEvent<HTMLElement>) => {
      e.target === itemRef.current && handleOnReady?.();
    };

    const handlePlayMedia = () => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
      const player = lottieRef.current?.player;
      player && player.play();
    };

    const handleStopMedia = () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      const player = lottieRef.current?.player;
      player && player.pause();
    };

    useEffect(() => {
      if (isPlay) {
        handlePlayMedia();
      } else {
        handleStopMedia();
      }
    }, [isPlay, lottieData]);

    return (
      <div
        ref={itemRef}
        className={classnames(className, { 'is-more': !onlyOne })}
        onAnimationEnd={handleAnimationEnd}
        {...props}
      >
        <Action is="a" link={item.link} onClick={handleClickLink}>
          <div ref={mediaRef} className="shortcut-media">
            {fileType === 'IMAGE' && (
              <Image className="shortcut-image" lazy src={path} blurHash={blurHash} onLoad={handleCountLoaded} />
            )}

            {(fileType === 'VIDEO' || isStreaming) && thumbnailImage && (
              <Image className="shortcut-image" lazy src={thumbnailImage.path} blurHash={thumbnailImage.blurHash} />
            )}

            {(fileType === 'VIDEO' || isStreaming) && (
              <Video
                ref={videoRef}
                className={classnames('shortcut-video', { 'is-error': isError })}
                onLoadedMetadata={handleCountLoaded}
                loop={isLoop}
                muted
                playsInline
              />
            )}
          </div>

          <div className="shortcut-content">
            {titleType === 'text' && <p className="shortcut-title is-text">{title}</p>}

            {titleType === 'svg' && titleImage && (
              <div className="shortcut-title">
                <SVG src={titleImage.path} className="shortcut-svg" />
              </div>
            )}

            {titleType === 'lottie' && titleImage && lottieData?.default && (
              <div className="shortcut-title">
                <Lottie
                  ref={lottieRef}
                  className="shortcut-lottie"
                  lottieData={lottieData}
                  lottieColor={theme.light.color.white}
                  animationOptions={{ autoplay: false }}
                />
              </div>
            )}

            {description && <p className="description">{description}</p>}
          </div>
        </Action>
      </div>
    );
  },
)`
  --shortcut-height: 9.6rem;

  ${({ theme }) => theme.mixin.relative()};
  ${({ theme }) => theme.mixin.centerItem()};
  overflow: hidden;
  width: 0;
  height: 0;
  border-radius: 8px;
  color: ${({ theme }) => theme.light.color.white};
  filter: drop-shadow(0rem 0.2rem 1.6rem rgba(0, 0, 0, 0.16));
  animation: 0.7s ease-out ${FadeIn} forwards;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.96);
  }

  ${Action} {
    ${({ theme }) => theme.mixin.centerItem()};
    height: var(--shortcut-height);
    width: 100%;
  }

  .shortcut-media {
    ${({ theme }) => theme.mixin.relative()};
    flex-shrink: 0;
    // 디바이스 해상도에 따른 미세 여백을 제거하기 위해 1px 추가
    width: calc(100% + 0.1rem);
    height: calc(100% + 0.1rem);

    .shortcut-video {
      ${({ theme }) => theme.mixin.absolute({ t: 0, l: 0 })};
      object-fit: cover;

      &.is-error {
        display: none;
      }
    }

    .shortcut-image {
      ${({ theme }) => theme.mixin.absolute({ t: 0, l: 0 })};

      img {
        object-fit: cover;
      }
    }
  }

  .shortcut-content {
    ${({ theme }) => theme.mixin.center()};
    ${({ theme }) => theme.mixin.centerItem()};
    flex-direction: column;
    z-index: 2;
    width: 100%;
    height: var(--shortcut-height);
    padding: 0 1.6rem;
    opacity: 0;
    animation: 0.5s linear 0.5s ${contentFadeIn} forwards;
  }

  .shortcut-title {
    overflow: hidden;
    width: 22.4rem;

    &.is-text {
      width: 100% !important;
      height: 2.9rem;
      text-align: center;
      font: ${({ theme }) => theme.fontType.titleB};
      ${({ theme }) => theme.mixin.ellipsis()};
    }

    .shortcut-lottie {
      display: block;
      width: 100%;
      height: 100%;

      div {
        ${({ theme }) => theme.mixin.centerItem()};
        width: inherit;
        height: inherit;
      }

      // 일부 로띠에서 사이즈 이슈로 인한 위한 CSS 추가
      svg {
        display: block;
        width: auto !important;
        height: auto !important;
        max-width: 100%;
        max-height: 100%;
      }
    }

    .shortcut-svg {
      ${({ theme }) => theme.mixin.centerItem()};
      display: block;
      width: 100%;
      height: 100%;

      & *[fill] {
        fill: ${({ theme }) => theme.color.whiteLight};
      }

      & *[stroke] {
        stroke: ${({ theme }) => theme.color.whiteLight};
      }
    }
  }

  .description {
    ${({ theme }) => theme.mixin.ellipsis()};
    flex-shrink: 0;
    width: 100%;
    height: 1.4rem;
    text-align: center;
    font: ${({ theme }) => theme.fontType.mini};

    &:not(:first-child) {
      margin-top: 0.2rem;
    }
  }

  &.is-more {
    &:first-child {
      animation: 0.7s cubic-bezier(0.39, 0.58, 0.57, 1) ${firstItemFadeIn} forwards;
    }

    &:nth-child(2) {
      animation: 0.7s cubic-bezier(0.39, 0.58, 0.57, 1) ${secondItemFadeIn} forwards;
    }

    .shortcut-content {
      padding: 0 1.2rem;
    }

    .shortcut-title {
      width: 9.6rem;
    }
  }
`;
