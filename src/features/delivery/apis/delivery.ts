import { baseApiClient } from '@utils/api';
import { DeliveryListSchema, DeliverySchema } from '../schemas';

interface GetShippingRequestParam {
  params?: {
    page: number;
    size: number;
    sort: string;
  };
}

interface GetShippingItemRequestParam {
  shippingId: number;
}

interface CreateShippingRequestParam {
  params: Omit<DeliverySchema, 'id' | 'createdDate' | 'updatedDate'>;
}

interface UpdateShippingRequestParam {
  shippingId: number;
  params: Omit<DeliverySchema, 'id' | 'createdDate' | 'updatedDate'>;
}

export interface UpdateOrderShippingInfoRequestParam {
  orderId: number | string;
  address: string;
  addressDetail: string;
  name: string;
  phone: string;
  postCode: string;
}

export function getDeliveryList({
  params = { page: 1, size: 20, sort: '' },
}: GetShippingRequestParam): Promise<DeliveryListSchema> {
  return baseApiClient.get('v1/user/shipping-address', params);
}

export function getDeliveryItem({ shippingId }: GetShippingItemRequestParam): Promise<DeliverySchema> {
  return baseApiClient.get(`v1/user/shipping-address/${shippingId}`);
}

export function createDelivery({ params }: CreateShippingRequestParam): Promise<DeliverySchema> {
  return baseApiClient.post('v1/user/shipping-address', params);
}

export function updateDelivery({ shippingId, params }: UpdateShippingRequestParam): Promise<DeliverySchema> {
  return baseApiClient.put(`v1/user/shipping-address/${shippingId}`, params);
}
export function updateShippingDefault(shippingId: number): Promise<DeliverySchema> {
  return baseApiClient.put(`v1/user/shipping-address/${shippingId}/default`);
}

export function deleteDelivery(shippingId: number): Promise<string> {
  return baseApiClient.delete(`v1/user/shipping-address/${shippingId}`);
}

/**
 * 주문 배송지 변경 API
 *
 * @see https://api-dev.prizm.co.kr/swagger-ui/#/order-history-api/updateOrderShippingInfoUsingPUT
 */
export function updateOrderShippingInfo({ orderId, ...recipient }: UpdateOrderShippingInfoRequestParam) {
  return baseApiClient.put<string>(`v1/order/history/${orderId}/shipping-info`, { recipient });
}

/**
 * 교환 배송지 정보 변경 요청 Request Parameters
 */
export interface UpdateExchangeShippingInfoRequest {
  cancelOrReturnId?: number | string;
  recipient: {
    name: string;
    phone: string;
    address: string;
    addressDetail: string | null;
    postCode: string;
  };
}

/**
 * 교환 배송지 정보 변경 API
 */
export const updateExchangeShippingInfo = ({ cancelOrReturnId, recipient }: UpdateExchangeShippingInfoRequest) => {
  return baseApiClient.put<string>(`/v1/cancel-return-exchange/${cancelOrReturnId}/exchange-shipping-info`, {
    recipient,
  });
};
