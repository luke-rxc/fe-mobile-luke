import styled from 'styled-components';
import { toKRW } from '@utils/toKRW';
import { Divider } from '@pui/divider';
import { TitleSection } from '@pui/titleSection';
import { List } from '@pui/list';
import { ListItemTable } from '@pui/listItemTable';
import { DiscountText, DiscountTextProps } from './DiscountText';
import { CollapseSection } from './CollapseSection';

export interface EstimatedRefundInfoProps extends Omit<DiscountTextProps, 'className'> {
  /** 환불 수단 */
  method?: string;
  /** 상품 금액 */
  goodsAmount?: number;
  /** 배송비 */
  shippingAmount?: number;
  /**
   * 배송비 노출 여부
   * @default true
   */
  showShippingAmount?: boolean;
  /** 예상 환불 금액 */
  refundableAmount?: number;
  /** 컴포넌트 클래스네임 */
  className?: string;
  /** 환불 금액 타이틀 */
  refundableAmountTitle?: string;
  /** 반품배송비영역 노출 여부 */
  showReturnShipppingAmount?: boolean;
  /** Collapse 사용 여부 */
  isCollapseSection?: boolean;
}

/**
 * 환불 정보
 */
export const EstimatedRefundInfo = styled(
  ({
    method,
    goodsAmount = 0,
    shippingAmount = 0,
    showShippingAmount = true,
    pointUsageAmount = 0,
    couponUsageAmount = 0,
    refundableAmount = 0,
    refundableAmountTitle = '예상 환불 금액',
    showReturnShipppingAmount = false,
    className,
    isCollapseSection = false,
  }: EstimatedRefundInfoProps) => {
    return isCollapseSection ? (
      <CollapseSection className={className} title="환불 정보">
        <List>
          <ListItemTable titleWidth={120} textAlign="right" title="상품 금액" text={toKRW(goodsAmount)} />
          {showShippingAmount && !showReturnShipppingAmount && (
            <ListItemTable titleWidth={120} textAlign="right" title="배송비" text={toKRW(shippingAmount)} />
          )}
          <ListItemTable
            titleWidth={120}
            textAlign="right"
            title="할인 금액"
            text={<DiscountText pointUsageAmount={pointUsageAmount} couponUsageAmount={couponUsageAmount} />}
          />
          {showReturnShipppingAmount && (
            <ListItemTable titleWidth={120} textAlign="right" title="반품 배송비" text={toKRW(shippingAmount)} />
          )}
          <Divider is="li" aria-hidden />
          <ListItemTable titleWidth={120} textAlign="right" title="환불 수단" text={method} />
          <ListItemTable
            title={refundableAmountTitle}
            titleWidth={120}
            textAlign="right"
            className="is-summary"
            text={toKRW(refundableAmount)}
          />
        </List>
      </CollapseSection>
    ) : (
      <div className={className}>
        <TitleSection title="환불 정보" />
        <List>
          <ListItemTable titleWidth={120} textAlign="right" title="상품 금액" text={toKRW(goodsAmount)} />
          {showShippingAmount && !showReturnShipppingAmount && (
            <ListItemTable titleWidth={120} textAlign="right" title="배송비" text={toKRW(shippingAmount)} />
          )}
          <ListItemTable
            titleWidth={120}
            textAlign="right"
            title="할인 금액"
            text={<DiscountText pointUsageAmount={pointUsageAmount} couponUsageAmount={couponUsageAmount} />}
          />
          {showReturnShipppingAmount && (
            <ListItemTable titleWidth={120} textAlign="right" title="반품 배송비" text={toKRW(shippingAmount)} />
          )}
          <Divider is="li" aria-hidden />
          <ListItemTable titleWidth={120} textAlign="right" title="환불 수단" text={method} />
          <ListItemTable
            title={refundableAmountTitle}
            titleWidth={120}
            textAlign="right"
            className="is-summary"
            text={toKRW(refundableAmount)}
          />
        </List>
      </div>
    );
  },
)`
  overflow: hidden;
  padding-bottom: ${({ theme }) => theme.spacing.s16};
  background: ${({ theme }) => theme.color.background.surface};

  ${Divider} {
    padding-top: ${({ theme }) => theme.spacing.s8};
    padding-bottom: ${({ theme }) => theme.spacing.s8};
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
`;
