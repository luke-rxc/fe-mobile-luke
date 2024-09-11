import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import styled from 'styled-components';
import type { ReviewMediaModel } from '@features/review/models';
import { VideoPlayer } from '@features/videoPlayer/components';
import { Image } from '@pui/image';
import { getImageLink } from '@utils/link';
import { getMediaHeight } from '../utils';

export type ReviewDetailMediaProps = HTMLAttributes<HTMLDivElement> & {
  /** 리뷰 미디어 */
  media: ReviewMediaModel;
};
const ReviewDetailMediaComponent = forwardRef<HTMLDivElement, ReviewDetailMediaProps>(({ className, media }, ref) => {
  const { path, thumbnailImage, width: mediaW = 0, height: mediaH = 0, fileType } = media;
  const height = getMediaHeight(mediaW, mediaH);
  return (
    <div className={className} ref={ref} style={{ height: `${height}rem` }}>
      {fileType === 'VIDEO' && (
        <VideoPlayer
          video={{
            src: getImageLink(path),
            poster: thumbnailImage?.path ? getImageLink(thumbnailImage.path) : '',
            width: mediaW,
            height: mediaH,
            loop: true,
            autoPlay: true,
          }}
          lazy={false}
          forceLoadVideo
        />
      )}
      {fileType !== 'VIDEO' && <Image src={media.path} lazy blurHash={media.blurHash} />}
    </div>
  );
});

export const ReviewDetailMedia = styled(ReviewDetailMediaComponent)`
  overflow: hidden;
  position: relative;
  width: 100%;
  margin-top: 0.1rem;

  &:first-child {
    margin-top: 0;
  }

  ${Image} {
    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      vertical-align: middle;
    }
  }

  ${VideoPlayer} {
    position: absolute;
    top: 50%;
    left: 0;
    height: 100%;
    transform: translateY(-50%);

    & .player {
      overflow: hidden;
      position: absolute;
      height: 100%;
      inset: 0px;
    }

    & video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      vertical-align: middle;
    }
  }
`;
