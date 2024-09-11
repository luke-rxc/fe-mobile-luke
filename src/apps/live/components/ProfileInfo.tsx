import { Image } from '@pui/image';

import styled from 'styled-components';

export interface ProfileProps {
  profileUrl: string;
  nickname?: string;
  className?: string;
  width?: string;
  height?: string;
}

export const ProfileInfo = ({ className, width = '2.4rem', height = '2.4rem', profileUrl, nickname }: ProfileProps) => {
  return (
    <WrapperStyled className={className}>
      <Image width={width} height={height} src={profileUrl} radius="50%" />
      {nickname && <NicknameStyled className="nickname">{nickname}</NicknameStyled>}
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  display: flex;
  align-items: center;

  > div {
    background-color: ${({ theme }) => theme.light.color.black};

    > div.mediaBox {
      > span {
        background-color: ${({ theme }) => theme.light.color.black};
      }
    }
  }
`;

const NicknameStyled = styled.span`
  font-size: 1.2rem;
  margin-left: 0.8rem;
`;
