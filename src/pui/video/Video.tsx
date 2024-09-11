import { forwardRef, VideoHTMLAttributes, useLayoutEffect, useMemo } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { getBlurHashBase64 } from '@utils/blurHash';
import { useLazyLoad } from '@hooks/useLazyLoad';

export type VideoProps = VideoHTMLAttributes<HTMLVideoElement> & {
  /** Lazy Load 여부 */
  lazy?: boolean;
  /** blur Hash 코드 */
  blurHash?: string;
  /** 모서리 곡률 */
  radius?: string;
};

const VideoComponent = forwardRef<HTMLVideoElement, VideoProps>(
  ({ className, src, lazy, poster, blurHash, radius, ...props }, ref) => {
    const classNames = classnames(className, {
      lazy,
    });
    const blurHashVideo = useMemo(() => {
      return lazy && blurHash ? getBlurHashBase64(blurHash) : null;
    }, [blurHash, lazy]);

    useLayoutEffect(() => {
      if (lazy) {
        const { videoLazyLoad } = useLazyLoad();
        videoLazyLoad.update();
      }
    }, [lazy]);

    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video
        ref={ref}
        className={classNames}
        src={lazy ? undefined : src}
        poster={lazy ? undefined : poster}
        data-src={lazy ? src : undefined}
        // Poster 와 blurhash 가 같이 있다면 Poster 를 우선 적용
        data-poster={lazy ? poster ?? blurHashVideo : undefined}
        {...props}
      />
    );
  },
);

/**
 * HTML video tag 대체 컴포넌트
 */
export const Video = styled(VideoComponent)`
  width: ${({ width = '100%' }) => width};
  height: ${({ height = '100%' }) => height};
  border-radius: ${({ radius = '0' }) => radius};
  &:not([src]) {
    visibility: hidden;
  }

  .lazy {
    min-width: 1px;
    min-height: 1px;
    opacity: 0;

    &:not(.initial) {
      transition: opacity 250ms ease-out;
    }

    &.initial,
    &.loaded,
    &.error {
      opacity: 1;
    }
  }
`;
