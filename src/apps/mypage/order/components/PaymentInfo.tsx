import styled from 'styled-components';
import { toKRW } from '@utils/toKRW';
import { Divider } from '@pui/divider';
import { List } from '@pui/list';
import { ListItemTable } from '@pui/listItemTable';
import { CollapseSection } from './CollapseSection';
import { DiscountText, DiscountTextProps } from './DiscountText';

/** 결제 정보 interface */
export interface PaymentInfoProps extends Pick<DiscountTextProps, 'pointUsageAmount' | 'couponUsageAmount'> {
  /** 결제수단 */
  method?: string;
  /** 상품 금액 */
  goodsAmount?: number;
  /** 배송비 */
  shippingAmount?: number;
  /** 배송비 노출 여부 */
  showShippingAmount?: boolean;
  /** 결제 금액 */
  paymentAmount?: number;
  /** 컴포넌트 클래스네임 */
  className?: string;
}

/** 결제정보 컴포넌트  */
export const PaymentInfo = styled(
  ({
    method,
    goodsAmount = 0,
    shippingAmount = 0,
    showShippingAmount = true,
    paymentAmount = 0,
    pointUsageAmount = 0,
    couponUsageAmount = 0,
    className,
  }: PaymentInfoProps) => {
    return (
      <CollapseSection className={className} title="결제 정보">
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
              text={
                <DiscountText pointUsageAmount={pointUsageAmount * -1} couponUsageAmount={couponUsageAmount * -1} />
              }
            />
          )}

          <Divider is="li" aria-hidden />

          <ListItemTable titleWidth={80} textAlign="right" title="결제 수단" text={method} />
          <ListItemTable
            title="결제 금액"
            titleWidth={80}
            textAlign="right"
            className="is-summary"
            text={toKRW(paymentAmount)}
          />
        </List>
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

  ${DiscountText} .discount-amount {
    color: ${({ theme }) => theme.color.red};
  }

  ${ListItemTable}.is-summary {
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
`;
