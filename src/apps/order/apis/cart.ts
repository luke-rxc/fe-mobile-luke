import { baseApiClient } from '@utils/api';
import { CartSchema } from '../schemas';

export interface DeleteCartParam {
  cartIds: number[];
}

export interface DeleteCartItemParam {
  cartId: number;
}

export interface AddToCartRequestParam {
  items: {
    optionIds: number[];
    quantity: number;
  }[];
  saleProviderId: number;
}

export interface UpdatePriceInfoParam {
  cartIdList: number[];
}

export interface UpdateCartQuantityParam {
  cartId: number;
  quantity: number;
}

export interface CreateCheckoutParam {
  cartIdList: number[];
}

export const getCart = (): Promise<CartSchema> => {
  return baseApiClient.get('/v1/cart');
};

export const deleteCart = ({ cartIds }: DeleteCartParam): Promise<string> => {
  return baseApiClient.delete('/v1/cart', { cartIds });
};

export const deleteCartItem = ({ cartId }: DeleteCartItemParam): Promise<string> => {
  return baseApiClient.delete(`/v1/cart/${cartId}`);
};

export const updatePriceInfo = ({ cartIdList }: UpdatePriceInfoParam): Promise<CartSchema> => {
  return baseApiClient.post('/v1/cart/calculate', { cartIdList });
};

export const updateCartQuantity = ({ cartId, quantity }: UpdateCartQuantityParam): Promise<CartSchema> => {
  return baseApiClient.put(`/v1/cart/${cartId}/quantity/${quantity}`);
};

export const createCheckout = ({
  cartIdList,
}: CreateCheckoutParam): Promise<{
  orderCheckoutId: number;
}> => {
  return baseApiClient.post('/v1/order/checkout', { cartIdList });
};
