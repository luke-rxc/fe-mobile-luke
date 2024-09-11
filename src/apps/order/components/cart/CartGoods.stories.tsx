import { ComponentStory, ComponentMeta } from '@storybook/react';
import { cartMock } from '../../apis/__mocks__/cart';
import { CartGoods, CartGoodsComponent } from './CartGoods';
import { toCartModel } from '../../models';

export default {
  title: 'Features/Order/CartGoods',
  component: CartGoods,
} as ComponentMeta<typeof CartGoodsComponent>;

const Template: ComponentStory<typeof CartGoodsComponent> = (args) => {
  const cartModel = toCartModel(cartMock);
  const item = cartModel.cartItemList[0].shippingGroupList[0].brandGroupList[0].cartDataList[0];
  const {
    cartId,
    goods: {
      primaryImage: { path: src, blurHash },
      name: goodsName,
      discountRate,
      options,
    },
    isBuyable,
    purchasableStock,
    quantity,
  } = item;
  return (
    <>
      <CartGoods
        {...args}
        cartId={cartId}
        goodsImage={{ blurHash, src }}
        goodsName={goodsName}
        discountRate={discountRate}
        options={options}
        isBuyable={isBuyable}
        quantity={quantity}
        purchasableStock={purchasableStock}
      />
      <div style={{ height: '300px', background: 'red' }} />
    </>
  );
};
export const Basic = Template.bind({});
Basic.args = {};
