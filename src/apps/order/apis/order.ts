import { baseApiClient } from '@utils/api';
import { CheckoutOrderSchema, CheckoutSchema, InterestFreeCardSchema, OrderSchema } from '../schemas';

interface GetCheckoutRequestParam {
  checkoutId: number;
}

interface UpdateCheckoutRecipientInfoParam {
  checkoutId: number;
  recipient: {
    name?: string;
    phone?: string;
    postCode: string;
    address: string;
    addressDetail?: string;
  };
}

interface OrderPaymentInfo {
  orderPrice: number;
  paymentType: string;
  totalShippingCost: number;
  prizmPayId?: number;
  useCartCouponDownloadId?: number;
  cartCouponSale?: number;
  useCouponList?: {
    couponDownloadId: number;
    couponSale: number;
    goodsId: number;
  }[];
  usePoint?: number;
  cardInstallmentPlan: number | null;
}

interface OrderRecipientInfo {
  name: string;
  phone: string;
  postCode?: string;
  address?: string;
  addressDetail?: string;
  pcccNumber?: string;
  deliveryRequestMessage?: string;
  isSaveShippingAddress?: boolean;
}

interface OrderOrdererInfo {
  name: string;
  phone: string;
}

export interface OrderParam {
  payment: OrderPaymentInfo;
  recipient: OrderRecipientInfo;
  orderer: OrderOrdererInfo;
  isSavePaymentMethod?: boolean;
}

interface CreateOrderRequestParam {
  checkoutId: number;
  param: OrderParam;
}

interface GetOrderRequestParam {
  orderId: number;
}

interface GetLockTimeParam {
  checkoutId: number;
}

export function getCheckout({ checkoutId }: GetCheckoutRequestParam): Promise<CheckoutSchema> {
  return baseApiClient.get(`v1/order/checkout/${checkoutId}`);
}

export function updateRecipientInfo({
  checkoutId,
  recipient,
}: UpdateCheckoutRecipientInfoParam): Promise<CheckoutSchema> {
  return baseApiClient.post(`/v1/order/checkout/${checkoutId}/calculate`, { recipient });
}

export function createOrder({ checkoutId, param }: CreateOrderRequestParam): Promise<CheckoutOrderSchema> {
  return baseApiClient.post(`/v1/order/${checkoutId}`, param);
}

export function getOrder({ orderId }: GetOrderRequestParam): Promise<OrderSchema> {
  return baseApiClient.get(`/v1/order/${orderId}`);
}

export function getInterestFreeCardList(): Promise<InterestFreeCardSchema[]> {
  return baseApiClient.get('/v1/payment/promotion/interest-free-card');
}

export function getLockTime({ checkoutId }: GetLockTimeParam): Promise<number> {
  return baseApiClient.get(`/v1/order/checkout/${checkoutId}/lock-times`);
}
