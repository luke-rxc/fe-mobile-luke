import React, { forwardRef } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { Action } from '@pui/action';
import { Conditional } from '@pui/conditional';
import { Close } from '@pui/icon';
import { Spinner } from '@pui/spinner';

const toDisplayLabel = (text: string) => {
  const maxLength = 20;

  if (text.length > maxLength) {
    return `${text.slice(0, maxLength)}...`;
  }

  return text;
};

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** chip label */
  label: string;
  /** chip 클릭시 이동할 ULR */
  link?: string;
  /** chip loading */
  loading?: boolean;
  /**
   * 삭제버튼 클릭시 실행할 콜백
   * (해당 Props 유무에 따라 닫기 버튼이 show/hide됩니다)
   */
  onDelete?: () => void;
}

const ChipComponent = forwardRef<HTMLSpanElement, ChipProps>(
  ({ label, link, loading, className, onClick, onDelete, ...props }, ref) => {
    const classNames = classnames(className, {
      'is-clickable': onClick || link,
      'is-deletable': onDelete,
    });

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      onDelete?.();
    };

    return (
      <span ref={ref} className={classNames} {...props}>
        <span className="chip-inner">
          <Conditional
            className="chip-label"
            condition={!!link}
            trueExp={<Action is="a" link={link} />}
            falseExp={<Action onClick={onClick} />}
          >
            {toDisplayLabel(label)}
          </Conditional>

          {onDelete && (
            <Action
              aria-label="삭제"
              className="chip-delete"
              haptic="informDelete"
              disabled={loading}
              onClick={handleDelete}
            >
              {loading ? <Spinner size="small" /> : <Close size="2rem" />}
            </Action>
          )}
        </span>
      </span>
    );
  },
);

/**
 * Figma의 Chips 아이템 컴포넌트
 */
export const Chip = styled(ChipComponent)`
  display: inline-block;

  .chip-inner {
    display: inline-block;
    position: relative;
    height: 4rem;
    border-radius: ${({ theme }) => theme.radius.r6};
  }

  .chip-label {
    display: flex;
    overflow: hidden;
    position: relative;
    align-items: center;
    height: inherit;
    padding: 0 1.2rem;
    border-radius: inherit;
    background: ${({ theme }) => theme.color.gray3};
    font: ${({ theme }) => theme.fontType.smallB};
    color: ${({ theme, loading }) => (loading ? theme.color.gray20 : theme.color.black)};

    &:before {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      background: ${({ theme }) => theme.color.gray3};
      transition: opacity 0.2s;
      opacity: 0;
      content: '';
    }
  }

  .chip-delete {
    position: absolute;
    top: 50%;
    right: 0.4rem;
    width: 3.4rem;
    height: 3.4rem;
    line-height: 0;
    color: ${({ theme }) => theme.color.gray50};
    transform: translateY(-50%);
  }

  /** clickable */
  &.is-clickable {
    .chip-label:active:before {
      opacity: 1;
    }
  }

  /** deletable */
  &.is-deletable {
    .chip-inner {
      background: ${({ theme }) => theme.color.whiteVariant1};
    }
    .chip-label {
      padding-right: 3.6rem;
    }
  }
`;
