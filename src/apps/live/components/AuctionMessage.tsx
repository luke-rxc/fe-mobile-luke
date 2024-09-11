import React from 'react';
import styled from 'styled-components';
import { ProfileInfo, ProfileProps } from './ProfileInfo';

interface Props extends ProfileProps {
  message: string;
  className?: string;
  color?: string;
  backgroundColor?: string | null;
}

export const AuctionMessage = styled(
  React.forwardRef<HTMLDivElement, Props>(({ message, className, ...profile }, ref) => {
    return (
      <div className={className} ref={ref}>
        <ProfileInfo {...profile} nickname="" />
        <WrapperStyled>
          <NicknameStyled>{profile.nickname}</NicknameStyled>
          <MessageStyled className="message">{message}</MessageStyled>
        </WrapperStyled>
      </div>
    );
  }),
)`
  display: inline-flex;
  align-items: center;
  padding: 0.8rem;
  background-color: ${({ backgroundColor, theme }) => backgroundColor || theme.light.color.gray50};
  color: ${({ color, theme }) => color || theme.light.color.white};
  border-radius: 0.8rem;
`;

const WrapperStyled = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  width: 100%;
  overflow: hidden;
`;

const MessageStyled = styled.div`
  margin-left: 0.8rem;
  font-size: ${({ theme }) => theme.fontSize.s15};
  line-height: 1.8rem;
  flex: 0 0 auto;
`;

const NicknameStyled = styled.span`
  font-size: 1.2rem;
  margin-left: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
