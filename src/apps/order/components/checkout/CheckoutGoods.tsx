import { OrderGoodsListItem } from '@pui/orderGoodsListItem';
import { CheckoutGoodsModel } from '../../models';

interface Props {
  item: CheckoutGoodsModel;
}

export const CheckoutGoods = ({ item }: Props) => {
  const {
    primaryImage: { path: src, blurHash },
  } = item;

  return (
    <OrderGoodsListItem
      goodsImage={{ src, blurHash }}
      brandName={item.brandName}
      goodsName={item.name}
      price={item.price}
      consumerPrice={item.consumerPrice}
      discountRate={item.discountRate}
      options={item.options}
      quantity={item.quantity}
    />
  );
};
