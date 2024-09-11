import { Image } from '@pui/image';
import styled from 'styled-components';
import { RaffleImageModel } from '../models';

interface WinnerAnnounceImageProps {
  goodsImage: RaffleImageModel;
}

export const WinnerAnnounceImage = styled(({ goodsImage, ...props }: WinnerAnnounceImageProps) => {
  return (
    <div {...props}>
      <Image className="raffle-image" src={goodsImage.path} />
    </div>
  );
})`
  margin: 0 auto;
  width: 32rem;
  height: 16rem;
  ${({ theme }) => theme.mixin.centerItem()};
  flex-direction: column;
  ${({ theme }) => theme.mixin.position('relative')};

  .raffle-image {
    width: 27.2rem;
    height: 16rem;
  }
`;
