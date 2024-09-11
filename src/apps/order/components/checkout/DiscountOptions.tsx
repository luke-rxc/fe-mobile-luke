import styled from 'styled-components';

export interface DiscountOptionsProps {
  className?: string;
  totalCouponSale: number;
  totalUsedPoint: number;
  totalDiscountPriceText: string;
}

export const DiscountOptions = styled(
  ({ className, totalCouponSale, totalUsedPoint, totalDiscountPriceText }: DiscountOptionsProps) => {
    return (
      <span className={className}>
        <span className="discount-labels">
          {totalCouponSale > 0 && <span className="discount-option">쿠폰</span>}
          {totalUsedPoint > 0 && <span className="discount-option">적립금</span>}
        </span>
        <span className="sale-price"> {totalDiscountPriceText}</span>
      </span>
    );
  },
)`
  .discount-labels {
    .discount-option {
      display: inline-block;
      position: relative;
      padding: 0 0.7rem 0 0.6rem;
      color: ${({ theme }) => theme.color.black};
      font-size: ${({ theme }) => theme.fontSize.s14};

      &:after {
        position: absolute;
        top: 50%;
        right: 0rem;
        width: 0.1rem;
        height: 1rem;
        transform: translateY(-50%);
        background: ${({ theme }) => theme.color.gray8};
        content: '';
      }

      &:last-child {
        padding-right: 0.4rem;

        &:after {
          display: none;
        }
      }
    }
  }

  .sale-price {
    color: ${({ theme }) => theme.color.red};
    font: ${({ theme }) => theme.fontType.t14};
    line-height: 1.7rem;
  }
`;
