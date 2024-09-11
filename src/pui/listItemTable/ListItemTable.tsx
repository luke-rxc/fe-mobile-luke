import React, { forwardRef } from 'react';
import styled from 'styled-components';

export interface ListItemTableProps extends Omit<React.HTMLAttributes<HTMLLIElement>, 'title'> {
  /** 타이틀 */
  title?: React.ReactNode;
  /** 텍스트(children으로 대체가능) */
  text?: React.ReactNode;
  /** 타이틀 영역 사이즈 (default: 80) */
  titleWidth?: 80 | 120;
  /** 텍스트 정렬 (default: left) */
  textAlign?: 'center' | 'left' | 'right';
}
const ListItemTableComponent = forwardRef<HTMLLIElement, ListItemTableProps>(
  ({ title, text, titleWidth, textAlign, children, ...props }, ref) => {
    return (
      <li ref={ref} {...props}>
        <span className="item-title">{title}</span>
        <span className="item-text">
          {text}
          {children}
        </span>
      </li>
    );
  },
);

/**
 * Figma Table List Item 컴포넌트
 */
export const ListItemTable = styled(ListItemTableComponent)`
  display: flex;
  box-sizing: border-box;
  min-height: 3.2rem;
  padding: 0.8rem 2.4rem;
  word-break: keep-all;
  overflow-wrap: anywhere;
  font: ${({ theme }) => theme.fontType.small};

  .item-title {
    display: block;
    flex: 0 0 auto;
    width: ${({ titleWidth = 80 }) => `${titleWidth / 10}rem`};
    color: ${({ theme }) => theme.color.gray50};
  }

  .item-text {
    display: block;
    flex: 1 1 auto;
    margin-left: 0.8rem;
    text-align: ${({ textAlign = 'left' }) => textAlign};
    color: ${({ theme }) => theme.color.black};
  }
`;
