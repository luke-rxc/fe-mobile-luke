import React from 'react';
import styled from 'styled-components';

export interface ToastInnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * message
   * @description 의도적으로 2줄을 넣겠다면 \r\n을 구분자로 사용
   */
  message: string;
  /**
   * text align
   * @default center
   */
  align?: 'left' | 'center' | 'right';
}

const ToastInnerComponent: React.FC<ToastInnerProps> = ({ message, className, ...rest }) => {
  return (
    <div className={className} {...rest}>
      <div className="message-wrapper">
        <p className="message">{message}</p>
      </div>
    </div>
  );
};

export const ToastInner = styled(ToastInnerComponent).attrs(({ align }) => {
  return {
    align: align ?? 'center',
  };
})`
  position: relative;
  display: flex;
  align-items: center;
  padding: ${({ theme }) => `1.5rem ${theme.spacing.s16}`};
  min-height: 4.8rem;
  max-height: 6.6rem;
  font: ${({ theme }) => theme.fontType.medium};
  color: ${({ theme }) => theme.color.white};

  .message-wrapper {
    width: 100%;
    text-align: ${({ align }) => align};
    max-height: 3.6rem;
    overflow: hidden;

    .message {
      white-space: pre-wrap;
    }
  }
`;
