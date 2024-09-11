import { ComponentStory, ComponentMeta } from '@storybook/react';
import { cartMock } from '../../apis/__mocks__/cart';
import { CartShippingGroup } from './CartShippingGroup';
import { toCartModel } from '../../models';

export default {
  title: 'Features/Order/CartShippingGroup',
  component: CartShippingGroup,
} as ComponentMeta<typeof CartShippingGroup>;

const Template: ComponentStory<typeof CartShippingGroup> = (args) => {
  const cartModel = toCartModel(cartMock);
  const item = cartModel.cartItemList[0].shippingGroupList[0];
  const { brandGroupList, shippingPolicyText, totalSalesPriceText, totalShippingCostText } = item;
  return (
    <CartShippingGroup
      {...args}
      brandGroupList={brandGroupList}
      shippingPolicyText={shippingPolicyText}
      totalSalesPriceText={totalSalesPriceText}
      totalShippingCostText={totalShippingCostText}
    />
  );
};
export const Basic = Template.bind({});
Basic.args = {};
