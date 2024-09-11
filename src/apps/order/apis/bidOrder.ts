import { baseApiClient } from '@utils/api';
import { BidCheckoutSchema, CheckoutOrderSchema } from '../schemas';

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

export interface BidOrderParam {
  payment: OrderPaymentInfo;
  recipient: OrderRecipientInfo;
  orderer: OrderOrdererInfo;
  isSavePaymentMethod?: boolean;
}

interface CreateOrderRequestParam {
  auctionId: number;
  param: BidOrderParam;
}

interface GetCheckoutRequestParam {
  auctionId: number;
}

export function getBidCheckout({ auctionId }: GetCheckoutRequestParam): Promise<BidCheckoutSchema> {
  return baseApiClient.get(`v1/order/checkout/auction/${auctionId}`);
}

export function createBidOrder({ auctionId, param }: CreateOrderRequestParam): Promise<CheckoutOrderSchema> {
  return baseApiClient.post(`/v1/order/auction/${auctionId}`, param);
}
