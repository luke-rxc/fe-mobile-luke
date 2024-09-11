import { Divider } from '@pui/divider';
import { List } from '@pui/list';
import { ListItemTable } from '@pui/listItemTable';
import { Slot } from '@pui/slot';
import styled from 'styled-components';

interface Props {
  className?: string;
  totalSalesPriceText: string;
  totalShippingCostText: string;
  orderPrice: number;
}

export const CartSummary = ({ className, totalSalesPriceText, totalShippingCostText, orderPrice }: Props) => {
  return (
    <ContainerStyled className={className}>
      <ListStyled className="summary">
        <ListItemTable
          className="row"
          title={<span className="summary-label">상품 금액</span>}
          text={<span className="summary-price">{totalSalesPriceText}</span>}
          textAlign="right"
        />
        <ListItemTable
          className="row"
          title={<span className="summary-label">배송비</span>}
          text={<span className="summary-price">{totalShippingCostText}</span>}
          textAlign="right"
        />
      </ListStyled>
      <Divider />
      <ListStyled className="total">
        <ListItemTable
          className="total-price row"
          title={<span className="summary-label">총 주문 금액</span>}
          text={
            <span className="summary-price">
              <Slot initialValue={0} value={orderPrice} suffix="원" />
            </span>
          }
          textAlign="right"
        />
      </ListStyled>
    </ContainerStyled>
  );
};

const ContainerStyled = styled.div`
  display: block;
  background: ${({ theme }) => theme.color.surface};
  padding-bottom: 10.4rem;

  & .summary-label {
    font: ${({ theme }) => theme.fontType.t14};
    color: ${({ theme }) => theme.color.gray50};
  }

  & .summary-price {
    font: ${({ theme }) => theme.fontType.t14};
    color: ${({ theme }) => theme.color.tint};
  }

  & .total-price {
    & .summary-label {
      font: ${({ theme }) => theme.fontType.t15B};
      color: ${({ theme }) => theme.color.black};
    }

    & .summary-price {
      font: ${({ theme }) => theme.fontType.t18B};
      color: ${({ theme }) => theme.color.tint};
    }
  }
`;

const ListStyled = styled(List)`
  &.summary {
    padding-top: 1.6rem;
    padding-bottom: 1.2rem;

    .row {
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;

      .list-item-text .item-text {
        line-height: 1.671rem;
      }
    }
  }

  &.total {
    padding-top: 1.2rem;
    padding-bottom: 2.4rem;

    .row {
      padding-top: 0.55rem;
      padding-bottom: 0.55rem;
    }
  }
`;
