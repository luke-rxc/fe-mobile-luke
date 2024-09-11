import { useCallback } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { cartMock } from '../../apis/__mocks__/cart';
import { CartBrand } from './CartBrand';
import { toCartModel } from '../../models';

export default {
  title: 'Features/Order/CartBrand',
  component: CartBrand,
} as ComponentMeta<typeof CartBrand>;

const Template: ComponentStory<typeof CartBrand> = (args) => {
  const cartModel = toCartModel(cartMock);
  const item = cartModel.cartItemList[0].shippingGroupList[0].brandGroupList[1];

  const onDelete = useCallback(() => {
    return Promise.resolve('');
  }, []);
  const onChange = useCallback(() => {
    return Promise.resolve();
  }, []);

  return (
    <CartBrand {...args} brand={item.brand} cartDataList={item.cartDataList} onDelete={onDelete} onChange={onChange} />
  );
};
export const Basic = Template.bind({});
Basic.args = {};
