import { ComponentStory, ComponentMeta } from '@storybook/react';
import { cartMock } from '../../apis/__mocks__/cart';
import { CartContent } from './CartContent';
import { toCartModel } from '../../models';

export default {
  title: 'Features/Order/CartContent',
  component: CartContent,
} as ComponentMeta<typeof CartContent>;

const Template: ComponentStory<typeof CartContent> = (args) => {
  const cartModel = toCartModel(cartMock);
  const item = cartModel;
  const { cartItemList } = item;
  return <CartContent {...args} cartItemList={cartItemList} />;
};
export const Basic = Template.bind({});
Basic.args = {};
