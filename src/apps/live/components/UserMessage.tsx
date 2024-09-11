import React from 'react';
import styled from 'styled-components';
import { ProfileInfo, ProfileProps } from './ProfileInfo';

interface Props extends ProfileProps {
  message: string;
  className?: string;
  isAdmin: boolean;
}

export const UserMessage = styled(
  React.forwardRef<HTMLDivElement, Props>(({ message, className, isAdmin, ...profile }, ref) => {
    return (
      <div className={className} ref={ref}>
        <ProfileInfo {...profile} />
        <MessageStyled>{message}</MessageStyled>
      </div>
    );
  }),
)`
  display: inline-flex;
  flex-direction: column;
  padding: 0.8rem 0.6rem 0.9rem 0.8rem;
  color: ${({ theme, isAdmin }) => (isAdmin ? theme.light.color.black : theme.light.color.white)};
  background-color: ${({ theme, isAdmin }) => (isAdmin ? theme.light.color.bg : theme.light.color.gray50)};
  border-radius: 0.8rem;
`;

const MessageStyled = styled.div`
  min-width: 9.8rem;
  margin-top: 0.8rem;
  font-size: ${({ theme }) => theme.fontSize.s15};
  letter-spacing: -0.039rem;
  line-height: 1.9rem;
  word-wrap: break-word;
  word-break: break-all;
`;
