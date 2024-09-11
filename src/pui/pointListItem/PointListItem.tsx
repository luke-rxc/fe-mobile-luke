/* eslint-disable yoda */
import React, { forwardRef } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import format from 'date-fns/format';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { Price } from '@pui/icon';

/**
 * 포인트 포멧
 */
const toPointFormat = (num: number): string => {
  return num === 0 ? '0원' : `${num.toLocaleString('ko-KR', { signDisplay: 'always' })}원`;
};

/**
 * 적립일 날짜 포멧
 */
const toSavedDateFormat = (date: number) => {
  return format(date, 'yyyy. M. d');
};

/**
 * 만료(소멸)일 포멧
 */
const toExpiryDateFormat = (date: number) => {
  const today = new Date();
  const expiryDay = new Date(date);
  const remainingPeriod = differenceInCalendarDays(expiryDay, today);

  // 오늘 소멸
  if (remainingPeriod === 0) {
    return { status: 'today', displayExpiryDate: '오늘 소멸' };
  }

  // 일주일
  if (1 <= remainingPeriod && remainingPeriod <= 7) {
    return { status: 'week', displayExpiryDate: `D-${remainingPeriod}` };
  }

  // 30일 이하
  if (7 < remainingPeriod && remainingPeriod <= 30) {
    return { status: 'month', displayExpiryDate: `D-${remainingPeriod}` };
  }

  // 30일 초과 혹은 만료
  return { status: 'none', displayExpiryDate: format(date, '~ yyyy. M. d') };
};

export interface PointListItemProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 적립 내역 */
  title: string;
  /** 적립 or 사용된 포인트 */
  point: number;
  /** 적립일 */
  savedDate: number;
  /** 만료일 */
  expiryDate: number;
}
const PointListItemComponent = forwardRef<HTMLSpanElement, PointListItemProps>(
  ({ title, point, savedDate, expiryDate, className, ...props }, ref) => {
    const isDecrease = point < 0;
    const { status, displayExpiryDate } = toExpiryDateFormat(expiryDate);
    const classNames = classnames(className, `is-${status}`, {
      'is-decrease': isDecrease,
    });

    return (
      <span ref={ref} className={classNames} {...props}>
        <span className="point-thumb">
          <Price size="2.4rem" />
        </span>
        <span className="point-title">
          <span className="title">{title}</span>
          <span className="date">{toSavedDateFormat(savedDate)}</span>
        </span>
        <span className="point-price">
          <span className="price">{toPointFormat(point)}</span>
          {!isDecrease && expiryDate && <span className="date">{displayExpiryDate}</span>}
        </span>
      </span>
    );
  },
);

/**
 * Figma Point 컴포넌트
 */
export const PointListItem = styled(PointListItemComponent)`
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 7.8rem;
  padding: ${({ theme }) => `0 ${theme.spacing.s24}`};
  background: ${({ theme }) => theme.color.background.surface};

  .point-thumb {
    display: flex;
    flex: 0 0 auto;
    justify-content: center;
    align-items: center;
    width: 3.2rem;
    height: 3.2rem;
    margin-right: ${({ theme }) => theme.spacing.s12};
    border-radius: 50%;
    background: ${({ theme }) => theme.color.brand.tint};
    color: ${({ theme }) => theme.color.background.surface};
  }

  .point-title {
    display: block;
    width: 100%;

    .title {
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      width: 100%;
      max-height: 3.6em;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      color: ${({ theme }) => theme.color.text.textPrimary};
      font: ${({ theme }) => theme.fontType.medium};
    }

    .date {
      display: block;
      margin-top: ${({ theme }) => theme.spacing.s2};
      color: ${({ theme }) => theme.color.text.textTertiary};
      font: ${({ theme }) => theme.fontType.mini};
    }
  }

  .point-price {
    flex: 0 0 auto;
    text-align: right;
    margin-left: ${({ theme }) => theme.spacing.s16};

    .price {
      color: ${({ theme }) => theme.color.brand.tint};
      font: ${({ theme }) => theme.fontType.mediumB};
    }

    .date {
      display: block;
      margin-top: ${({ theme }) => theme.spacing.s2};
      color: ${({ theme }) => theme.color.text.textTertiary};
      font: ${({ theme }) => theme.fontType.mini};
    }
  }

  &.is-decrease {
    .point-thumb {
      background: ${({ theme }) => theme.color.gray8Filled} !important;
    }

    .point-title .title,
    .point-title .date,
    .point-price .price,
    .point-price .date {
      color: ${({ theme }) => theme.color.text.textDisabled};
    }
  }

  &.is-today,
  &.is-week {
    .point-price .date {
      font-weight: bold;
      color: ${({ theme }) => theme.color.semantic.error};
    }
  }

  &.is-month {
    .point-price .date {
      font-weight: bold;
    }
  }
`;
