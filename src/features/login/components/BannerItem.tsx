import { Info } from '@pui/icon';
import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { VideoErrorState } from '@features/videoPlayer/constants';
import { BannerMedia, BannerMediaProps } from './BannerMedia';

export interface BannerItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 미디어 정보 */
  mediaInfo: BannerMediaProps;
  /** view에 표시 여부 */
  inView?: boolean;
}

/**
 * Banner Item
 */
export const BannerItem = styled(({ mediaInfo, inView, ...props }: BannerItemProps) => {
  const [errorType, setErrorType] = useState<VideoErrorState | null>(null);
  const elRef = useRef<HTMLDivElement>(null);

  const handleSetErrorView = useCallback((code: number) => {
    setErrorType(code as VideoErrorState);
  }, []);

  return (
    <div {...props}>
      <span className="banner-media">
        <BannerMedia {...{ ...mediaInfo, inView, onVideoError: handleSetErrorView }} ref={elRef} />
      </span>
      {errorType && (
        <div className="error">
          <>
            {errorType === VideoErrorState.MEDIA_ERR_ABORTED && (
              <>
                <Info name="info" size="3.2rem" colorCode="#fff" /> MEDIA_ERR_ABORTED
              </>
            )}
            {errorType === VideoErrorState.MEDIA_ERR_NETWORK && (
              <>
                <Info name="info" size="3.2rem" colorCode="#fff" /> MEDIA_ERR_NETWORK
              </>
            )}
            {errorType === VideoErrorState.MEDIA_ERR_DECODE && (
              <>
                <Info name="info" size="3.2rem" colorCode="#fff" /> MEDIA_ERR_DECODE
              </>
            )}
            {errorType === VideoErrorState.MEDIA_ERR_SRC_NOT_SUPPORTED && (
              <>
                <Info name="info" size="3.2rem" colorCode="#fff" /> MEDIA_ERR_SRC_NOT_SUPPORTED
              </>
            )}
          </>
        </div>
      )}
    </div>
  );
})`
  overflow: hidden;
  position: relative;
  z-index: 0;
  width: 100%;
  padding-top: 24rem;

  ${({ theme }) => theme.mediaQuery.xxs} {
    padding-top: 28.2rem;
  }

  .banner-media {
    ${({ theme }) => theme.mixin.absolute({ t: 0, l: 0 })};
    z-index: -1;
    overflow: hidden;
    width: 100%;
    height: 100%;

    ${BannerMedia} {
      transform: scale(1.05);
    }
  }

  .error {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${({ theme }) => theme.color.surface};
  }
`;
