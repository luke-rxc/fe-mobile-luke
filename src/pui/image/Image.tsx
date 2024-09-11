/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, useState, useMemo, useLayoutEffect } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { imgLazyLoad, createImgLazyManualLoad } from '@utils/lazyLoad';
import { useBlurHash } from '@hooks/useBlurHash';
import { getImageLink } from '@utils/link';
import { Empty } from '@pui/icon';

/** 투명 이미지 소스 */
export const TransparentImageSource = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
/** 이미지로드 시점이 Viewport Bottom으로 설정된 lazyLoad 인스턴스 */
export const imgLazyThresholdBaseLine = createImgLazyManualLoad({ threshold: 0 });

export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'placeholder'> {
  /** blur Hash 코드 */
  blurHash?: string | null;
  /** FadeIn효과없이 이미지 노출 */
  noFadeIn?: boolean;
  /** Lazy Load 적용 */
  lazy?: boolean;
  /** 모서리 곡률 */
  radius?: string;
  /** 이미지 리소스의 사이즈 정의 */
  resizeWidth?: number;
  /** 이미지 로드 실패시 error ui 미노출 */
  noFallback?: boolean;
  /**
   * 이미지사이즈에 따른 error아이콘의 사이즈 선택
   * @see {@link https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=9021%3A51359}
   */
  fallbackSize?: 'small' | 'large';
  /**
   * Viewport에 진입시 이미지를 로드.
   * thresholdBaseLine이 false(기본)인 경우 Viewport + 300px(vanilla-lazyload의 기본값) 범위의 이미지를 로드한다.
   */
  thresholdBaseLine?: boolean;
}

const ImageComponent = forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      sizes,
      srcSet,
      lazy,
      thresholdBaseLine,
      blurHash,
      noFadeIn,
      fallbackSize = 'small',
      noFallback,
      radius,
      width,
      height,
      resizeWidth,
      alt = '',
      className,
      onLoad,
      onError,
      ...props
    },
    ref,
  ) => {
    const { getBlurHashBase64URL } = useBlurHash();
    // 이미지 로드 상태
    const [status, setStatus] = useState<'error' | 'success' | 'loading'>('loading');
    // blurHash
    const [blurHashImage, setBlurHashImage] = useState<string>(TransparentImageSource);

    // styled className을 포하함한 root 클래스명
    const classNames = classnames(className, `is-${status}`, { 'is-fade': !noFadeIn });

    // 이미지 소스
    const imageSource = useMemo(() => {
      // 이미지 fullURL 생성
      const path = src && getImageLink(src, resizeWidth);

      if (lazy) {
        return { loading: 'lazy', 'data-src': path, 'data-sizes': sizes, 'data-srcset': srcSet } as const;
      }

      return { src: path, sizes, srcSet } as const;
    }, [lazy, src, sizes, srcSet, resizeWidth]);

    // 로드 이벤트 핸들러
    const handleLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setStatus('success');
      onLoad && onLoad(event);
    };

    // 로드 이벤트 핸들러
    const handleLoadError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setStatus('error');
      onError && onError(event);
    };

    const handleUpdateBlurHash = async (_blurHash: string) => {
      const value = await getBlurHashBase64URL({ blurHash: _blurHash });
      value && setBlurHashImage(value);
    };

    useLayoutEffect(() => {
      blurHash && handleUpdateBlurHash(blurHash);
    }, [lazy, blurHash]);

    // lazyLoad setting
    useLayoutEffect(() => {
      if (lazy) {
        thresholdBaseLine ? imgLazyThresholdBaseLine.update() : imgLazyLoad.update();
      }
    }, [lazy, thresholdBaseLine, src]);

    return (
      <span className={classNames}>
        {/* blurHash */}
        <img className="image-blurhash" src={blurHashImage} alt="" />
        {/* 원본 이미지 */}
        <img
          className="image-sauce"
          ref={ref}
          alt={alt}
          onLoad={handleLoad}
          onError={handleLoadError}
          {...{ ...props, ...imageSource }}
        />
        {/* 이미지 로드 에러 표시 */}
        {!noFallback && status === 'error' && (
          <span className="image-error">
            <Empty aria-label="이미지 로드 실패" size={fallbackSize === 'small' ? '2.4rem' : '4.8rem'} />
          </span>
        )}
      </span>
    );
  },
);

/**
 * HTML img tag 대체 컴포넌트 (Figma의 Media loading 가이드를 따른다)
 */
export const Image = styled(ImageComponent)`
  display: inline-block;
  overflow: hidden;
  position: relative;
  width: ${({ width = '100%' }) => width};
  height: ${({ height = '100%' }) => height};
  border-radius: ${({ radius = '0' }) => radius};
  background: ${({ theme }) => theme.color.background.bg};
  line-height: 0;

  &.is-fade {
    .image-sauce,
    .image-error,
    .image-blurhash {
      transition: opacity 0.4s;
    }
  }

  &.is-success {
    background: rgba(0, 0, 0, 0);

    .image-blurhash {
      opacity: 0;
    }

    .image-sauce {
      opacity: 1;
    }
  }

  &.is-error {
    .image-error {
      opacity: 1;
    }
  }

  .image-blurhash {
    position: absolute;
    top: 0;
    left: 0;
    width: inherit;
    height: inherit;
    border-radius: inherit;
    opacity: 1;
  }

  .image-sauce {
    position: relative;
    width: inherit;
    height: inherit;
    border-radius: inherit;
    opacity: 0;

    &:not([src]) {
      visibility: hidden;
    }
  }

  .image-error {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: inherit;
    color: ${({ theme }) => theme.color.gray20};
    background: ${({ theme, blurHash }) => (blurHash ? theme.color.gray8 : 'none')};
    opacity: 0;
  }
`;
