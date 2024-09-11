import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { Action } from '@pui/action';
import { Conditional } from '@pui/conditional';
import { ChevronRight } from '@pui/icon';

export interface ListItemTitleProps extends Omit<React.HTMLAttributes<HTMLLIElement>, 'title'> {
  /** 랜딩 URL */
  link?: string;
  /** 우측 화살표 표시 여부 */
  noArrow?: boolean;
  /** 텍스트(children으로 대체가능) */
  title?: React.ReactNode;
  /** 우측에 표시할값 */
  icon?: React.ReactNode;
  /** 우측에 표시할값 */
  suffix?: React.ReactNode;
  /** 타이틀 클릭 */
  onClickTitle?: (e: React.MouseEvent<HTMLAnchorElement>, item: ListItemTitleProps) => void;
}

const ListItemTitleComponent = forwardRef<HTMLLIElement, ListItemTitleProps>((props, ref) => {
  const { link, noArrow, icon, suffix, title, onClickTitle, children, ...rest } = props;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClickTitle?.(e, props);
    !link && e.preventDefault();
  };
  return (
    <li ref={ref} {...rest}>
      <Conditional
        className="item-inner"
        condition={!!link || !!onClickTitle}
        trueExp={<Action is="a" link={link} onClick={handleClick} />}
        falseExp={<span />}
      >
        {icon && <span className="item-icon">{icon}</span>}
        <span className="item-content">{[title, children]}</span>
        {suffix && <span className="item-suffix">{suffix}</span>}
        {!noArrow && (
          <span className="item-arrow">
            <ChevronRight size="2.4rem" />
          </span>
        )}
      </Conditional>
    </li>
  );
});

/**
 * Figma Text(title + data) 컴포넌트
 */
export const ListItemTitle = styled(ListItemTitleComponent)`
  .item-inner {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    min-height: 5.6rem;
    padding: ${({ icon }) => (icon ? '0.4rem 2.4rem 0.4rem 1.6rem' : '0.4rem 2.4rem')};
    text-align: left;
    word-break: keep-all;
    overflow-wrap: anywhere;

    &${Action} {
      background: transparent;
      transition: background 0.2s;

      &:active {
        background: ${({ theme }) => theme.color.gray3};
      }
    }
  }

  .item-content {
    display: block;
    flex: 1 1 auto;
    font: ${({ theme }) => theme.fontType.medium};
    color: ${({ theme }) => theme.color.black};
  }

  .item-icon {
    display: flex;
    flex: 0 0 auto;
    justify-content: center;
    align-items: center;
    width: 4rem;
    height: 4rem;
    margin-right: 0.8rem;
    line-height: 0;
  }

  .item-suffix {
    display: block;
    flex: 0 0 auto;
    margin-left: 0.8rem;
    font: ${({ theme }) => theme.fontType.mediumB};
    color: ${({ theme }) => theme.color.brand.tint};
  }

  .item-arrow {
    display: block;
    flex: 0 0 auto;
    margin-right: -0.8rem;
    line-height: 0;
    color: ${({ theme }) => theme.color.gray50};
  }
`;
