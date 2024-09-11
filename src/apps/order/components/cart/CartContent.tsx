import styled from 'styled-components';
import React from 'react';
import { Divider } from '@pui/divider';
import { CartItemModel, CartShippingGroupModel } from '../../models';
import { CartSummary } from './CartSummary';
import { CartShippingGroup } from './CartShippingGroup';

interface Props {
  cartItemList: CartItemModel[];
  totalSalesPriceText: string;
  totalShippingCostText: string;
  orderPrice: number;
  onChange: (cartId: number, quantity: number) => Promise<void>;
  onDelete: (cartId: number, skipConfirmation?: boolean) => Promise<string>;
}

export const CartContent = ({
  cartItemList,
  totalSalesPriceText,
  totalShippingCostText,
  orderPrice,
  onChange: handleChange,
  onDelete: handleDelete,
}: Props) => {
  const shippingGroupList = cartItemList.map((cartItem: CartItemModel) => cartItem.shippingGroupList).flat();

  return (
    <ContainerStyled>
      <div className="cart-content">
        {shippingGroupList.map((shippingGroup: CartShippingGroupModel, index: number) => {
          const {
            shippingGroupName,
            brandGroupList,
            shippingPolicyText,
            totalSalesPriceText: shippingGroupTotalSalePriceText,
            totalShippingCostText: shippingGroupTotalShippingCostText,
          } = shippingGroup;
          return (
            <React.Fragment key={shippingGroupName}>
              <CartShippingGroupStyled
                brandGroupList={brandGroupList}
                shippingPolicyText={shippingPolicyText}
                totalSalesPriceText={shippingGroupTotalSalePriceText}
                totalShippingCostText={shippingGroupTotalShippingCostText}
                onChange={handleChange}
                onDelete={handleDelete}
              />
              {shippingGroupList.length - 1 !== index && <Divider />}
            </React.Fragment>
          );
        })}
      </div>
      <CartSummary
        className="cart-summary-section"
        totalSalesPriceText={totalSalesPriceText}
        totalShippingCostText={totalShippingCostText}
        orderPrice={orderPrice}
      />
    </ContainerStyled>
  );
};

const ContainerStyled = styled.div`
  background: ${({ theme }) => theme.color.bg};

  .cart-content {
    background: ${({ theme }) => theme.color.surface};
  }

  .cart-summary-section {
    margin-top: 1.2rem;
  }

  .button-wrapper {
    position: fixed;
    ${({ theme }) => theme.mixin.safeArea('bottom', 24)};
    padding: 2.4rem 2.4rem 0 2.4rem;
    width: 100%;
    z-index: 1;
  }
`;

const CartShippingGroupStyled = styled(CartShippingGroup)`
  background: ${({ theme }) => theme.color.surface};
  padding-top: 1.2rem;
  padding-bottom: 1.2rem;
`;
