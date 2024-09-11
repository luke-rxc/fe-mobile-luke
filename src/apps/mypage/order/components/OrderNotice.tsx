import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import styled from 'styled-components';

export type OrderNoticeProps = Omit<HTMLAttributes<HTMLDivElement>, 'css'> & {
  noticeMessage?: string;
};

const OrderNoticeComponent = forwardRef<HTMLDivElement, OrderNoticeProps>(
  ({ noticeMessage, className, ...props }, ref) => {
    if (!noticeMessage) {
      return null;
    }

    return (
      <div ref={ref} className={className} {...props}>
        <div className="message">{noticeMessage}</div>
      </div>
    );
  },
);

export const OrderNotice = styled(OrderNoticeComponent)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing.s12} 3.2rem`};

  .message {
    font: ${({ theme }) => theme.fontType.micro};
    color: ${({ theme }) => theme.color.gray50};
  }
`;
