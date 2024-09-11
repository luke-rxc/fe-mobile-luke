import { forwardRef, useEffect, useRef } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Action, ActionProps } from '@pui/action';

export interface SeatAreaCardProps extends Extract<ActionProps, { is?: 'button' }> {
  name: string;
  count: number;
  price: number;
  selected: boolean;
}

const SeatAreaCardComponent = forwardRef<HTMLButtonElement, SeatAreaCardProps>(
  ({ name, count, price, selected, ...props }, ref) => {
    const areaContainerRef = useRef<HTMLDivElement>(null);
    const areaNameRef = useRef<HTMLDivElement>(null);
    const AreaNameMaxWidth = 176;
    const NotifiedMaxCount = 11;

    useEffect(() => {
      setTimeout(() => {
        if (
          selected &&
          areaContainerRef.current &&
          areaNameRef.current &&
          areaNameRef.current?.scrollWidth > AreaNameMaxWidth
        ) {
          areaContainerRef.current.classList.toggle('active', areaNameRef.current.scrollWidth > AreaNameMaxWidth);
        }
      }, 1000);
    }, [selected]);

    return (
      <Action
        {...props}
        is="button"
        ref={ref}
        className={classNames(props.className, {
          selected,
        })}
      >
        <div
          className={classNames('area-name-container', {
            selected,
          })}
          ref={areaContainerRef}
        >
          <span
            className={classNames('area-name', {
              selected,
            })}
            ref={areaNameRef}
          >
            {name}
          </span>
          <span
            className={classNames('area-name clone', {
              selected,
            })}
          >
            {name}
          </span>
        </div>
        <span className="area-sub-info-list">
          <span
            className={classNames('area-sub-info-item', {
              selected,
              notified: count < NotifiedMaxCount,
            })}
          >
            {count !== 0 ? `${count}석` : '매진'}
          </span>
          <span
            className={classNames('area-sub-info-item', {
              selected,
            })}
          >{`${price.toLocaleString()}원`}</span>
        </span>
      </Action>
    );
  },
);

export const SeatAreaCard = styled(SeatAreaCardComponent)`
  display: flex;
  flex-direction: column;
  max-height: 6.4rem;
  max-width: 20.8rem;
  height: 6.4rem;
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.s8} ${theme.spacing.s16}`};
  font: ${({ theme }) => theme.fontType.medium};
  color: ${({ theme }) => theme.color.text.textTertiary};
  border-radius: ${({ theme }) => theme.radius.r8};
  border: 0.1rem solid ${({ theme }) => theme.color.backgroundLayout.line};
  background: ${({ theme }) => theme.color.background.surface};
  &.selected {
    border: 0.1rem solid ${({ theme }) => theme.color.brand.tint};
  }

  .area-name-container {
    display: flex;
    overflow: hidden;
    white-space: nowrap;
    width: 17.6rem;
    mask-image: linear-gradient(90deg, #d9d9d9 87.59%, rgba(217, 217, 217, 0) 100%);
    .area-name {
      display: block;
      width: 17.6rem;
      height: 2.4rem;
      color: ${({ theme }) => theme.color.text.textTertiary};
      font: ${({ theme }) => theme.fontType.medium};
      padding: 0.3rem 0;
      &.selected {
        font: ${({ theme }) => theme.fontType.mediumB};
        color: ${({ theme }) => theme.color.text.textPrimary};
      }
      &.clone {
        display: none;
      }
    }

    &.active {
      mask-image: linear-gradient(
        90deg,
        rgba(217, 217, 217, 0) 0%,
        rgba(217, 217, 217, 0.9) 17.71%,
        #d9d9d9 83.33%,
        rgba(217, 217, 217, 0) 100%
      );
      .area-name {
        width: auto;
        animation: 10s linear infinite scolling-text-origin;
        padding-right: 2.4rem;
        &.clone {
          display: block;
        }
      }
    }
  }

  @keyframes scolling-text-origin {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(-100%, 0, 0);
    }
  }

  .area-sub-info-list {
    display: flex;
    justify-content: center;
    width: 17.6rem;
    height: 1.4rem;

    .area-sub-info-item {
      display: inline-block;
      position: relative;
      padding-right: 1.7rem;
      color: ${({ theme }) => theme.color.text.textTertiary};
      font: ${({ theme }) => theme.fontType.mini};
      &.selected {
        color: ${({ theme }) => theme.color.text.textPrimary};
      }
      &.notified {
        color: ${({ theme }) => theme.color.semantic.noti};
      }
      &:after {
        position: absolute;
        top: 50%;
        right: 0.8rem;
        width: 0.1rem;
        height: 1.2rem;
        transform: translateY(-50%);
        background: ${({ theme }) => theme.color.backgroundLayout.line};
        content: '';
      }
    }

    .area-sub-info-item:last-child {
      padding-right: 0;

      &:after {
        display: none;
      }
    }
  }

  &${Action}:active {
    background: ${({ theme }) => theme.color.states.pressedCell};
  }
`;
