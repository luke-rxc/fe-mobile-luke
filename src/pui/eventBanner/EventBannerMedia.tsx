import { forwardRef, useRef, useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import classnames from 'classnames';
import { Image } from '@pui/image';
import { Lottie, LottieRef } from '@pui/lottie';

export interface ImageProps {
  path: string;
  blurHash?: string;
}

export interface LottieDataProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: any;
}

export type EventBannerMediaType = 'IMAGE' | 'SVG' | 'VIDEO' | 'LOTTIE';

export interface EventBannerMediaProps extends ImageProps, React.HTMLAttributes<HTMLDivElement> {
  type: EventBannerMediaType;
  thumbnailImage?: ImageProps;
  loop?: boolean;
  play: boolean;
}

const EventBannerMediaComponent = forwardRef<HTMLDivElement, EventBannerMediaProps>(
  ({ type, thumbnailImage, path, blurHash, loop = false, play, ...props }, ref) => {
    const video = useRef<HTMLVideoElement>(null);
    const lottie = useRef<LottieRef>(null);
    const [lottieData, setLottieData] = useState<LottieDataProps | null>(null);

    const resetVideo = () => {
      if (video.current) {
        video.current.currentTime = 0;
        video.current.pause();
      }
    };

    const resetLottie = () => {
      if (lottie.current && lottie.current.player) {
        lottie.current.player.goToAndStop(0);
      }
    };

    useEffect(() => {
      if (play) {
        if (video.current) {
          video.current.play().catch(() => {});
        }
        if (lottie.current && lottie.current.player) {
          lottie.current.player.play();
        }
        return;
      }

      resetVideo();
      resetLottie();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [play]);

    useEffect(() => {
      const fetchDataLottieData = async () => {
        try {
          const res = await axios.get(path);
          setLottieData({
            default: res.data,
          });
        } catch (err) {
          //
        }
      };
      if (type === 'LOTTIE' && !lottieData) {
        fetchDataLottieData();
      }

      return () => {
        resetVideo();
        resetLottie();
        setLottieData(null);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div ref={ref} {...props}>
        {type === 'IMAGE' && <Image noFadeIn src={path} />}
        {type === 'SVG' && <Image className="svg" noFadeIn src={path} />}
        {type === 'VIDEO' && thumbnailImage && thumbnailImage.path && (
          <div
            className={classnames('media-video-poster', {
              'is-readied': play,
            })}
          >
            <Image noFadeIn src={thumbnailImage.path} />
          </div>
        )}
        {type === 'VIDEO' && (
          <div
            className={classnames('media-video', {
              'is-readied': play,
            })}
          >
            <video ref={video} src={path} muted playsInline loop={loop} />
          </div>
        )}
        {type === 'LOTTIE' && lottieData && (
          <div className="media-lottie">
            <Lottie
              ref={lottie}
              lottieData={lottieData}
              animationOptions={{
                autoplay: false,
                loop,
              }}
            />
          </div>
        )}
      </div>
    );
  },
);

export const EventBannerMedia = styled(EventBannerMediaComponent)`
  position: relative;
  width: 100%;
  height: 100%;
  .media-video {
    ${({ theme }) => theme.mixin.absolute({ t: 0, l: 0, b: 0 })};
    overflow: hidden;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 200ms;

    &.is-readied {
      opacity: 1;
      z-index: 1;
    }

    img,
    video {
      display: block;
      width: 100%;
      height: 100%;
      transform: scale(1.01);
      object-fit: cover;
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

  .media-video-poster {
    opacity: 1;
    transition: opacity 200ms;

    &.is-readied {
      /** @todo 디자인 검수후 확정, 221228 */
      /* opacity: 0; */
    }
  }

  .media-lottie {
    height: 100%;
  }

  ${Image} {
    &.svg img {
      object-fit: contain;
    }
    background: inherit;
  }
`;
