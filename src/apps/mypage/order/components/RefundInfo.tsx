import styled from 'styled-components';
import { toKRW } from '@utils/toKRW';
import { List } from '@pui/list';
import { Divider } from '@pui/divider';
import { ListItemTable } from '@pui/listItemTable';
import { CollapseSection } from './CollapseSection';
import { DiscountText, DiscountTextProps } from './DiscountText';

export interface RefundInfoProps extends DiscountTextProps {
  /** 환불 수단 */
  methods?: string[];
  /** 상품 금액 */
  goodsAmount?: number;
  /** 배송비 */
  shippingAmount?: number;
  /** 배송비 노출 여부 */
  showShippingAmount?: boolean;
  /** 환불 금액 */
  refundAmount?: number;
  /** 최종 결제 금액 */
  paymentAmount?: number;
  /** 컴포넌트 클래스네임 */
  className?: string;
}

export const RefundInfo = styled(
  ({
    methods,
    goodsAmount = 0,
    shippingAmount = 0,
    showShippingAmount = true,
    refundAmount = 0,
    pointUsageAmount = 0,
    couponUsageAmount = 0,
    paymentAmount = 0,
    className,
  }: RefundInfoProps) => {
    return (
      <CollapseSection className={className} title="환불 정보">
        <List>
          <ListItemTable titleWidth={80} textAlign="right" title="상품 금액" text={toKRW(goodsAmount)} />
          {showShippingAmount && (
            <ListItemTable titleWidth={80} textAlign="right" title="배송비" text={toKRW(shippingAmount)} />
          )}
          {(!!pointUsageAmount || !!couponUsageAmount) && (
            <ListItemTable
              titleWidth={80}
              textAlign="right"
              title="할인 금액"
              text={<DiscountText pointUsageAmount={pointUsageAmount} couponUsageAmount={couponUsageAmount} />}
            />
          )}

          <Divider is="li" aria-hidden />
          {refundAmount !== 0 && (
            <ListItemTable
              titleWidth={80}
              textAlign="right"
              title="환불 수단"
              className="is-methods"
              text={methods?.map((method) => (
                <span key={method} className="method" children={method} />
              ))}
            />
          )}
          <ListItemTable
            title="환불 금액"
            titleWidth={80}
            textAlign="right"
            className="is-summary"
            text={toKRW(refundAmount)}
          />
        </List>

        <p className="refund-final-payment">
          <span className="title">최종 결제 금액</span>
          <span className="amount">{toKRW(paymentAmount)}</span>
        </p>
      </CollapseSection>
    );
  },
)`
  overflow: hidden;
  background: ${({ theme }) => theme.color.background.surface};

  ${Divider} {
    padding-top: ${({ theme }) => theme.spacing.s8};
    padding-bottom: ${({ theme }) => theme.spacing.s8};
  }

  ${ListItemTable}.is-methods {
    .method {
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
        padding-right: 0;
        &:after {
          display: none;
        }
      }
    }
  }

  ${ListItemTable}.is-summary {
    align-items: center;
    color: ${({ theme }) => theme.color.black};

    .item-title {
      font: ${({ theme }) => theme.fontType.mediumB};
      color: inherit;
    }

    .item-text {
      font: ${({ theme }) => theme.fontType.largeB};
      color: inherit;
    }
  }

  .refund-final-payment {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 5.6rem;
    margin: ${({ theme }) => `${theme.spacing.s24} ${theme.spacing.s16} 0`};
    padding: ${({ theme }) => `0 ${theme.spacing.s24}`};
    border-radius: ${({ theme }) => theme.radius.r8};
    background: ${({ theme }) => theme.color.brand.tint3};
    color: ${({ theme }) => theme.color.black};

    .title {
      display: block;
      flex: 0 0 auto;
      width: 12rem;
      font: ${({ theme }) => theme.fontType.mediumB};
    }

    .amount {
      display: block;
      flex: 1 1 auto;
      text-align: right;
      font: ${({ theme }) => theme.fontType.largeB};
    }
  }
`;
