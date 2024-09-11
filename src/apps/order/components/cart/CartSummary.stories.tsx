import { ComponentStory, ComponentMeta } from '@storybook/react';
import { cartMock } from '../../apis/__mocks__/cart';
import { CartSummary } from './CartSummary';
import { toCartModel } from '../../models';

export default {
  title: 'Features/Order/CartSummary',
  component: CartSummary,
} as ComponentMeta<typeof CartSummary>;

const Template: ComponentStory<typeof CartSummary> = (args) => {
  const cartModel = toCartModel(cartMock);
  const {
    totalSalesPriceText,
    totalShippingCostText,
    totalPrice: { orderPrice },
  } = cartModel;

  return (
    <CartSummary
      {...args}
      totalSalesPriceText={totalSalesPriceText}
      totalShippingCostText={totalShippingCostText}
      orderPrice={orderPrice}
    />
  );
};
export const Basic = Template.bind({});
Basic.args = {};
