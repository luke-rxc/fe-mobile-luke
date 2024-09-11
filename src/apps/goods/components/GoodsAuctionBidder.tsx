import React from 'react';
import styled from 'styled-components';
import { Image } from '@pui/image';
import { GoodsModel } from '../models';

interface Props {
  auction: GoodsModel['auction'];
  className?: string;
}

export const GoodsAuctionBidder: React.FC<Props> = ({ className, auction }) => {
  if (auction === null) {
    return null;
  }

  const { nickname, profileImage } = auction.bidder;
  return (
    <Wrapper className={className}>
      <Image
        className="profile-img"
        src={profileImage.path}
        blurHash={profileImage.blurHash}
        noFadeIn
        radius="50%"
        width={24}
        height={24}
        lazy
      />
      <p className="nickname-area">
        <span className="nickname">{nickname}</span>님이 낙찰되었습니다
      </p>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  & .profile-img {
    width: 2.4rem;
    height: 2.4rem;
    margin: 0.8rem 0.8rem 0.8rem 0;
    background: ${({ theme }) => theme.color.background.bg};
  }

  & .nickname-area {
    font: ${({ theme }) => theme.fontType.small};

    & .nickname {
      font-weight: ${({ theme }) => theme.fontWeight.bold};
    }
  }
`;
