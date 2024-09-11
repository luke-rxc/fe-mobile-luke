import { Divider } from '@pui/divider';
import React from 'react';
import styled from 'styled-components';
import { CartBrandGroupModel } from '../../models';
import { CartBrand } from './CartBrand';

interface Props {
  className?: string;
  brandGroupList: CartBrandGroupModel[];
  shippingPolicyText: string;
  totalSalesPriceText: string;
  totalShippingCostText: string;
  onChange: (cartId: number, quantity: number) => Promise<void>;
  onDelete: (cartId: number, skipConfirmation?: boolean) => Promise<string>;
}

export const CartShippingGroup = ({
  className,
  brandGroupList,
  shippingPolicyText,
  totalSalesPriceText,
  totalShippingCostText,
  onChange: handleChange,
  onDelete: handleDelete,
}: Props) => {
  return (
    <ContainerStyled className={className}>
      <ul>
        {brandGroupList.map((brandGroup, index: number) => {
          return (
            <React.Fragment key={brandGroup.brand.id}>
              <li className="brand-item">
                <CartBrand
                  brand={brandGroup.brand}
                  cartDataList={brandGroup.cartDataList}
                  onChange={handleChange}
                  onDelete={handleDelete}
                />
              </li>
              {brandGroupList.length - 1 !== index && <Divider />}
            </React.Fragment>
          );
        })}
      </ul>
      {!(totalSalesPriceText === '' && shippingPolicyText === '') && (
        <div className="shipping-total-price-box">
          <div className="shipping-total-price">
            <span>상품 금액</span>
            <span>{totalSalesPriceText}</span>
          </div>
          <div className="shipping-total-price">
            <span>배송비</span>
            <span>{totalShippingCostText}</span>
          </div>
          {shippingPolicyText && <p>{shippingPolicyText}</p>}
        </div>
      )}
    </ContainerStyled>
  );
};

const ContainerStyled = styled.div`
  .shipping-total-price-box {
    display: flex;
    flex-direction: column;
    padding: 1.2rem 2.4rem 0 2.4rem;

    .shipping-total-price {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 0.4rem;

      &:first-child {
        margin-bottom: 0.8rem;
      }

      & > span {
        &:first-child {
          font: ${({ theme }) => theme.fontType.t12};
          color: ${({ theme }) => theme.color.tint};
          line-height: 1.432rem;
        }

        &:last-child {
          font: ${({ theme }) => theme.fontType.t12};
          color: ${({ theme }) => theme.color.black};
          line-height: 1.432rem;
        }
      }
    }

    & > p {
      font: ${({ theme }) => theme.fontType.t10};
      color: ${({ theme }) => theme.color.gray50};
    }

    & > *:last-child {
      padding-bottom: 1.2rem;

      &.shipping-total-price {
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  .brand-item {
    padding-top: 1.2rem;
    padding-bottom: 1.2rem;

    &:first-child {
      padding-top: 0;
    }

    &:last-child {
      padding-bottom: 0;
    }
  }
`;
