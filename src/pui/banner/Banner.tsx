import React, { forwardRef } from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import { Action } from '@pui/action';
import { ChevronRight, Icon } from '@pui/icon';

export interface BannerItemProps {
  /** 타이틀 */
  title: string;
  /** 설명 */
  description?: string;
  /** 링크 */
  link?: string;
  /** arrow 표시 Hide : true일 경우 suffix는 무시 */
  noArrow?: boolean;
  /** 우측(arrow 좌측) 안내 텍스트 */
  suffix?: string;
  /** Icon 표시 */
  icon?: typeof Icon;
}

export type BannerProps = BannerItemProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'id' | 'onClick'> & {
    /** Item 탭시 Item 정보를 받을 수 있는 Callback */
    onClick?: (itemInfo: BannerItemProps) => void;
  };

const BannerComponent = forwardRef<HTMLDivElement, BannerProps>((props, ref) => {
  const { title, description, link, onClick, noArrow = false, suffix, icon, className, ...etcProps } = props;
  const handleClick = (evt: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(props);

    // link 없는 부분은 preventDefault 처리 진행
    !link && evt.cancelable && evt.preventDefault();
  };

  return (
    <div ref={ref} className={className} {...etcProps}>
      <Action is="a" link={link} onClick={handleClick}>
        <div
          className={classnames('container', {
            'only-one-line': !description,
          })}
        >
          {icon && (
            <span className="item-icon">
              <Icon icon={icon} size="1.6rem" />
            </span>
          )}
          <span className="item-text">
            <span
              className={classnames('title', {
                'only-one-line': !description,
              })}
            >
              {title}
            </span>
            {description && <span className="desc">{description}</span>}
          </span>
          {!noArrow && (
            <span className="item-arrow">
              {suffix && <span className="suffix">{suffix}</span>}
              <ChevronRight size="2.4rem" />
            </span>
          )}
        </div>
      </Action>
    </div>
  );
});

export const Banner = styled(BannerComponent)`
  ${Action} {
    display: inline-block;
    width: 100%;
    will-change: transform;
    transition: transform 200ms ease-in-out;
    transform: scale(1), translateZ(0);

    &:active {
      transform: scale(0.96);
      .container {
        background: ${({ theme }) => theme.color.states.pressedCell};
      }
    }
  }

  .container {
    position: relative;
    padding: ${({ theme }) => theme.spacing.s16};
    background: ${({ theme }) => theme.color.gray3};
    transition: background 200ms ease-out;
    border-radius: 0.8rem;

    display: flex;
    flex-direction: row;
    justify-content: center;

    &.only-one-line {
      align-items: center;
    }

    .item-icon {
      margin-right: ${({ theme }) => theme.spacing.s12};
    }

    .item-text {
      display: block;
      flex: 1 1 auto;
      margin-right: 0.8rem;
      overflow: hidden;

      span {
        display: block;

        &.title {
          ${({ theme }) => theme.mixin.ellipsis()};
          font: ${({ theme }) => theme.fontType.smallB};
          color: ${({ theme }) => theme.color.text.textPrimary};
          &.only-one-line {
            font: ${({ theme }) => theme.fontType.medium};
          }
        }

        &.desc {
          margin-top: 0.4rem;
          font: ${({ theme }) => theme.fontType.small};
          color: ${({ theme }) => theme.color.text.textTertiary};
          ${({ theme }) => theme.mixin.multilineEllipsis(4, 17)};
        }
      }
    }

    .item-arrow {
      display: flex;
      flex: 0 0 auto;
      margin-right: -0.8rem;
      line-height: 0;
      color: ${({ theme }) => theme.color.gray50};

      .suffix {
        display: flex;
        height: 2.4rem;
        align-items: center;
      }
    }
  }
`;
