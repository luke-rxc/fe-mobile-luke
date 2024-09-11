import chunk from 'lodash/chunk';
import styled from 'styled-components';
import { Image } from '@pui/image';
import { ImageModel } from '../models';

interface Props {
  images: Array<ImageModel>;
  className?: string;
}

export const LiveGoodsImages = ({ className, images }: Props) => {
  const chunkImageArr = chunk(images.slice(0, 4), 2);

  return (
    <div className={className}>
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
              <ImageStyled
                width="100%"
                src={image.path}
                blurHash={image.blurHash}
                key={`goods-image-${image.id}-${idx.toString()}`}
              />
            );
          })}
        </WrapperStyled>
      ))}
    </div>
  );
};

const WrapperStyled = styled.div<{ itemsLength: number; chunkLength: number }>`
  display: flex;
  flex-wrap: wrap;
  justify-content: ${({ chunkLength }) => (chunkLength > 1 ? 'space-between' : 'center')};

  &:not(:first-child) {
    margin-top: 0.4rem;
  }

  > span {
    width: ${({ itemsLength }) => (itemsLength > 1 ? `3rem` : '6.4rem')};
    height: ${({ itemsLength }) => (itemsLength > 1 ? `3rem` : '6.4rem')};
    border-radius: 0.8rem;
    overflow: hidden;
    background-color: ${({ theme }) => theme.light.color.bg};
  }
`;

const ImageCountStyled = styled.div`
  display: flex;
  font-size: ${({ theme }) => theme.fontSize.s15};
  color: ${({ theme }) => theme.light.color.white};
  align-items: center;
  padding-left: 0.4rem;
  user-select: none;
`;

const ImageStyled = styled(Image)`
  background-color: transparent;
`;
