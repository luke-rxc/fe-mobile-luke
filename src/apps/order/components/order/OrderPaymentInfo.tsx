import styled from 'styled-components';
import { List } from '@pui/list';
import { ListItemTable } from '@pui/listItemTable';
import { TitleSub } from '@pui/titleSub';
import { OrderPaymentInfoModel } from '../../models';
import { DiscountOptions } from '../checkout/DiscountOptions';

interface Props {
  item: OrderPaymentInfoModel;
}

export const OrderPaymentInfo = ({ item }: Props) => {
  const {
    paymentText,
    orderPriceText,
    totalSalesPriceText,
    totalShippingCostText,
    usedCartCouponSale,
    usedGoodsCouponSale,
    usedPoint,
    totalDiscountPrice,
    totalDiscountPriceText,
  } = item;
  const totalCouponSale = usedGoodsCouponSale + usedCartCouponSale;

  return (
    <ContainerStyled>
      <TitleSub title="결제정보" />
      <List>
        <ListItemTable
          title={<span className="summary-label">결제수단</span>}
          titleWidth={80}
          text={<span className="summary-price">{paymentText}</span>}
          textAlign="right"
        />
        <ListItemTable title="총 상품 금액" titleWidth={80} text={totalSalesPriceText} textAlign="right" />
        {totalDiscountPrice > 0 && (
          <ListItemTable
            title={<span className="summary-label">할인 금액</span>}
            titleWidth={80}
            text={
              <span className="summary-price">
                <DiscountOptions
                  totalCouponSale={totalCouponSale}
                  totalUsedPoint={usedPoint}
                  totalDiscountPriceText={totalDiscountPriceText}
                />
              </span>
            }
            textAlign="right"
          />
        )}
        {totalShippingCostText && (
          <ListItemTable
            title={<span className="summary-label">총 배송비</span>}
            titleWidth={80}
            text={<span className="summary-price">{totalShippingCostText}</span>}
            textAlign="right"
          />
        )}
        <ListItemTable
          className="total-price"
          title={<span className="summary-label">총 결제 금액</span>}
          titleWidth={80}
          text={<span className="summary-price">{orderPriceText}</span>}
          textAlign="right"
        />
      </List>
    </ContainerStyled>
  );
};

const ContainerStyled = styled.div`
  .summary-label {
    font: ${({ theme }) => theme.fontType.small};
    color: ${({ theme }) => theme.color.gray50};
  }
  .summary-price {
    font: ${({ theme }) => theme.fontType.small};
    color: ${({ theme }) => theme.color.black};
  }

  & .total-price {
    .summary-price {
      font: ${({ theme }) => theme.fontType.largeB};
    }
  }
`;
