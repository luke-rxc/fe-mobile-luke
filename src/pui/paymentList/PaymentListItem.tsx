import { forwardRef, useRef, useEffect, useState, useCallback, useLayoutEffect } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { PGType } from '@constants/order';
import { Action } from '@pui/action';
import { PayIcon } from './PayIcon';

export type PaymentListItemProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  /** PG 타입 */
  pgType: PGType;
  /** 타이틀 */
  title: ReactNode;
  /** 우측 라벨 */
  label?: string;
  /** 리스트 하단 추가 문구 */
  description?: ReactNode;
  /** 활성 여부 */
  selected: boolean;
  /** 트랜지션 사용여부 */
  transition?: boolean;
  /** item select시 콜백 */
  onSelect?: () => void;
};

const PaymentListItemComponent = forwardRef<HTMLButtonElement, PaymentListItemProps>(
  ({ className, pgType, title, label, description, selected = false, onSelect, transition = true }, ref) => {
    const descRef = useRef<HTMLDivElement>(null);
    const descTextRef = useRef<HTMLDivElement>(null);
    // 가상클래스 :active 로 press 효과 처리시 웹뷰에서 active 해제가 되지 않는 케이스가 있어, 상태값으로 press 효과 처리
    const [pressed, setPressed] = useState<boolean>(false);
    const [isTransition, setIsTransition] = useState<boolean>(false);

    const handlePressStart = useCallback(() => {
      setPressed(true);
    }, []);

    const handlePressEnd = useCallback(() => {
      setPressed(false);
    }, []);

    useEffect(() => {
      setIsTransition(transition);
    }, [transition]);

    useLayoutEffect(() => {
      if (descRef.current && descTextRef.current) {
        descRef.current.style.maxHeight = selected ? `${descTextRef.current.offsetHeight / 10}rem` : '0rem';
      }
    }, [selected, description]);

    return (
      <Action
        is="button"
        ref={ref}
        className={classNames(className, {
          'is-active': selected,
          'is-press': pressed,
          'is-transition': isTransition,
        })}
        onClick={onSelect}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onTouchCancel={handlePressEnd}
      >
        <div className="item">
          <div className="pg">
            <PayIcon pgType={pgType} active={selected} />
          </div>
          <div className="title">{title}</div>
          {label && <div className="lbl">{label}</div>}
        </div>
        {description && (
          <div className="desc" ref={descRef}>
            <div className="txt-wrapper" ref={descTextRef}>
              <span className="txt">{description}</span>
            </div>
          </div>
        )}
      </Action>
    );
  },
);

export const PaymentListItem = styled(PaymentListItemComponent)`
  position: relative;
  width: 100%;
  padding: 1.6rem 1.6rem 1.6rem 1.2rem;
  border: ${({ theme }) => `0.1rem solid ${theme.color.backgroundLayout.line}`};
  border-radius: ${({ theme }) => theme.radius.r8};
  transition: border 0.2s linear;
  background-color: ${({ theme }) => theme.color.background.surface};
  & > .item {
    display: flex;
    align-items: center;
    text-align: left;
    & > .pg {
      width: 2.4rem;
      height: 2.4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 1.2rem;
      flex-shrink: 0;
    }
    & > .title {
      font: ${({ theme }) => theme.fontType.medium};
      color: ${({ theme }) => theme.color.text.textTertiary};
      flex-grow: 1;
      word-break: break-all;
      ${({ theme }) => theme.mixin.ellipsis()};
    }
    & > .lbl {
      opacity: 1;
      flex-shrink: 0;
      margin-left: 1.2rem;
      font: ${({ theme }) => theme.fontType.mini};
      color: ${({ theme }) => theme.color.text.textTertiary};
      word-break: break-all;
      transition: opacity 0.2s;
    }
  }

  & > .desc {
    opacity: 0;
    max-height: 0;
    & > .txt-wrapper {
      padding-top: 0.3rem;
      padding-left: 3.6rem;

      & > .txt {
        font: ${({ theme }) => theme.fontType.mini};
        color: ${({ theme }) => theme.color.text.textTertiary};
        text-align: left;
      }
    }
  }

  &.is-press {
    &:before {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      background: transparent;
      transition: background 0.2s;
      content: '';
      background: ${({ theme }) => theme.color.states.pressedCell};
    }
  }

  &.is-active {
    border-color: ${({ theme }) => theme.color.brand.tint};
    & > .item {
      & > .title {
        color: ${({ theme }) => theme.color.brand.tint};
      }
      & > .lbl {
        opacity: 0;
      }
    }
    & > .desc {
      opacity: 1;
    }
  }

  &.is-transition {
    & > .desc {
      transition: max-height 0.2s ease-out, opacity 0.2s;
      max-height: 0rem;
    }

    &.is-active {
      & > .desc {
        transition: max-height 0.2s ease-out, opacity 0.2s 0.05s;
      }
    }
  }
`;
