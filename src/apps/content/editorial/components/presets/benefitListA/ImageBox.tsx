import { forwardRef, useState } from 'react';
import type { HTMLAttributes } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Image } from '@pui/image';
import { getImageLink } from '@utils/link';
import type { DisplayMediaModel } from '../../../models';

export type ImageBoxProps = HTMLAttributes<HTMLDivElement> & {
  /** 미디어 정보 */
  media: DisplayMediaModel;
};

const ImageBoxComponent = forwardRef<HTMLDivElement, ImageBoxProps>(({ className, media }, ref) => {
  const [errorMedia, setErrorMedia] = useState<boolean>(false);
  const [successMedia, setSuccessMedia] = useState<boolean>(false);

  return (
    <div className={className} ref={ref}>
      <ImageBoxStyled
        className={classNames('media-box', {
          'is-error': errorMedia,
          'is-loaded': successMedia,
        })}
      >
        <Image
          className="media"
          src={getImageLink(media.path)}
          blurHash={media.blurHash}
          onError={() => setErrorMedia(true)}
          onLoad={() => setSuccessMedia(true)}
          lazy
        />
      </ImageBoxStyled>
    </div>
  );
});

/**
 * 미디어 뷰 컴포넌트
 */
export const ImageBox = styled(ImageBoxComponent)`
  & .media-box {
    position: absolute;
    inset: 0px;
    z-index: 0;
    height: 100%;
    overflow: hidden;
    &:before {
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      width: 100%;
      height: 100%;
      background: ${({ theme }) => theme.color.gray8};
      content: '';
    }
    &.is-loaded:before {
      background: none;
    }
  }
`;

export const ImageBoxStyled = styled('div')`
  & img {
    position: relative;
    object-fit: cover;
    vertical-align: top;
  }

  & .media {
    position: absolute;
    inset: 0px;
    z-index: 0;
    overflow: hidden;
    display: block;
  }
`;
