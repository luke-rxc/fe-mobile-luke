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
  const [errorMedia, setErrorMedia] = useState<boolean>(false); // 미디어 에러상태
  const [successMedia, setSuccessMedia] = useState<boolean>(false); // 미디어 에러상태

  return (
    <div className={className} ref={ref}>
      <div
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
      </div>
    </div>
  );
});

/**
 * 이미지 뷰
 */
export const ImageBox = styled(ImageBoxComponent)`
  & .media-box {
    & .media {
      position: absolute;
      top: 50%;
      left: 0;
      height: 100%;
      transform: translateY(-50%);

      & img {
        width: 100%;
        vertical-align: middle;
      }
    }

    &.is-loaded:before {
      background: none;
    }

    &.is-error {
      ${Image} {
        background: none;

        & img {
          display: none;
        }
      }
    }
  }
`;
