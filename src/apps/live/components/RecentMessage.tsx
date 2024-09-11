import React, { useEffect, useState } from 'react';
import styled, { keyframes, useTheme } from 'styled-components';
import classNames from 'classnames';
import { ChevronDown } from '@pui/icon';
import { ProfileInfo, ProfileProps } from './ProfileInfo';

interface Props extends ProfileProps {
  show: boolean;
  message: string;
  className?: string;
  color?: string;
  backgroundColor?: string | null;
  isUserMessage?: boolean;
  onClickMessage: () => void;
}

const fadeIn = keyframes`
  from { transform: translateY(110%); }
  to { transform: translateY(0%); }
`;

const fadeOut = keyframes`
  from { transform: translateY(0%); }
  to { transform: translateY(110%); }
`;

export const RecentMessage = styled(
  React.forwardRef<HTMLDivElement, Props>(
    ({ show, message, className, isUserMessage = false, onClickMessage: handleClickMessage, ...profile }, ref) => {
      const theme = useTheme();
      const [animationName, setAnimationName] = useState<string>('default');

      useEffect(() => {
        if (show) {
          setAnimationName('slide-in');
        } else if (animationName === 'slide-in') {
          setAnimationName('slide-out');
        }
      }, [animationName, show]);

      return (
        <div
          role="button"
          className={`${className} ${animationName}`}
          ref={ref}
          tabIndex={0}
          onClick={handleClickMessage}
        >
          <ProfileInfoStyled {...profile} nickname="" />
          <WrapperStyled>
            <NicknameStyled>{profile.nickname}</NicknameStyled>
            <MessageStyled className={classNames('message', { 'user-message': isUserMessage })}>
              {message}
            </MessageStyled>
          </WrapperStyled>
          <div>
            <ChevronDown name="chevronDown" colorCode={theme.light.color.white} size="1.6rem" />
          </div>
        </div>
      );
    },
  ),
)`
  display: flex;
  align-items: center;
  padding: 0.8rem;
  background-color: ${({ backgroundColor, theme }) => backgroundColor || theme.light.color.gray70};
  color: ${({ color, theme }) => color || theme.light.color.white};
  border-radius: 0.8rem;
  position: absolute;
  bottom: 0;
  width: 100%;
  transform: translateY(110%);
  pointer-events: auto;
  &.slide-in {
    animation: 300ms linear 0s normal forwards ${fadeIn};
  }
  &.slide-out {
    animation: 300ms linear 0s normal forwards ${fadeOut};
  }
`;

const ProfileInfoStyled = styled(ProfileInfo)`
  flex-shrink: 0;
  > span {
    margin-right: 0.8rem;
  }
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

  &.user-message {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:not(.user-message) {
    flex: 0 0 auto;
  }
`;

const NicknameStyled = styled.span`
  font-size: 1.2rem;
  margin-left: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
