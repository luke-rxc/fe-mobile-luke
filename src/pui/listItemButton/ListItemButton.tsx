import { createElement, forwardRef } from 'react';
import styled from 'styled-components';
import { Button } from '@pui/button';

export interface ListItemButtonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'onClick'> {
  /** 우측 버튼 요소 */
  suffix: React.ReactNode;
  /** title (복사되는 텍스트) */
  title: string;
  /** description */
  description?: string;
  /** root element tag */
  is?: 'li' | 'div';
  /** 우측 버튼 클릭 이벤트 콜백 */
  onClick?: () => void;
}

const ListItemButtonComponent = forwardRef<HTMLDivElement, ListItemButtonProps>((props, ref) => {
  const { suffix, title, description, is = 'li', onClick: handleClick, ...rest } = props;

  return createElement(is, { ref, ...rest }, [
    <span key="wrapper" className="item-wrapper">
      {/* 좌측 정보 요소 */}
      <span className="item-info">
        <span className="item-title">{title}</span>
        {description && <span className="item-description">{description}</span>}
      </span>

      {/* 우측 버튼 요소 */}
      <Button onClick={handleClick} children={suffix} />
    </span>,
  ]);
});

export const ListItemButton = styled(ListItemButtonComponent)`
  .item-wrapper {
    display: flex;
    align-items: center;
    min-height: 5.6rem;
    padding: ${({ theme }) => `${theme.spacing.s16} ${theme.spacing.s12} ${theme.spacing.s16} ${theme.spacing.s24}`};
    text-align: left;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }

  .item-info {
    display: block;
    flex: auto;
    margin-right: ${({ theme }) => theme.spacing.s16};
  }

  .item-title {
    display: block;
    font: ${({ theme }) => theme.fontType.medium};
    color: ${({ theme }) => theme.color.text.textPrimary};
  }

  .item-description {
    display: block;
    font: ${({ theme }) => theme.fontType.mini};
    color: ${({ theme }) => theme.color.text.textTertiary};
    margin-top: ${({ theme }) => theme.spacing.s4};
  }

  ${Button} {
    flex-shrink: 0;

    &.is-press:active {
      opacity: 1;
      background: ${({ theme }) => theme.color.states.pressedCell};
    }

    .button-content {
      > svg {
        color: ${({ theme }) => theme.color.gray50};
        margin-right: ${({ theme }) => theme.spacing.s2};
      }

      font: ${({ theme }) => theme.fontType.small};
      color: ${({ theme }) => theme.color.text.textTertiary};
    }
  }
`;
