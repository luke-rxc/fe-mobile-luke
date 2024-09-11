import { baseApiClient } from '@utils/api';

interface DeleteSeatLockParam {
  checkoutId: number;
}

export function deleteSeatLock({ checkoutId }: DeleteSeatLockParam) {
  return baseApiClient.delete(`/v1/order/checkout/${checkoutId}/lock`);
}
