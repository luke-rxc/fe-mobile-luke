import { forwardRef, useState } from 'react';
import type { HTMLAttributes } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
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
    overflow: hidden;
    position: absolute;
    z-index: 0;
    height: 100%;
    inset: 0px;

    &:before {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
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
    display: block;
    overflow: hidden;
    position: absolute;
    z-index: 0;
    inset: 0px;
  }
`;
