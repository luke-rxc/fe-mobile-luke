import React from 'react';
import styled from 'styled-components';

type NotificationBadgeProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'css'>;

export const NotificationBadge = styled(({ className, ...props }: NotificationBadgeProps) => {
  return (
    <div className={className} {...props}>
      <span className="dot" />
    </div>
  );
})`
  .dot {
    position: absolute;
    top: 3.4rem;
    left: 0.8rem;
    background: ${({ theme }) => theme.color.red};
    width: 0.8rem;
    min-width: 0.8rem;
    height: 0.8rem;
    border-radius: 100%;
  }
`;
