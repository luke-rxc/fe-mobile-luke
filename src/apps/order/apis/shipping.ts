import { baseApiClient } from '@utils/api';
import { CheckoutShippingListSchema, CheckoutShippingSchema } from '../schemas';

interface GetShippingRequestParam {
  page: number;
  size: number;
  sort: string;
}

type CreateShippingRequestParam = Omit<CheckoutShippingSchema, 'id' | 'createdDate' | 'updatedDate'>;

export function getShippingList(
  param: GetShippingRequestParam = { page: 1, size: 20, sort: '' },
): Promise<CheckoutShippingListSchema> {
  return baseApiClient.get('v1/user/shipping-address', param);
}

export function createShipping(param: CreateShippingRequestParam): Promise<CheckoutShippingSchema> {
  return baseApiClient.post('v1/user/shipping-address', param);
}

export function deleteShipping(shippingId: number): Promise<string> {
  return baseApiClient.delete(`v1/user/shipping-address/${shippingId}`);
}
