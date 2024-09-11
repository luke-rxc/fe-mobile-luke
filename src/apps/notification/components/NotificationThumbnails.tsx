import type { HTMLAttributes } from 'react';
import chunk from 'lodash/chunk';
import styled from 'styled-components';
import { Image } from '@pui/image';

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'css'> {
  className?: string;
  images: Array<{
    id: number;
    path: string;
    blurHash?: string | null;
    width: number;
    height: number;
  }>;
}

export const NotificationThumbnails = styled(({ className, images, ...props }: Props) => {
  const chunkImageArr = chunk(images.slice(0, 4), 2);

  return (
    <div className={className} {...props}>
      {chunkImageArr.map((chunkImages, index) => (
        <WrapperStyled
          key={`goods-chunk-image-${index.toString()}`}
          itemsLength={images.length}
          chunkLength={chunkImages.length}
        >
          {chunkImages.map((image, idx) => {
            if (index === 1 && idx === 1 && images.length > 4) {
              return <ImageCountStyled key={`goods-image-${image.id}`}>+{images.length - 3}</ImageCountStyled>;
            }

            return (
              <div key={`goods-image-${image.id}`}>
                <Image src={image.path} lazy />
              </div>
            );
          })}
        </WrapperStyled>
      ))}
    </div>
  );
})`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 4.4rem;
  height: 4.4rem;
`;

const WrapperStyled = styled.div<{ itemsLength: number; chunkLength: number }>`
  display: flex;
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  justify-content: ${({ chunkLength }) => (chunkLength > 1 ? 'space-between' : 'center')};
  align-items: center;

  &:not(:first-child) {
    margin-top: 0.2rem;
  }

  > div {
    width: ${({ itemsLength }) => (itemsLength > 1 ? 'calc((100% - 0.2rem) * 0.5)' : '100%')};
    height: ${({ itemsLength }) => (itemsLength > 1 ? '2.1rem' : '100%')};
    border-radius: 0.4rem;
    overflow: hidden;
    isolation: isolate;
  }
`;

const ImageCountStyled = styled.div`
  display: flex;
  font-size: ${({ theme }) => theme.fontSize.s10};
  color: ${({ theme }) => theme.color.gray50};
  justify-content: center;
  align-items: center;
  padding-left: 0.2rem;
  user-select: none;
`;
