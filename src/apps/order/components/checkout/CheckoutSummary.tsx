import React, { useEffect, useImperativeHandle, useRef } from 'react';
import styled from 'styled-components';
import { UniversalLinkTypes } from '@constants/link';
import { Divider } from '@pui/divider';
import { List } from '@pui/list';
import { ListItemTable } from '@pui/listItemTable';
import { Slot } from '@pui/slot';
import { TitleSection } from '@pui/titleSection';
import { Anchor, CheckoutAgreement } from './CheckoutAgreement';
import { DiscountOptions } from './DiscountOptions';
import { useCheckoutSummary } from '../../hooks';
import { CheckoutSummaryModel } from '../../models';
import { href, toExternalLink } from '../../utils';

interface Props {
  className?: string;
  summaryInfo: CheckoutSummaryModel;
}

export const CheckoutSummary = React.forwardRef<HTMLDivElement, Props>(({ className, summaryInfo }, ref) => {
  const { summary, totalDiscountPrice, totalDiscountPriceText } = useCheckoutSummary(summaryInfo);
  const totalCouponSale = summary.totalGoodsCouponPrice + summary.totalCartCouponPrice;
  const collapseElRef = useRef<HTMLDivElement>(null);
  const height = collapseElRef?.current?.offsetHeight ?? 0;

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    const el = e.target as HTMLElement;
    if (el.classList.contains('show')) {
      window.requestAnimationFrame(() => {
        el.classList.add('end');
      });
    }
  };

  useImperativeHandle(ref, () => collapseElRef.current as HTMLDivElement);

  useEffect(() => {
    if (summary.orderPrice === 0) {
      window.requestAnimationFrame(() => {
        collapseElRef.current?.classList.add('hide');
      });
      collapseElRef.current?.classList.remove('show');
    } else {
      window.requestAnimationFrame(() => {
        collapseElRef.current?.classList.add('show');
      });
      collapseElRef.current?.classList.remove('hide');
    }
  }, [summary.orderPrice]);

  return (
    <CollapseEffectStyled ref={collapseElRef} height={height} onTransitionEnd={handleTransitionEnd}>
      <ContainerStyled className={className}>
        <TitleSection title="결제 정보" />
        <List>
          <ListItemTable
            className="row"
            title={<span className="summary-label">상품 금액</span>}
            titleWidth={80}
            text={<span className="summary-price">{summary.totalSalesPriceText}</span>}
            textAlign="right"
          />
          {summaryInfo.totalShippingCostText && (
            <ListItemTable
              className="row"
              title={<span className="summary-label">배송비</span>}
              titleWidth={80}
              text={<span className="summary-price">{summary.totalShippingCostText}</span>}
              textAlign="right"
            />
          )}
          {totalDiscountPrice < 0 && (
            <ListItemTable
              className="row"
              title={<span className="summary-label">할인 금액</span>}
              titleWidth={80}
              text={
                <span className="summary-price">
                  <DiscountOptions
                    totalCouponSale={totalCouponSale}
                    totalUsedPoint={summary.totalUsedPoint}
                    totalDiscountPriceText={totalDiscountPriceText}
                  />
                </span>
              }
              textAlign="right"
            />
          )}
        </List>
        <Divider t="1.2rem" b="1.2rem" />
        <List>
          <ListItemTable
            className="total-price row"
            title={<span className="summary-label">총 결제 금액</span>}
            titleWidth={80}
            text={
              <span className="summary-price">
                <Slot initialValue={0} value={summary.orderPrice} suffix="원" />
              </span>
            }
            textAlign="right"
          />
        </List>
        <div className="agree-box">
          <CheckoutAgreement>본 주문 내용 및 약관내용을 확인 하였으며, 결제에 동의합니다.</CheckoutAgreement>
          <CheckoutAgreement className="divider-top">
            개인정보{' '}
            <Anchor className="link" href={href(UniversalLinkTypes.POLICY_PRIVACY, { section: 'onwardtransfer' })}>
              제3자 제공 동의
            </Anchor>{' '}
            결제대행 서비스 이용약관
          </CheckoutAgreement>
          <CheckoutAgreement className="divider-bottom">
            <Anchor className="link" href={toExternalLink('https://m.kcp.co.kr/popup/policy')}>
              (주)NHN한국사이버결제,
            </Anchor>{' '}
            <Anchor className="link" href={toExternalLink('https://pages.tosspayments.com/terms/user')}>
              (주)토스페이먼츠
            </Anchor>
          </CheckoutAgreement>
          <CheckoutAgreement>
            (주)알엑스씨는 통신판매중개자이며, 통신판매의 당사자가 아닙니다. 상품, 상품 정보, 거래, 배송에 관한 의무와
            책임은 판매자에게 있습니다.
          </CheckoutAgreement>
        </div>
      </ContainerStyled>
    </CollapseEffectStyled>
  );
});

const CollapseEffectStyled = styled.div<{ height: number }>`
  position: relative;
  transform: translate(0px, 0px);
  transition: transform 500ms;
  padding-bottom: 3.6rem;
  background: ${({ theme }) => theme.color.surface};
  z-index: 1;

  &.show {
    &.end {
      height: auto;
    }
  }

  &.hide {
    position: absolute;
    height: ${({ height }) => `${height}px`};
    transform: translate(0, -${({ height }) => `${height}px`});
    transition: transform 500ms;
  }
`;

const ContainerStyled = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.color.surface};

  .summary-label {
    font: ${({ theme }) => theme.fontType.small};
    color: ${({ theme }) => theme.color.gray50};
  }

  .summary-price {
    font: ${({ theme }) => theme.fontType.small};
    color: ${({ theme }) => theme.color.black};
  }

  & .total-price {
    .summary-label {
      font: ${({ theme }) => theme.fontType.smallB};
      color: ${({ theme }) => theme.color.black};
    }

    .summary-price {
      font: ${({ theme }) => theme.fontType.largeB};
      color: ${({ theme }) => theme.color.tint};
    }
  }

  & .agree-box {
    padding-top: 2.4rem;

    .divider-top {
      margin-top: 1.2rem;
    }

    .divider-bottom {
      margin-bottom: 1.2rem;
    }
  }
`;
