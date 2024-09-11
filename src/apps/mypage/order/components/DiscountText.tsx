import React from 'react';
import styled from 'styled-components';
import sum from 'lodash/sum';
import { toKRW } from '@utils/toKRW';

export interface DiscountTextProps {
  /** 포인트 사용금액 */
  pointUsageAmount?: number;
  /** 쿠폰 할인금액 */
  couponUsageAmount?: number;
  className?: string;
}

/** 쿠폰/적립금 텍스트 */
export const DiscountText = styled(({ pointUsageAmount, couponUsageAmount, className }: DiscountTextProps) => {
  return (
    <span className={className}>
      <span className="discount-labels">
        {!!couponUsageAmount && <span className="label">쿠폰</span>}
        {!!pointUsageAmount && <span className="label">적립금</span>}
      </span>
      <span className="discount-amount"> {toKRW(sum([pointUsageAmount, couponUsageAmount]) || 0)}</span>
    </span>
  );
})`
  .discount-labels {
    .label {
      display: inline-block;
      position: relative;
      padding: 0 0.7rem 0 0.6rem;

      &:after {
        ${({ theme }) => theme.mixin.absolute({ t: '50%', r: 0 })};
        transform: translateY(-50%);
        width: 0.1rem;
        height: 1rem;
        background: ${({ theme }) => theme.color.gray8};
        content: '';
      }

      &:last-child {
        padding-right: ${({ theme }) => theme.spacing.s4};

        &:after {
          display: none;
        }
      }
    }
  }
`;
