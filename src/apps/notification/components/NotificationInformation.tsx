import React from 'react';
import styled from 'styled-components';
import nl2br from '@utils/nl2br';

interface NotificationInformationProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'css'> {
  message: string;
  relativeTime: string;
}

export const NotificationInformation = styled(
  ({ className, message, relativeTime, ...props }: NotificationInformationProps) => {
    return (
      <div className={className} {...props}>
        <div className="notification-information-inner">
          <span className="message">{nl2br(message)}</span>
        </div>
        <div className="notification-information-inner">
          <span className="time">{relativeTime}</span>
        </div>
      </div>
    );
  },
)`
  display: flex;
  flex-grow: 1;
  z-index: 1;
  flex-direction: column;
  justify-content: center;
  padding: 0 0.8rem;
  font-size: ${({ theme }) => theme.fontSize.s15};

  &-inner:not(:first-child) {
    margin-top: 0.4rem;
  }

  .division,
  .time {
    font-size: ${({ theme }) => theme.fontSize.s12};
    color: ${({ theme }) => theme.color.gray50};
  }
`;
