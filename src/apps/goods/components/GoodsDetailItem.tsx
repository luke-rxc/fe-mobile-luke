import React from 'react';
import styled from 'styled-components';
import { Image, TransparentImageSource } from '@pui/image';
import { VideoPlayer } from '@features/videoPlayer/components';
import { FileType } from '@constants/file';
import { GoodsDetailModel } from '../models';

type Props = Pick<GoodsDetailModel, 'type' | 'file' | 'containerHeight'>;

export const GoodsDetailItem: React.FC<Props> = ({ type, file, containerHeight }) => {
  const { thumbnailImage } = file;
  const posterImage = thumbnailImage?.path ?? TransparentImageSource;

  return (
    <ContentWrapper>
      {type === FileType.IMAGE && (
        <ListWrapper height={containerHeight}>
          <ImageStyled src={file.path} blurHash={file.blurHash} lazy thresholdBaseLine />
        </ListWrapper>
      )}

      {type === FileType.VIDEO && (
        <ListWrapper height={containerHeight}>
          <VideoPlayerStyled
            video={{
              src: file.path,
              width: 100,
              height: 100,
              poster: posterImage,
              muted: false,
            }}
            usableMuteButton={false}
          />
        </ListWrapper>
      )}
    </ContentWrapper>
  );
};

const VideoPlayerStyled = styled(VideoPlayer)`
  padding: 0;
  & video {
    width: 100%;
    height: auto !important;
    object-fit: inherit !important;
  }

  & .inner {
    position: relative;
    height: auto;
    bottom: auto;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  width: 100%;
  /* min-height: 100vw; */
  /* overflow: hidden; */
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ListWrapper = styled.div<{ height: number | null }>`
  line-height: 0;
  position: relative;
  width: 100%;
  height: ${({ height }) => {
    if (height) {
      return `${height / 10}rem`;
    }
    return 'auto';
  }};
`;

const ImageStyled = styled(Image)`
  line-height: 0;

  & img {
    width: 100%;
  }
`;
