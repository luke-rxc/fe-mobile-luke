import React, { forwardRef } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';

export interface ListItemTextProps extends React.HTMLAttributes<HTMLLIElement> {
  /** 텍스트(children으로 대체가능) */
  text?: React.ReactNode;
  /** 폰트 사이즈 */
  size?: 'small' | 'medium';
}

const ListItemTextComponent = forwardRef<HTMLLIElement, ListItemTextProps>(
  ({ text, size = 'small', children, className, ...props }, ref) => {
    const classNames = classnames(className, `is-${size}`);

    return (
      <li ref={ref} className={classNames} {...props}>
        {[text, children]}
      </li>
    );
  },
);

/**
 * Figma Text(dot + description) 컴포넌트
 */
export const ListItemText = styled(ListItemTextComponent)`
  box-sizing: border-box;
  position: relative;
  padding: 0.4rem 2.4rem 0.4rem 4.8rem;
  text-align: left;
  word-break: keep-all;
  overflow-wrap: anywhere;

  &.is-small {
    color: ${({ theme }) => theme.color.gray70};
    font: ${({ theme }) => theme.fontType.small};
  }

  &.is-medium {
    color: ${({ theme }) => theme.color.text.textPrimary};
    font: ${({ theme }) => theme.fontType.medium};
  }

  &:after {
    position: absolute;
    top: 0.4rem;
    left: 2.4rem;
    color: ${({ theme }) => theme.color.gray70};
    font: ${({ theme }) => theme.fontType.medium};
    content: '•';
  }
`;
